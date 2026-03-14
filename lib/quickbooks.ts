export interface QBToken {
  access_token: string;
  refresh_token: string;
  expires_at: number; // Timestamp
  x_refresh_token_expires_at: number; // Timestamp
  realmId: string;
}

export const QB_CONFIG = {
  clientId: process.env.QUICKBOOKS_CLIENT_ID!,
  clientSecret: process.env.QUICKBOOKS_CLIENT_SECRET!,
  environment: (process.env.QUICKBOOKS_ENVIRONMENT as 'sandbox' | 'production') || 'sandbox',
  authUri: 'https://appcenter.intuit.com/connect/oauth2',
  tokenUri: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
  apiUri: (process.env.QUICKBOOKS_ENVIRONMENT === 'production') 
    ? 'https://quickbooks.api.intuit.com/v3/company' 
    : 'https://sandbox-quickbooks.api.intuit.com/v3/company',
};

export function getQBAuthUrl(redirectUri: string) {
  const params = new URLSearchParams({
    client_id: QB_CONFIG.clientId,
    response_type: 'code',
    scope: 'com.intuit.quickbooks.accounting',
    redirect_uri: redirectUri,
    state: 'soyuz-sync-state', // In production, use a secure CSRF token
  });
  return `${QB_CONFIG.authUri}?${params.toString()}`;
}

export async function exchangeQBCode(code: string, realmId: string, redirectUri: string): Promise<QBToken> {
  const authHeader = Buffer.from(`${QB_CONFIG.clientId}:${QB_CONFIG.clientSecret}`).toString('base64');
  
  const response = await fetch(QB_CONFIG.tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`QuickBooks Token Exchange Failed: ${error}`);
  }

  const data = await response.json();
  const now = Date.now();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: now + data.expires_in * 1000,
    x_refresh_token_expires_at: now + data.x_refresh_token_expires_in * 1000,
    realmId,
  };
}

export async function refreshQBToken(refreshToken: string): Promise<QBToken> {
  const authHeader = Buffer.from(`${QB_CONFIG.clientId}:${QB_CONFIG.clientSecret}`).toString('base64');
  
  const response = await fetch(QB_CONFIG.tokenUri, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${authHeader}`,
      'Accept': 'application/json',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`QuickBooks Token Refresh Failed: ${error}`);
  }

  const data = await response.json();
  const now = Date.now();

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: now + data.expires_in * 1000,
    x_refresh_token_expires_at: now + data.x_refresh_token_expires_in * 1000,
    realmId: '', // To be filled from existing store
  };
}

export async function getQBInventoryItems(token: QBToken) {
  // Broaden query to see what's actually there
  const query = "SELECT * FROM Item WHERE Active = true";
  const url = `${QB_CONFIG.apiUri}/${token.realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;

  console.log(`[QB Audit] Fetching all active items for Realm: ${token.realmId}`);
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[QB Audit] Query Failed:`, error);
    throw new Error(`QuickBooks Query Failed: ${error}`);
  }

  const data = await response.json();
  const allItems = data.QueryResponse.Item || [];
  
  console.log(`[QB Audit] Found ${allItems.length} total active items.`);
  
  // Log types for debugging
  const typeCounts: Record<string, number> = {};
  allItems.forEach((i: any) => {
    typeCounts[i.Type] = (typeCounts[i.Type] || 0) + 1;
    if (!i.Sku) {
      // console.log(`[QB Audit] Item "${i.Name}" missing SKU (Type: ${i.Type})`);
    }
  });
  console.log(`[QB Audit] Item Types Summary:`, typeCounts);

  // Filter for items we can actually use - now allowing missing SKU as we will fallback to Name or ID
  const validItems = allItems.filter((item: any) => {
    const isProductType = ['Inventory', 'NonInventory', 'Service'].includes(item.Type);
    const isHockeyStick = 
      item.Name.toLowerCase().includes('hockey stick') || 
      item.Name.toLowerCase().includes('baton') ||
      (item.Description && item.Description.toLowerCase().includes('hockey stick'));
    
    return isProductType && isHockeyStick;
  });

  console.log(`[QB Audit] Filtered down to ${validItems.length} hockey stick items for synchronization.`);
  return {
    items: validItems,
    audit: {
      total: allItems.length,
      types: typeCounts,
      valid: validItems.length
    }
  };
}

export async function syncQuickBooksInventory() {
  try {
    const { getSupabaseAdmin } = await import('./supabase-admin');
    const supabase = getSupabaseAdmin();

    // 1. Get Token from DB
    const { data: configData, error: configError } = await (supabase.from('app_config') as any)
      .select('value')
      .eq('key', 'quickbooks_token')
      .single();

    if (configError || !configData) {
      throw new Error('QuickBooks not connected. Please authenticate in Admin.');
    }

    let token = configData.value as QBToken;

    // 2. Check Expiry and Refresh if needed
    if (Date.now() >= token.expires_at) {
      console.log('QB Token expired, refreshing...');
      const newToken = await refreshQBToken(token.refresh_token);
      token = { ...token, ...newToken, realmId: token.realmId };
      
      await (supabase.from('app_config') as any).upsert({
        key: 'quickbooks_token',
        value: token,
        updated_at: new Date().toISOString(),
      });
    }

    // 3. Fetch Items
    const qbRes = await getQBInventoryItems(token);
    const qbItems = qbRes.items;
    console.log(`Fetched ${qbItems.length} items from QBO.`);

    // 4. Update Supabase
    let updatedCount = 0;
    for (const item of qbItems) {
      // Logic for SKU: fallback to ID-based name if missing
      const effectiveSku = item.Sku || `QB-${item.Id}`;
      const effectiveName = item.Name || effectiveSku;

      if (!item.Sku) {
        console.log(`[QB Sync] Item "${item.Name}" has no SKU. Using fallback: ${effectiveSku}`);
      }

      // Check if variant exists
      const { data: variant, error: variantError } = await (supabase
        .from('product_variants') as any)
        .select('id, product_id')
        .eq('sku', effectiveSku)
        .maybeSingle();

      if (variantError) {
        console.error(`Error checking SKU ${item.Sku}:`, variantError);
        continue;
      }

      let variantId = variant?.id;
      let productId = variant?.product_id;

      // If variant doesn't exist, create product and variant
      if (!variantId) {
        console.log(`SKU ${item.Sku} not found. Creating new product and variant...`);
        
        // Create Product
        const { data: newProduct, error: productError } = await (supabase
          .from('products') as any)
          .insert({
            name: effectiveName,
            slug: effectiveName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
            description: item.Description || '',
            category: 'QuickBooks Import',
            is_active: true
          })
          .select('id')
          .single();

        if (productError) {
          console.error(`Error creating product for SKU ${item.Sku}:`, productError);
          continue;
        }

        productId = newProduct.id;

        // Create Variant
        const { data: newVariant, error: newVariantError } = await (supabase
          .from('product_variants') as any)
          .insert({
            product_id: productId,
            sku: effectiveSku,
            name: effectiveName,
            stock_qty: Math.max(0, item.QtyOnHand || 0),
            price_retail: item.UnitPrice || 0,
            updated_at: new Date().toISOString()
          })
          .select('id')
          .single();

        if (newVariantError) {
          console.error(`Error creating variant for SKU ${item.Sku}:`, newVariantError);
          continue;
        }
        variantId = newVariant.id;
      } else {
        // Update existing variant
        const { error: updateError } = await (supabase
          .from('product_variants') as any)
          .update({
            stock_qty: Math.max(0, item.QtyOnHand || 0),
            price_retail: item.UnitPrice || 0,
            updated_at: new Date().toISOString(),
          })
          .eq('sku', effectiveSku);

        if (updateError) {
          console.error(`Error updating SKU ${item.Sku}:`, updateError);
        }
      }
      updatedCount++;
    }

    return { 
      success: true, 
      count: updatedCount,
      audit: qbRes.audit
    };
  } catch (error: any) {
    console.error('syncQuickBooksInventory exception:', error);
    return { success: false, error: error.message || String(error) };
  }
}

/**
 * Creates a new inventory item in QuickBooks
 */
export async function createQBItem(token: QBToken, itemData: {
  name: string;
  sku: string;
  description?: string;
  price: number;
  qty: number;
}) {
  // Account IDs for Sandbox (from quickbooks_ids_lookup)
  const INCOME_ACCOUNT_ID = '79'; // Sales of Product Income
  const EXPENSE_ACCOUNT_ID = '80'; // Cost of Goods Sold
  const ASSET_ACCOUNT_ID = '81'; // Inventory Asset
  const CATEGORY_ID = '19'; // Hockey Sticks

  const body = {
    Name: itemData.name,
    Sku: itemData.sku,
    Description: itemData.description || '',
    Type: 'Inventory',
    IncomeAccountRef: { value: INCOME_ACCOUNT_ID },
    ExpenseAccountRef: { value: EXPENSE_ACCOUNT_ID },
    AssetAccountRef: { value: ASSET_ACCOUNT_ID },
    ParentRef: { value: CATEGORY_ID },
    UnitPrice: itemData.price,
    QtyOnHand: itemData.qty,
    InvStartDate: new Date().toISOString().split('T')[0], // Today
    TrackQtyOnHand: true
  };

  const url = `${QB_CONFIG.apiUri}/${token.realmId}/item?minorversion=65`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[QB Create] Failed:`, error);
    throw new Error(`QuickBooks Create Item Failed: ${error}`);
  }

  return await response.json();
}

/**
 * Updates stock quantity in QuickBooks (Adjustment)
 */
export async function updateQBStock(token: QBToken, qbItemId: string, sku: string, adjustment: number) {
  // In QBO, we usually need to fetch the item first to get the current SyncToken
  const url = `${QB_CONFIG.apiUri}/${token.realmId}/item/${qbItemId}?minorversion=65`;
  
  const getRes = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  });

  if (!getRes.ok) {
    throw new Error(`Failed to fetch item for stock update: ${await getRes.text()}`);
  }

  const item = (await getRes.json()).Item;
  
  // NOTE: QBO Item update for QtyOnHand requires an InventoryAdjustment entity 
  // OR a full Item update if allowed (but usually QtyOnHand is read-only in direct Item update)
  // For simplicity here, we assume we are just updating the Item UnitPrice or other fields,
  // but for STOCK specifically, it's safer to use the 'Quantity On Hand' adjustment if needed.
  // However, most integrations prefer to let QBO be the master.
  
  console.log(`[QB Stock Update] Item ${sku} found. Current Qty: ${item.QtyOnHand}. Adjustment: ${adjustment}`);
  
  // If we want to force update the qty (caution):
  // QBO actually requires a 'Quantity Adjustment' transaction for inventory.
  // For now, let's log this and implement if user confirms they want Soyuz to be master of stock.
  return { success: true, message: "Stock adjustment logic logged. Deployment pending master-slave confirmation." };
}

/**
 * Finds a QuickBooks Item ID by its SKU
 */
export async function findQBItemBySku(token: QBToken, sku: string): Promise<string | null> {
  const query = `SELECT * FROM Item WHERE Sku = '${sku}'`;
  const url = `${QB_CONFIG.apiUri}/${token.realmId}/query?query=${encodeURIComponent(query)}&minorversion=65`;

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Accept': 'application/json',
    },
  });

  if (!response.ok) return null;
  const data = await response.json();
  const item = data.QueryResponse.Item?.[0];
  return item ? item.Id : null;
}

/**
 * Creates a SalesReceipt in QuickBooks to record a sale and deduct stock
 */
export async function createQBSalesReceipt(token: QBToken, orderData: {
  customerName: string;
  customerEmail: string;
  items: { sku: string; quantity: number; amount: number; description: string }[];
}) {
  const lineItems = [];
  
  for (const item of orderData.items) {
    const qbItemId = await findQBItemBySku(token, item.sku);
    
    if (qbItemId) {
      lineItems.push({
        Description: item.description,
        Amount: item.amount,
        DetailType: 'SalesItemLineDetail',
        SalesItemLineDetail: {
          ItemRef: { value: qbItemId },
          Qty: item.quantity,
          UnitPrice: item.amount / item.quantity
        }
      });
    } else {
      console.warn(`[QB SalesReceipt] SKU ${item.sku} not found in QuickBooks. Skipping line item.`);
    }
  }

  if (lineItems.length === 0) {
    console.error('[QB SalesReceipt] No matching items found in QuickBooks for this order.');
    return { success: false, error: 'No matching items in QB' };
  }

  const body = {
    Line: lineItems,
    CustomerRef: { name: orderData.customerName || orderData.customerEmail },
    // You can add more mapping here (PaymentMethodRef, DepositToAccountRef, etc.)
  };

  const url = `${QB_CONFIG.apiUri}/${token.realmId}/salesreceipt?minorversion=65`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    console.error(`[QB SalesReceipt] Failed:`, error);
    throw new Error(`QuickBooks SalesReceipt Creation Failed: ${error}`);
  }

  return await response.json();
}


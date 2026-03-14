import { syncErplainProducts } from './erplain';
import { getQBInventoryItems, createQBItem, QBToken, refreshQBToken } from './quickbooks';
import { getSupabaseAdmin } from './supabase-admin';

/**
 * Service to push missing Erplain products to QuickBooks
 */
export async function pushErplainProductsToQB() {
  console.log('[Sync] Starting Erplain to QuickBooks Push...');
  
  const supabase = getSupabaseAdmin();

  // 1. Get QB Token
  const { data: configData } = await (supabase.from('app_config') as any)
    .select('value')
    .eq('key', 'quickbooks_token')
    .single();

  if (!configData) {
    throw new Error('QuickBooks non connecté. Connexion requise.');
  }

  let token = configData.value as QBToken;

  // Refresh token if needed
  if (Date.now() >= token.expires_at) {
    console.log('[Sync] QB Token expired, refreshing for Erplain push...');
    const newToken = await refreshQBToken(token.refresh_token);
    token = { ...token, ...newToken, realmId: token.realmId };
    await (supabase.from('app_config') as any).upsert({
      key: 'quickbooks_token',
      value: token,
      updated_at: new Date().toISOString()
    });
  }

  // 2. Fetch all products from Supabase (synced from Erplain previously)
  const { data: epProducts, error: epError } = await (supabase
    .from('product_variants')
    .select('*, products(*)') as any)
    .not('sku', 'is', null);

  if (epError) throw epError;

  // 3. Get existing items in QB
  const qbRes = await getQBInventoryItems(token);
  const qbSkus = new Set(qbRes.items.map((i: any) => i.Sku));

  console.log(`[Sync] Found ${(epProducts as any[]).length} variants in DB. QB has ${qbSkus.size} items.`);

  let createdCount = 0;
  let skippedCount = 0;

  for (const variant of (epProducts as any[])) {
    // 4. Filter for Hockey Sticks only
    const name = variant.name || variant.products?.name || '';
    const isHockeyStick = 
      name.toLowerCase().includes('hockey stick') || 
      name.toLowerCase().includes('baton');

    if (!isHockeyStick) {
      skippedCount++;
      continue;
    }

    // 5. Check if already in QB
    if (qbSkus.has(variant.sku)) {
      // console.log(`[Sync] Skipping ${variant.sku} - already exists in QB.`);
      continue;
    }

    // 6. Push to QB
    try {
      console.log(`[Sync] Creating ${variant.sku} (${name}) in QuickBooks...`);
      await createQBItem(token, {
        name: name,
        sku: variant.sku,
        description: variant.products?.description || '',
        price: variant.price_retail || 0,
        qty: variant.stock_qty || 0
      });
      createdCount++;
    } catch (err: any) {
      console.error(`[Sync] Error pushing ${variant.sku} to QB:`, err.message);
    }
  }

  console.log(`[Sync] Push Completed: ${createdCount} created, ${skippedCount} skipped (non-hockey sticks).`);
  
  return {
    success: true,
    created: createdCount,
    skipped: skippedCount
  };
}

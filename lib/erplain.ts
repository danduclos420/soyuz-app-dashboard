import { supabaseAdmin } from './supabase-admin';

function getErplainConfig() {
  const key = process.env.ERPLAIN_API_KEY;
  const subdomain = process.env.ERPLAIN_SUBDOMAIN;
  
  if (!key || !subdomain) {
    throw new Error('Missing Erplain API configuration (ERPLAIN_API_KEY or ERPLAIN_SUBDOMAIN)');
  }
  
  return {
    key,
    subdomain,
    url: `https://${subdomain}.erplain.app/api/v1`,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  };
}

export async function fetchFromErplain(endpoint: string) {
  const { url: baseUrl, headers } = getErplainConfig();
  const url = `${baseUrl}/${endpoint}`;
  console.log(`Fetching from Erplain: ${url}`);
  try {
    const response = await fetch(url, { headers });
    if (!response.ok) {
      const errorData = await response.text();
      console.error(`Erplain API error (${response.status}):`, errorData);
      throw new Error(`Erplain API error: ${response.status} ${response.statusText}`);
    }
    return response.json();
  } catch (err: any) {
    console.error(`Fetch failed for ${url}:`, err.message);
    throw err;
  }
}

export async function syncErplainProducts() {
  try {
    const { url: apiURL } = getErplainConfig();
    console.log('Starting Erplain sync... URL:', apiURL);
    
    // 1. Fetch products from Erplain
    const data = await fetchFromErplain('products');
    const products = data.products || [];

    for (const epProduct of products) {
      console.log(`Syncing product: ${epProduct.name}`);
      const slug = epProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { data: savedProduct, error: pError } = await supabaseAdmin
        .from('products')
        .upsert({
          erplain_id: epProduct.id.toString(),
          name: epProduct.name,
          slug,
          description: epProduct.description || '',
          category: epProduct.category || 'Hockey Sticks',
          is_active: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'erplain_id' })
        .select()
        .single();

      if (pError) {
        console.error(`Error syncing product ${epProduct.name}:`, pError.message);
        continue;
      }

      // 3. Sync Variants
      if (epProduct.variants && Array.isArray(epProduct.variants)) {
        for (const epVariant of epProduct.variants) {
          const nameParts = epVariant.name.split(' - ');
          const flex = nameParts.find((p: string) => /\d+/.test(p)) || null;
          
          let side: 'left' | 'right' | null = null;
          if (epVariant.name.toLowerCase().includes('left')) side = 'left';
          else if (epVariant.name.toLowerCase().includes('right')) side = 'right';

          const { error: vError } = await supabaseAdmin
            .from('product_variants')
            .upsert({
              product_id: savedProduct.id,
              erplain_variant_id: epVariant.id.toString(),
              sku: epVariant.sku || `EP-${epVariant.id}`,
              name: epVariant.name,
              flex,
              side,
              price_retail: Number(epVariant.price_retail) || 0,
              price_b2b: epVariant.price_b2b ? Number(epVariant.price_b2b) : null,
              stock_qty: Math.max(0, Number(epVariant.stock_on_hand) || 0),
              is_active: true,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'erplain_variant_id' });

          if (vError) {
            console.error(`Error syncing variant ${epVariant.name}:`, vError.message);
          }
        }
      }
    }

    console.log('Erplain sync completed successfully.');
    return { success: true };
  } catch (error: any) {
    console.error('Erplain sync failed:', error.message || error);
    return { success: false, error: error.message || String(error) };
  }
}

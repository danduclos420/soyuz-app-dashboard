import { supabaseAdmin } from './supabase-admin';

const ERPLAIN_API_KEY = process.env.ERPLAIN_API_KEY!;
const ERPLAIN_SUBDOMAIN = process.env.ERPLAIN_SUBDOMAIN!;
const ERPLAIN_API_URL = `https://${ERPLAIN_SUBDOMAIN}.erplain.app/api/v1`;

const headers = {
  'Authorization': `Bearer ${ERPLAIN_API_KEY}`,
  'Accept': 'application/json',
  'Content-Type': 'application/json',
};

export async function fetchFromErplain(endpoint: string) {
  const response = await fetch(`${ERPLAIN_API_URL}/${endpoint}`, { headers });
  if (!response.ok) {
    throw new Error(`Erplain API error: ${response.statusText}`);
  }
  return response.json();
}

export async function syncErplainProducts() {
  try {
    console.log('Starting Erplain sync...');
    
    // 1. Fetch products from Erplain
    // Note: Erplain API pagination might be needed for large catalogs
    const data = await fetchFromErplain('products');
    const products = data.products || [];

    for (const epProduct of products) {
      // 2. Map Erplain Product to Supabase Product
      const slug = epProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { data: savedProduct, error: pError } = await supabaseAdmin
        .from('products')
        .upsert({
          erplain_id: epProduct.id.toString(),
          name: epProduct.name,
          slug,
          description: epProduct.description,
          category: epProduct.category || 'Hockey Sticks',
          is_active: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'erplain_id' })
        .select()
        .single();

      if (pError) {
        console.error(`Error syncing product ${epProduct.name}:`, pError);
        continue;
      }

      // 3. Fetch variants for this product
      // Erplain usually returns variants within the product call or requires a separate fetch
      if (epProduct.variants) {
        for (const epVariant of epProduct.variants) {
          // Map side, flex, lie if possible from variant name or attributes
          // Example: "SOYUZ BULL - 85 - LEFT"
          const nameParts = epVariant.name.split(' - ');
          const flex = nameParts.find((p: string) => /\d+/.test(p));
          const side = epVariant.name.toLowerCase().includes('left') ? 'left' : 
                       epVariant.name.toLowerCase().includes('right') ? 'right' : null;

          await supabaseAdmin
            .from('product_variants')
            .upsert({
              product_id: savedProduct.id,
              erplain_variant_id: epVariant.id.toString(),
              sku: epVariant.sku,
              name: epVariant.name,
              flex,
              side,
              price_retail: epVariant.price_retail || 0,
              price_b2b: epVariant.price_b2b || null,
              stock_qty: epVariant.stock_on_hand || 0,
              is_active: true,
              updated_at: new Date().toISOString(),
            }, { onConflict: 'erplain_variant_id' });
        }
      }
    }

    console.log('Erplain sync completed successfully.');
    return { success: true };
  } catch (error) {
    console.error('Erplain sync failed:', error);
    return { success: false, error };
  }
}

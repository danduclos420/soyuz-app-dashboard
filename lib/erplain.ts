import { supabaseAdmin } from './supabase-admin';

function getErplainConfig() {
  const key = process.env.ERPLAIN_API_KEY;
  const url = process.env.ERPLAIN_API_URL || 'https://app.erplain.net/public-api/graphql/endpoint';
  
  if (!key) {
    throw new Error('Missing Erplain API Key (ERPLAIN_API_KEY)');
  }
  
  return {
    key,
    url,
    headers: {
      'Authorization': `Bearer ${key}`,
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    }
  };
}

export async function syncErplainProducts() {
  try {
    const { url, headers } = getErplainConfig();
    console.log('Starting Erplain GraphQL sync... URL:', url);
    
    // GraphQL Query as specified in README
    const query = `
      query {
        products {
          id
          name
          reference
          description
          category {
            name
          }
          price_retail
          price_b2b
          stock_on_hand
          images {
            url
          }
          variants {
            id
            name
            sku
            price_retail
            price_b2b
            stock_on_hand
          }
        }
      }
    `;

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erplain API error (${response.status}): ${errorText}`);
    }

    const { data } = await response.json();
    const products = data?.products || [];
    console.log(`Fetched ${products.length} products from Erplain.`);

    for (const epProduct of products) {
      const slug = epProduct.name.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
      
      const { data: savedProduct, error: pError } = await supabaseAdmin
        .from('products')
        .upsert({
          erplain_id: epProduct.id.toString(),
          name: epProduct.name,
          slug,
          description: epProduct.description || '',
          category: epProduct.category?.name || 'Hockey Sticks',
          images: epProduct.images?.map((img: any) => img.url) || [],
          is_active: true,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'erplain_id' })
        .select()
        .single();

      if (pError) {
        console.error(`Error syncing product ${epProduct.name}:`, pError.message);
        continue;
      }

      // Sync Variants
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
              sku: epVariant.sku || epVariant.reference || `EP-${epVariant.id}`,
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

import openSearchClient from "@/app/api/_lib/opensearch";

import { getLoggedInUsername } from "../../_lib/session";

export async function GET(){

    const index = 'stores'

    const {token_exists, username} = await getLoggedInUsername()

    try {
        const result = await openSearchClient.search({
          index,
          body: {
            query: {
              term: {
                username
              }
            }
          }
        });
    
        const stores = result.body.hits.hits.map(hit => ({id: hit._id, ...hit._source}));

        return new Response(JSON.stringify({stores, success: true}))
        
    } catch (error) {

        return new Response(JSON.stringify({ success: false, message: error.message}))
    
    }
}

export async function POST(request) {
  const index = 'stores';

  const {token_exists, username} = await getLoggedInUsername()

  try {

    const data = await request.formData()
    
    const store_hash = data.get('store_hash') 
    const store_name = data.get('store_name')
    const access_token = data.get('access_token')

    if (!store_hash || !store_name || !access_token) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    // Check for duplicate store_hash for this username
    const existing = await openSearchClient.search({
      index,
      body: {
        query: {
          bool: {
            must: [
              { term: { username } },
              { term: { store_hash } }
            ]
          }
        }
      }
    });

    if (existing.body.hits.total.value > 0) {
      return new Response(
        JSON.stringify({ success: false, message: "Store already exists for this user." }),
        { status: 409 }
      );
    }

    // Proceed to index new store
    const newStore = {
      username,
      store_hash,
      store_name,
      access_token
    };

    await openSearchClient.index({
      index,
      body: newStore
    });

    return new Response(JSON.stringify({ success: true, message: "Store added successfully" }));

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

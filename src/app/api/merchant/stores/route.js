import openSearchClient from "@/app/api/_lib/opensearch";

import { getLoggedInUsername } from "../../_lib/session";

export async function GET(request){

    const index = 'stores'

    const {token_exists, username} = await getLoggedInUsername()

    const must =  [
      { term: { username } }
    ]

    const { searchParams } = request.nextUrl;
    const search_query = searchParams.get('search_query');
    const active_tab = searchParams.get('active_tab');
    
    if (search_query.trim().length > 0) {
      must.push({
        wildcard: {
          store_name: {
            value: `*${search_query.toLowerCase()}*`,
            case_insensitive: true
          }
        }
      });
    } else {
        must.push({
          term: { active_status:active_tab }
        });
    }

    try {
        const result = await openSearchClient.search({
          index,
          body: {
            query: {
              bool: {
                must
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

    const must =  [
      { term: { username } },
      { term: { store_hash } }
    ]

    // Check for duplicate store_hash for this username
    const existing = await openSearchClient.search({
      index,
      body: {
        query: {
          bool: {
            must
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
      access_token,
      active_status: "active"
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


export async function PUT(request) {
  const index = 'stores';

  const { token_exists, username } = await getLoggedInUsername();

  try {

    const data = await request.formData();

    const doc_id = data.get('doc_id');
    const store_name = data.get('store_name');
    const access_token = data.get('access_token');

    if (!doc_id  || !store_name) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required fields" }),
        { status: 400 }
      );
    }

    let updatedStore = {}

    if(!access_token ||  access_token.trim().length == 0)
      updatedStore = {store_name}
    else if(access_token && access_token.trim().length > 0)
      updatedStore = {store_name, access_token}
    


    // Update the existing document by doc_id
    await openSearchClient.update({
      index,
      id: doc_id,
      body: {
        doc: updatedStore
      }
    });

    return new Response(
      JSON.stringify({ success: true, message: "Store updated successfully" }),
      { status: 200 }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500 }
    );
  }
}

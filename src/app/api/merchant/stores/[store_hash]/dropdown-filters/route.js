import { readGoogleSheetColumns } from "@/app/api/_lib/google-sheet";
import openSearchClient from "@/app/api/_lib/opensearch";
import { getLoggedInUsername } from "@/app/api/_lib/session";

export async function GET(request, {params}){

    const index = 'stores';

    const store_hash = params.store_hash

    const {token_exists, username} = await getLoggedInUsername()
    
    try {
      
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
      
      if (!(existing.body.hits.total.value > 0)) 
        throw new Error("Error - Store not found")

        let storeData = existing.body.hits.hits.map(s => ({id: s._id, ...s._source}))[0]

        let spreadsheet_url = storeData.spreadsheet_url

        if(!spreadsheet_url ||  spreadsheet_url == undefined || spreadsheet_url == null || 
            spreadsheet_url.trim().length == 0
        )
            throw new Error("Error - Store lacks fitment data")
        
        let allSpreadSheetColumns = await readGoogleSheetColumns(spreadsheet_url) 

        return new Response(
            JSON.stringify({ success: true, allSpreadSheetColumns, storeData}),
            { status: 200 }
        );

    } catch (error) {

      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500 }
      );

    }
}

export async function POST(request){

    try{

        const data = await request.formData()

        const columnContainingProductIDs = data.get('columnContainingProductIDs') 
        
        let selectedDropdownFilters = JSON.parse(data.get('selectedDropdownFilters')) 
        
        selectedDropdownFilters = selectedDropdownFilters.map((df, index) =>(
          {
            key: df.trim().replaceAll(' ', '-').replace(/[^a-zA-Z0-9-]/g, ''),
            label: df.trim(),
            sort_order: index 
          }
        ))

        const docID = data.get('doc_id')

        await openSearchClient.update({
          index: 'stores',
          id: docID,
          body: {
            doc: {
              columnContainingProductIDs,
              selectedDropdownFilters
            }
          }
        });

        return new Response(JSON.stringify({success: true, message: 'Dropdown Filters updated' }))

    }catch(error){

        return new Response(JSON.stringify({success: false, message: error.message}))
      
    }

}
import openSearchClient from "@/app/api/_lib/opensearch";

export function validateSpreadsheetURL(url) {
    if (!url || typeof url !== 'string' || !url.trim()) {
      throw new Error('Invalid URL: empty or not a string');
    }
  
    try {
      new URL(url);
    } catch {
      throw new Error('Invalid URL: malformed');
    }
  }

export async function POST(request){

    try{


        const data = request.formData() 

        const newSpreadSheetURL = data.get('spreadsheet_url') 
        const docID = data.get('doc_id')

        validateSpreadsheetURL(newSpreadSheetURL);

        await client.update({
            index: 'stores',
            id: docID,
            doc: {
              spreadsheet_url: newSpreadSheetURL
            }
        });

        return new Response(JSON.stringify({success: true, message: 'Spreadsheet updated' }))

    }catch(error){
        return new Response(JSON.stringify({success: false, message: error.message}))
    }

}
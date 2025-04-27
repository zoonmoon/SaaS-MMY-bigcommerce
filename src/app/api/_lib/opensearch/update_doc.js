import openSearchClient from "@/app/api/_lib/opensearch";

export async function updateDoc(index, id, objWithPropsToUpdate){

    try{
        
        await openSearchClient.update({
            index: index,
            id: id,
            body: {
                doc: objWithPropsToUpdate
            }
        });
    
        return true 

    }catch(error){
        throw error 
    }
    
}
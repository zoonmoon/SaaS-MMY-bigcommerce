import { Button } from "@mui/joy";
import { useState } from "react";
import toast from "react-hot-toast";

export function DangerZone({storeData}){
    
    const [isLoading, setIsLoading]= useState(false) 

    const buttonText = `${storeData.active_status == 'active' ? `Deactivate`: 'Activate'} ${storeData.store_name}`

    let buttonColor = storeData.active_status == 'active' ? `danger`: 'success'

    let endpointPath = storeData.active_status == 'active' ? `danger-zone`: 're-activate'

    const handleStatusChange =  async () => {

        try{

            setIsLoading(true)

            const response = await fetch(`/api/merchant/stores/${storeData.store_hash}/${endpointPath}`, { method: 'POST'})

            const responseJSON = await response.json() 

            if(responseJSON.success !== true ) throw new Error(responseJSON.message)
            
            toast(responseJSON.message)

            window.location.href = '/merchant/stores'
            
        }catch(error){

            toast(error.message)

        }finally{
            
            setIsLoading(false)
        
        }
    }

    return(
        <Button loading={isLoading} onClick={handleStatusChange} color={buttonColor}>{buttonText}</Button>
    )
}
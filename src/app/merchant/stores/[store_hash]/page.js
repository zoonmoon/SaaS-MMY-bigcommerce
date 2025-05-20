'use client'
import { Container } from "@mui/material"
import { useEffect, useState } from "react"
import { use } from 'react'
import toast from "react-hot-toast"
import StoreData from "./store_data"
import { LoadingSpinner } from "@/app/api/_lib/misc/utils"

export default function StoreDetails({params}){

    const { store_hash } = use(params)

    const [isLoading, setIsLoading] = useState(true) 

    const [storeData, setStoreData] = useState({})

    async function fetchStore(){

        try{    

            setIsLoading(true)
            
            const response   = await fetch(`/api/merchant/stores/${store_hash}`)

            const responseJSON = await response.json() 
            
            if(!responseJSON.success) throw new Error(responseJSON.message)
            
            setStoreData(responseJSON.storeData)
            
        }catch(error){
            
            toast(error.message)
            
        }finally{
            
            setIsLoading(false)
        
        }
        
    }

    const handleSpreadsheetURLChange = (newSpreadSheetURL) => {
        setStoreData((prev) => ({...prev, spreadsheet_url: newSpreadSheetURL}))
        patchChanges()
    }

    useEffect(()=> {
        fetchStore()
    }, [])

    return(
        <Container sx={{marginTop:'20px'}} maxWidth={'lg'}>
            {
                isLoading 
                    ? (
                        <LoadingSpinner  minHeight="200px"/>
                    ): (    
                        <StoreData storeData={storeData} />
                    )
            }
        </Container>
    )
}
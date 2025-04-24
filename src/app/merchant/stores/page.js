'use client'
import { Container, Grid, Paper } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function Stores({params}){
    const merchant = params.username

    const [isLoading, setIsLoading] = useState(true) 

    const [stores, setStores] = useState([])

    async function fetchStores(){

        try{

            const response   = await fetch(`/api/merchant/stores`)

            const responseJSON = await response.json() 

            if(!responseJSON.success) throw new Error(responseJSON.message)

            setStores(responseJSON.stores)

        }catch(error){
            toast(error.message)
        }finally{
            setIsLoading(false)
        }
        
    }

    useEffect(()=> {
        fetchStores()
    }, [])



    return(
        <Container maxWidth={'lg'} sx={{marginTop:'20px'}}>
            {
                isLoading 
                    ?(
                        <>
                            Loading
                        </>
                    ):(
                        <Grid container spacing={2}> 
                            {
                                stores.length > 0 ? 
                                    stores.map((store, index) => (
                                        <Grid item size={{xs: 12, md: 3}} key={index}>
                                            <Link  style={{all:'unset', cursor:'pointer'}} href={'/merchant/stores/'+store.store_hash}>
                                                <Paper sx={{padding:'10px'}}>
                                                    {store.store_name}
                                                </Paper>
                                            </Link>
                                        </Grid>
                                    ))
                                : (
                                    <div>No stores found</div>
                                )
                            }
                            
            
                            <Grid item size={{xs: 12, md: 3}}>
                                <Link style={{all:'unset', cursor:'pointer'}} 
                                    href={'/merchant/stores/new'}
                                >
                                    <Paper sx={{padding:'10px'}}>
                                        Add New Store
                                    </Paper>
                                </Link>
                            </Grid>
            
                        </Grid>
                    )
            }

        </Container>
    )
}
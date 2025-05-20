'use client'
import { LoadingSpinner } from "@/app/api/_lib/misc/utils"
import { Button } from "@mui/joy"
import { TabContext, TabList } from "@mui/lab"
import { Chip, Container, Divider, Grid, Pagination, Paper, Stack, Tab, TextField, Typography } from "@mui/material"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import CustomizedInputBase from "@/app/components/search_bar"
import StoreData from "./[store_hash]/store_data"

export default function Stores({params}){

    const merchant = params.username

    const [isLoading, setIsLoading] = useState(true) 

    const [activeTab, setActiveTab] = useState('active')

    const [searchQuery, setSearchQuery]= useState('')

    const [stores, setStores] = useState([])

    async function fetchStores(){

        try{

            setIsLoading(true)

            const params = []

            params.push('active_tab='+activeTab)
            params.push('search_query='+searchQuery)

            const response   = await fetch(`/api/merchant/stores?${params.join('&')}`)

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
    }, [searchQuery, activeTab])

    const handleTabChange = (event, newActiveTab) => {
        if(searchQuery.trim().length > 0) setSearchQuery('')
        setActiveTab(newActiveTab)
    }

    const handleSearchClick = (query) => {
        setSearchQuery(query); 
        if(query.trim().length == 0){setActiveTab('active')} 
        else{setActiveTab('sdfdsf')}   
    }

    return(
        <Container maxWidth={'lg'} sx={{marginTop:'20px'}}>
            <TabContext value={activeTab}>

                <Paper sx={{padding:'20px'}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                        <div>
                            <Typography variant={'h5'}>Stores</Typography>
                        </div>
                        <div>
                            <TabList onChange={handleTabChange} aria-label="lab API tabs example">
                                <Tab  label={'Active'} value={'active'} />
                                <Tab  label={'Inactive'} value={'inactive'} />
                            </TabList>
                        </div>
                        <div>
                            <CustomizedInputBase searchQueryParent={searchQuery} handleClick={handleSearchClick} />
                            {/* <TextField placeholder={`Search store`} fullWidth></TextField> */}
                        </div>
                        <div>
                            <Link style={{all:'unset', cursor:'pointer'}} 
                                href={'/merchant/stores/new'}
                            >
                                <Button variant={'outlined'}>Add new store</Button>
                            </Link>                    
                        </div>
                    </div>
                    <Divider sx={{marginTop:'20px', marginBottom:'30px'}}></Divider>
                    {
                        isLoading ? (
                            <LoadingSpinner />
                        ) : (
                                <Stack  spacing={4}>
                                    <Grid container  spacing={5}> 
                                        {
                                            stores.length > 0 ? 
                                                stores.map((store, index) => (
                                                    <Grid item size={{xs: 12, md: 3}} key={index}>
                                                        <Link  style={{all:'unset', cursor:'pointer'}} href={'/merchant/stores/'+store.store_hash}>
                                                            <Paper sx={{padding:'10px', textAlign:'center'}}>
                                                                <div>{store.store_name}</div>
                                                                {
                                                                    searchQuery.trim().length > 0 && (
                                                                        <>
                                                                            <Chip  
                                                                                sx={{marginTop:'5px'}} 
                                                                                size={'small'}
                                                                                label={store.active_status} 
                                                                                variant={'outlined'}
                                                                                color={store.active_status == 'inactive'? 'error' : 'success'}
                                                                            />
                                                                        </>
                                                                    )
                                                                }
                                                            </Paper>
                                                        </Link>
                                                    </Grid>
                                                ))
                                            : (
                                                <div>No stores found</div>
                                            )
                                        }
                                    </Grid>
                                    <Divider></Divider>
                                    <div style={{display:'flex', justifyContent:'center'}}>
                                        <Pagination size={'large'} count={1}></Pagination>
                                    </div>
                                </Stack>
                            )
                    }
                </Paper>
            </TabContext>
        </Container>
    )
}
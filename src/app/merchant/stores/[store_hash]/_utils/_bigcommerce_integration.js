import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Padding } from '@mui/icons-material';
import { Alert, Breadcrumbs, Chip, Divider, InputLabel, Paper, Stack, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/api/_lib/misc/utils';
import { Button } from '@mui/joy';


export  function calculatePostedAgo(date) {

    // convert date to seconds

    const now = new Date();
    const past = new Date(date);
    const seconds = Math.floor((now - past) / 1000); // difference in seconds

    if(seconds < 60){
        return 'just now'
    }

    const timeUnits = [
        { unit: 'yr', seconds: 31536000 }, // 60 * 60 * 24 * 365
        { unit: 'mo', seconds: 2592000 },  // 60 * 60 * 24 * 30
        { unit: 'd', seconds: 86400 },     // 60 * 60 * 24
        { unit: 'h', seconds: 3600 },      // 60 * 60
        { unit: 'm', seconds: 60 },        // 60
        { unit: 's', seconds: 1 }
    ];

    for (const { unit, seconds: unitSeconds } of timeUnits) {
        const count = Math.floor(seconds / unitSeconds);
        if (count >= 1) {
            return `${count}${unit} ago`;
        }
    }

}


export  function  ScriptManager({storeData}){

    const [bigCommerceIntegrationStatus, setBigCommerceIntegrationStatus] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(true)
    const [managingYmmScript, setManagingYmmScript] = React.useState(false )

    async function fetchScriptAndWidgetStatus(){
        
        try{
            
            setIsLoading(true) 

            const response = await fetch(`/api/merchant/stores/${storeData.store_hash}/bigcommerce-integration`)

            const responseJSON = await response.json() 

            if(responseJSON.success !== true) throw new Error(responseJSON.message)

            setBigCommerceIntegrationStatus(responseJSON)

        }catch(error){
            
            toast(error.message)
            
        }finally{
        
            setIsLoading(false) 
        
        }
    }

    React.useEffect(() => {
        fetchScriptAndWidgetStatus()
    }, [])


    const addYmmScript = async (successMessage, method = 'POST') => {
        console.log(method)
        try{
            
            setManagingYmmScript(true)

            const response = await fetch(
                `/api/merchant/stores/${storeData.store_hash}/bigcommerce-integration/script-manager`,
                {
                    method: method
                }
            )

            const responseJSON = await response.json()
            
            if(responseJSON.success !== true) throw new Error(responseJSON.message)
            
            toast(successMessage)

            fetchScriptAndWidgetStatus()

        }catch(error){
            toast(error.message)
        }finally{
            setManagingYmmScript(false)
        }
    }

    const updateScript = () => addYmmScript('Script updated', 'PUT')

    const addScript = () => addYmmScript('Script added', 'POST')

    if(isLoading) return(<LoadingSpinner />)
    
    return(

        <Stack spacing={2}>   
            {
                managingYmmScript && (
                    <Alert severity={'info'}>Adding YMM Script can take some time</Alert>
                )
            }
            {
                bigCommerceIntegrationStatus.scripts.length == 0 
                    ? (
                        <>
                            {
                                !managingYmmScript && (
                                    <Alert  severity={'warning'}>YMM script has not been added in BigCommerce Script Manager</Alert>
                                )
                            }
                            <div>
                                <Button loading={managingYmmScript} onClick={addScript} sx={{minWidth:'150px'}} variant={'solid'}>Add YMM Script</Button>
                            </div>
                        </>
                    ): (
                        bigCommerceIntegrationStatus.scripts.length > 1
                            ?(
                                <Alert severity={'error'}>
                                    More than one YMM script has been created for this script. Please delete unnecessary scripts from BigCommerce Script Manager so that is only one YMM script.
                                </Alert>
                            ): (
                                <>
                                    {
                                        !managingYmmScript && (
                                            <Alert severity={'success'}>
                                                YMM Script has been added to the BigCommerce Script Manager
                                            </Alert>
                                        )
                                    }
                                    <div>
                                        <Button loading={managingYmmScript} style={{minWidth:'200px'}} variant={'solid'} onClick={updateScript}>Update Script</Button>
                                    </div>
                                </>
                            )
                    )
            }
        </Stack>
    )
}

export function WidgetManager({storeData}){
    return(
        <>Widget Manager</>
    )
}


export function BigCommerceIntegration({storeData}){

    const tabData = (storeData) => {
        
        return  [
            {
                label: "YMM Script",
                tabContent: <ScriptManager storeData={storeData} />
            },
            {
                label: "YMM Widget",
                tabContent: <>Widget Manager</>
            },
        ]
    }

    const [value, setValue] = React.useState('0');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return(
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList textColor={'primary'}  onChange={handleChange} aria-label="lab API tabs example">
                        {
                            tabData(storeData).map((tab, index) => (
                                <Tab label={tab.label} value={index.toString()} />
                            ))
                        }
                    </TabList>
                </Box>
                {
                    tabData(storeData).map((tab, index) => (
                        <TabPanel key={index} value={index.toString()}>
                            {tab.tabContent}
                        </TabPanel>
                    ))
                }
            </TabContext>
        </Box>
    )
}
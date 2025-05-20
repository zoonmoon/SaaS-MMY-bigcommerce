import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Padding } from '@mui/icons-material';
import { Alert, Breadcrumbs, Chip, Divider, Grid, InputLabel, Paper, Slider, Stack, TextField, Typography } from '@mui/material';
import toast from 'react-hot-toast';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { LoadingSpinner } from '@/app/api/_lib/misc/utils';
import { Button } from '@mui/joy';


import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

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

    const [bigCommerceIntegrationStatus, setBigCommerceIntegrationStatus] = React.useState({scripts: []})
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
                                <Button loading={managingYmmScript} onClick={addScript}  variant={'solid'}>Add YMM Script</Button>
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
                                            <>
                                                <Alert severity={'success'}>
                                                    YMM Script has been added to the Script Manager accessible at <i> storefront{' -> '}script manager</i> in BigCommerce admin
                                                </Alert>                                                
                                            </>

                                        )
                                    }
                                    <Divider></Divider>
                                    <div>
                                        <Button loading={managingYmmScript}  variant={'solid'} onClick={updateScript}>Update Script</Button>
                                    </div>
                                </>
                            )
                    )
            }
        </Stack>
    )
}

export function WidgetManager({storeData}){

    const [widgetData, setWidgetData] = React.useState({allWidgetTemplatesCreated: {}, widgetsThatShouldBeCreated: [], widgetsRemainingToBeCreated: [], allWidgetsCreated: []})
    const [isLoading, setIsLoading] = React.useState(true)

    async function fetchWidgetStaus(){
        
        try{
            
            setIsLoading(true) 

            const response = await fetch(`/api/merchant/stores/${storeData.store_hash}/bigcommerce-integration/widget-manager`)

            const responseJSON = await response.json() 

            if(responseJSON.success !== true) throw new Error(responseJSON.message)

            setWidgetData({
                widgetsThatShouldBeCreated: responseJSON.widgetsThatShouldBeCreated,
                widgetsRemainingToBeCreated: responseJSON.widgetsRemainingToBeCreated,
                allWidgetTemplatesCreated: Object.values(responseJSON.allWidgetTemplatesCreated),
                allWidgetsCreated: responseJSON.allWidgetsCreated
            })

        }catch(error){
            
            toast(error.message)
            
        }finally{
        
            setIsLoading(false) 
        
        }
    }

    React.useState(()=>{
        fetchWidgetStaus()
    }, [])

    const [isButtonLoading, setIsButtonLoading] = React.useState(false) 

    const handleCreateWidgets = async () => {
        try{

            setIsButtonLoading(true)

            const response = await fetch(
                `/api/merchant/stores/${storeData.store_hash}/bigcommerce-integration/widget-manager`,
                {
                    method: 'POST'
                }
            )

            const responseJSON = await response.json() 

            if(responseJSON.success !== true) throw new Error(responseJSON.message) 

            toast("Widgets created successfully") 

            fetchWidgetStaus()

        }catch(error){
            toast(error.message)
        }finally{
            setIsButtonLoading(false)
        }
    }

    const handleDeleteWidgets = async () => {
        try{

            const confirmed = confirm("Are you sure you want to delete the YMM widgets?");
            if (!confirmed){
                toast('Deletion cancelled')
                return
            }

            setIsButtonLoading(true)

            const response = await fetch(
                `/api/merchant/stores/${storeData.store_hash}/bigcommerce-integration/widget-manager`,
                {
                    method: 'DELETE'
                }
            )

            const responseJSON = await response.json() 

            if(responseJSON.success !== true) throw new Error(responseJSON.message) 

            toast("Widgets deleted successfully") 

            fetchWidgetStaus()

        }catch(error){
            toast(error.message)
        }finally{
            setIsButtonLoading(false)
        }
    }

    const [activeWidgetTemplate, setActiveWidgtTemplate] = React.useState('') 

    const resetActiveTemplate = () => setActiveWidgtTemplate('')

    const handleActiveWidgetTemplateChange = (uuid) => setActiveWidgtTemplate(uuid)


    function extractDivInfo(htmlString) {
        // Create a DOM parser
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
    
        // Get the first div (without using ID or class)
        const firstDiv = doc.querySelector('div');
        const classes = firstDiv ? firstDiv.getAttribute('data-classes') : '';
        const widgetHeading = firstDiv ? firstDiv.getAttribute('data-title') : '';
        const submitButtonText = firstDiv ? firstDiv.getAttribute('data-submit-button-text') : '';
        const submitButtonBackgroundColor = firstDiv ? firstDiv.getAttribute('data-submit-button-bg-color') : '';
        let headingFontSize = firstDiv ? firstDiv.getAttribute('data-heading-font-size') : '';
        

        if(headingFontSize.trim().length == 0) headingFontSize = 16 
        headingFontSize = parseInt(headingFontSize) 

        return {
            classes,
            widgetHeading,
            submitButtonText,
            submitButtonBackgroundColor,
            headingFontSize
        };

    }

    const DisplayEditForm = () => {


        console.log(widgetData.allWidgetTemplatesCreated)
        console.log(activeWidgetTemplate)

        const activeTemplateDetails = widgetData.allWidgetTemplatesCreated.filter(w => w.uuid === activeWidgetTemplate)[0]
        
        let templateConfig = activeTemplateDetails.widget_template 
        
        let {classes,widgetHeading, submitButtonText, submitButtonBackgroundColor, headingFontSize} = extractDivInfo(templateConfig)
        
        console.log(classes, submitButtonBackgroundColor, submitButtonText, headingFontSize)

        const [isEditing, setIsEditing] = React.useState(false)

        const handleSubmit = async (e) => {

            e.preventDefault();
            
            const formData = new FormData(e.currentTarget);
            
            try{
                
                setIsEditing(true)
    
                const response  = await fetch(
                    `/api/merchant/stores/${storeData.store_hash}/bigcommerce-integration/widget-manager`, 
                    { method: 'PUT', body: formData }
                );
    
                const responseJSON = await response.json() 
    
                if(responseJSON.success == false ) throw new Error(responseJSON.message)
                
                toast(responseJSON.message)

                resetActiveTemplate() 

                fetchWidgetStaus()
                
            }catch(error){
                toast(error.message)
            }finally{
                setIsEditing(false)
            }
    
        };
    
        function valuetext(value) {
            return `${value}px`;
          }

        const [sliderValue, setSliderValue] = React.useState(headingFontSize)
        const handleSliderChange = (e) => setSliderValue(e.target.value)

        const[backgroundColor, setBackgroundColor] = React.useState(submitButtonBackgroundColor)
        const handleBackgroundColorChange = (e) => setBackgroundColor(e.target.value)
        return(
            <Dialog
                open={true}
                onClose={()=>{}}
                fullWidth
                slotProps={{
                paper: {},
                }}
            >
                <DialogTitle>Edit {activeTemplateDetails.name}</DialogTitle>
                <DialogContent style={{width:'100%'}}>
                    <Box component="form" onSubmit={handleSubmit} sx={{ minWidth:'100%', paddingTop:1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <input type='hidden' name='uuid' value={activeWidgetTemplate} />
                        <input type='hidden' name='widget_name' value={activeTemplateDetails.name} />
                        <div>
                            <TextField defaultValue={classes} label="Widget Container Div Classes" name="widget_container_div_classes"  fullWidth />
                            <small>Separate classes by space</small>
                        </div>
                        <div>
                            <TextField defaultValue={widgetHeading} label="Widget Heading" name="widget_title"  fullWidth />
                        </div>
                        <div style={{display:'flex', gap:'50px', alignItems:'center'}}>
                            <div>Heading Font Size </div>
                            <Slider
                                style={{maxWidth:'200px'}}
                                aria-label="Temperature"
                                defaultValue={headingFontSize}
                                getAriaValueText={valuetext}
                                marks
                                onChange={handleSliderChange}
                                min={16}
                                max={50}
                                valueLabelDisplay='auto'
                                
                                name="heading_font_size"
                            />
                            <div>{sliderValue} px</div>
                        </div>
                        <TextField defaultValue={submitButtonText} label="Submit Button Text" name="submit_button_text"  fullWidth />
                        <div style={{display:'flex', gap:'50px', alignItems:'center'}}>
                            <div>Submit Button Background Color</div>
                            <input onChange={handleBackgroundColorChange} defaultValue={submitButtonBackgroundColor} type='color' name="submit_button_background_color" />
                            <div>{backgroundColor.toUpperCase()}</div>
                        </div>                        
                        <DialogActions>
                            <Button variant={'outlined'} disabled={isEditing} onClick={resetActiveTemplate}>Cancel</Button>
                            <Button loading={isEditing}  type="submit">Submit</Button>
                        </DialogActions>
                    </Box>
                </DialogContent>

            </Dialog>
        )
    }

    if(isLoading) return(<LoadingSpinner />)

    return(
        <>
            {activeWidgetTemplate !== '' && (<DisplayEditForm /> )}
            <Stack spacing={2}>
                {
                    ( 
                        widgetData.widgetsRemainingToBeCreated.length > 0
                    ) && (
                        <>
                            {
                                widgetData.widgetsRemainingToBeCreated.map((widgetRemainingToBeCreated, index) => (
                                    <Alert key={index} severity={'error'}>{widgetRemainingToBeCreated.name} has not been created</Alert>
                                ))
                            }
                        </>
                    )
                }
                {
                    ( 
                        widgetData.widgetsThatShouldBeCreated.length > 0 &&
                        widgetData.widgetsRemainingToBeCreated.length ==  0
                    ) && (
                        <>
                            <Alert severity={'success'}>All necessary widgets have been successfully created</Alert>
                            <Alert severity={'info'}>The created widgets can be added to website from BigCommerce theme customizer / page builder</Alert>
                        </>
                    )
                }
                <Divider>{widgetData.allWidgetTemplatesCreated.length > 0 ? 'Created Widgets' : ''}</Divider>
                {
                    widgetData.allWidgetTemplatesCreated.length > 0 && (
                        <Stack spacing={3}>
                            <Grid container spacing={3}>
                                {
                                    widgetData.allWidgetTemplatesCreated.map((template, index) => {
                                        return(
                                            <Grid 
                                                onClick={() =>handleActiveWidgetTemplateChange(template.uuid)}
                                                sx={{cursor:'pointer'}} 
                                                key={index} 
                                                spacing={2} 
                                                size={{xs:12, md: 4, lg: 4}}
                                            >
                                                <Paper elevation={3} sx={{'&:hover':{backgroundColor:'rgba(0, 0, 0, 0.1)'},padding: 4, display:'flex', justifyContent:'center', alignItems:'center', minHeight:'50px'}}>
                                                    {template.name }
                                                </Paper>
                                            </Grid>
                                        )
                                    })
                                }
                            </Grid>
                            <Divider></Divider>
                        </Stack>
                    )
                }

                <Stack direction={'row'} spacing={3}>
                    {
                        ( 
                            widgetData.widgetsRemainingToBeCreated.length > 0
                        ) && (
                            <Button loading={isButtonLoading} onClick={handleCreateWidgets}>Create Widgets</Button>
                        )
                    }
                    {
                        ( 
                            widgetData.widgetsThatShouldBeCreated.length > 0 &&
                            widgetData.allWidgetsCreated.some(
                                widgetName => widgetData.widgetsThatShouldBeCreated.map(w => w.name).includes(widgetName) 
                            )
                        ) && (
                            <Button loading={isButtonLoading} color={'danger'} onClick={handleDeleteWidgets}>Delete Widgets</Button>
                        )
                    }
                </Stack>
            </Stack>
        </>
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
                label: "YMM Widgets",
                tabContent: <WidgetManager storeData={storeData}/>
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
                    <TabList  onChange={handleChange} aria-label="lab API tabs example">
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
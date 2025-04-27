import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Breadcrumbs,  Divider, Paper, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';
import Link from 'next/link';
import { GeneralInfo } from './_utils/_general_info';
import { FitmentDataSource } from './_utils/_fitment_data';
import { BigCommerceIntegration } from './_utils/_bigcommerce_integration';
import { DropdownFilters } from './_utils/_dropdown_filters';

const tabData = (storeData) => {

    return  [
        {
            label: "General",
            tabContent: <GeneralInfo storeData={storeData} />
        },

        {
            label: "Fitment Data",
            tabContent: <FitmentDataSource storeData={storeData} />
        },

        {
            label: "Dropdown Filters",
            tabContent: <DropdownFilters storeData={storeData} />
        },

        {
            label: "BigCommerce Integration",
            tabContent: <BigCommerceIntegration storeData={storeData} />
        }
    ]
}

export default function StoreData({storeData}) {
  const [value, setValue] = React.useState('0');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper sx={{padding:'20px'}}>
        <div style={{display:'flex', gap: '10px', alignItems:'center'}}>
            <IconButton onClick={() => history.back()} aria-label="add an alarm">
                <ArrowBackIcon />
            </IconButton>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" style={{color:'unset'}} color="inherit" href="/merchant/stores">
                    stores
                </Link>
                <Typography sx={{ color: 'text.primary' }}>{storeData.store_name}</Typography>
            </Breadcrumbs>
        </div>
        <Divider sx={{margin:'10px 0'}}></Divider>
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
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
    </Paper>
  );
}

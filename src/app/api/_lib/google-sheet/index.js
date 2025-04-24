
import { google } from "googleapis";

export async function readGoogleSheetColumns(spreadsheetURL){

    const extractSpreadsheetId = (url) => {
        const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
        return match ? match[1] : null;
    };

    const spreadsheetId = extractSpreadsheetId(spreadsheetURL);
    
    if (!spreadsheetId) {
        throw new Error('Invalid Google Sheets URL');
    }    

    try{

        const auth = new google.auth.GoogleAuth({
            credentials: {
                type: "service_account",
                project_id: process.env.GOOGLE_PROJECT_ID,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), 
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
            },
            scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
        });
        
        const sheets = google.sheets({ version: "v4", auth });

        const metadata = await sheets.spreadsheets.get({
            spreadsheetId,
        });
        
        const firstSheetName = metadata.data.sheets[0].properties.title;
        console.log("First sheet name:", firstSheetName);

        //  Get only the first row from the first sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: `${firstSheetName}!1:1`,  // 👈 This grabs the first row only
        });

        console.log("First row:", response.data.values[0]);

        return response.data.values[0];
        
    }catch(error){
        throw new Error(error.message)
    }

}
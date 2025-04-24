
import { google } from "googleapis";

export async function fetchFitmentSheet(spreadsheetURL){

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
            range: `${firstSheetName}`,  // 👈 This grabs the first row only
        });


        const rows = response.data.values;

        if (!rows || rows.length < 2) {
            return []; // No data or just headers
        }
        
        const headers = rows[0];
        
        const jsonData = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, i) => {
                header = header.trim()
                obj[header] = row[i] || ""; // Fill missing values with empty string
            });
            return obj;
        });
        
        return jsonData;
        
    }catch(error){
        throw new Error(error.message)
    }

}
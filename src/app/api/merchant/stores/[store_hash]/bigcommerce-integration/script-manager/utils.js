import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

export default async function buildAndSaveScriptInsidePublicFolder(storeHash) {

    try {

        // note double sets of  dashes "--" below
        const { stdout, stderr } = await execPromise(`npx vite build --  --store_hash=${storeHash}`, {
            cwd: process.cwd(),
        });

        // the output directory is defined in the vite config file - vite.config.js
        // so after above parameterized commmand executes, 
        // the file gets stored inside public folder 

    }catch (error) {
        console.log(error.message)
        throw new Error('Error occured during script build process') 
    }

}

export async function createScriptInBigCommerce(store_hash, access_token, ymmScriptURL) {

    const bigCommerceAPIBase = `https://api.bigcommerce.com/stores/${store_hash}/v3/content/scripts`;
  
    const body = {
      name: "YMM Script",
      description: "Script for YMM functionality",
      html: `<script src="${ymmScriptURL}"></script>`,  // Use the provided ymmScriptURL
      auto_uninstall: true,
      load_method: "default", // or "async"
      location: "footer", // Changed to footer
      visibility: "storefront",
      kind: "script_tag",
      consent_category: "essential"
    };
  
    try {

        const response = await fetch(bigCommerceAPIBase, {
            method: "POST",
            headers: {
                "X-Auth-Token": access_token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to create script in BigCommerce:", data);
            throw new Error(data.title || "BigCommerce script creation failed");
        }

        console.log("Script created successfully:", data);

        return data;
    
    } catch (error) {
    
        console.error("Error creating script in BigCommerce:", error.message);
        throw error;
    
    }

}


export async function bigCScriptsCreatedUsingThisAccessToken(store_hash, access_token) {

    const bigCommerceAPIBase = `https://api.bigcommerce.com/stores/${store_hash}/v3/content/scripts`;
    
    try {

        const response = await fetch(bigCommerceAPIBase, {
            method: "GET",
            headers: {
                "X-Auth-Token": access_token,
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        });

        const data = await response.json();

        console.log(data)

        if (!response.ok) {
            throw new Error( data.title + ' - from BigCommerce' || 'BigError fetching BigC Script')
        }
        
        if(!('data' in data)) throw new Error('Error fetching BigC Script')
        
        const scripts  = data.data 

        return scripts.map(({name, uuid, date_created, description, date_modified})=> ({date_modified, name, description, uuid, date_created})) 

    } catch (error) {
    
        throw error;
    
    }

}
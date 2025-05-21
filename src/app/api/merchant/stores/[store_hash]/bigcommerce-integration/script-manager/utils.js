
import fs from 'fs/promises';
import path from 'path';

const requiredScripts = ["Header YMM Script", "Main YMM Script"];

export async function createRequiredScriptsInBigCommerce(store_hash, access_token, baseDomain, scriptsToCreateArray = requiredScripts) {
    const scriptAPIEndpoint = `https://api.bigcommerce.com/stores/${store_hash}/v3/content/scripts`;

    const publicDir = path.join(process.cwd(), 'public', 'ymm-scripts');

    const preRequirementPath = path.join(publicDir, 'pre_requirement.html');



    const storeScriptURL = `${baseDomain}/ymm-scripts/main-v1.js`;

    const createdScripts = [];

    try {   
        for (const scriptName of scriptsToCreateArray) {
            if (!requiredScripts.includes(scriptName)) {
                console.warn(`Skipping unknown script: ${scriptName}`);
                continue;
            }

            let body;

            if (scriptName === "Header YMM Script") {
                const inlineHTML = await fs.readFile(preRequirementPath, 'utf-8');

                body = {
                    name: scriptName,
                    description: "Inline script for YMM header functionality",
                    html: inlineHTML,
                    auto_uninstall: true,
                    load_method: "default",
                    location: "head",
                    visibility: "storefront",
                    kind: "script_tag",
                    consent_category: "essential"
                };

            } else if (scriptName === "Main YMM Script") {


                // Ensure destination folder exists and copy the script
        
                body = {
                    name: scriptName,
                    description: "External script for main YMM functionality",
                    html: `<script src="${storeScriptURL}"></script>`,
                    auto_uninstall: true,
                    load_method: "default",
                    location: "footer",
                    visibility: "storefront",
                    kind: "script_tag",
                    consent_category: "essential"
                };
            }

            const response = await fetch(scriptAPIEndpoint, {
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
                console.error(`Failed to create script "${scriptName}" in BigCommerce:`, data);
                throw new Error(data.title || `BigCommerce script creation failed for ${scriptName}`);
            }

            console.log(`Script "${scriptName}" created successfully:`, data);
            createdScripts.push(data);
        }

        return createdScripts;

    } catch (error) {
        console.error("Error in createRequiredScriptsInBigCommerce:", error.message);
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

export async function deleteScriptsFromBigCommerce(store_hash, access_token, arrayOfUUIDs = []) {

    let scriptsAlreadyCreated = await bigCScriptsCreatedUsingThisAccessToken(store_hash, access_token)
    
    scriptsAlreadyCreated = scriptsAlreadyCreated.filter(({name: createdScript}) => requiredScripts.includes(createdScript)).map(({uuid}) => uuid)

    arrayOfUUIDs = scriptsAlreadyCreated

    const baseURL = `https://api.bigcommerce.com/stores/${store_hash}/v3/content/scripts`;

    const deleted = [];
    const failed = [];

    for (const uuid of arrayOfUUIDs) {
        const url = `${baseURL}/${uuid}`;

        try {
            const response = await fetch(url, {
                method: "DELETE",
                headers: {
                    "X-Auth-Token": access_token,
                    "Accept": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error(`Failed to delete script ${uuid}:`, errorData);
                failed.push({ uuid, error: errorData });
                continue;
            }

            console.log(`Deleted script with UUID: ${uuid}`);
            deleted.push(uuid);

        } catch (error) {
            console.error(`Error deleting script ${uuid}:`, error.message);
            failed.push({ uuid, error: error.message });
        }
    }

    return { deleted, failed };
}

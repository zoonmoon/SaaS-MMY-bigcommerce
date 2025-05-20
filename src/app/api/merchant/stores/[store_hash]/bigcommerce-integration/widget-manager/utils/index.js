import { widgetsThatShouldBeCreated } from "../data";

// Helper to build headers
function getHeaders(accessToken) {
    return {
        'X-Auth-Token': accessToken,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    };
}

function apiBase(storeHash) {
    return `https://api.bigcommerce.com/stores/${storeHash}/v3/content`;
}

// 1. Get all widgets
export async function getAllWidgets(storeHash, accessToken) {
    try {
        const res = await fetch(`${apiBase(storeHash)}/widgets`, {
            method: 'GET',
            headers: getHeaders(accessToken)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        const widgets = {};
        
        data.data.forEach(widget => {
            widgets[widget.name] = widget.uuid;
        });

        return widgets;

    } catch (err) {
        console.error('Error getting widgets:', err);
        throw err 
    }
}

// 2. Create a widget
export async function createWidget(widgetName, widget_template_uuid, storeHash, accessToken) {
    try {
        const payload = {
            name: widgetName,
            widget_template_uuid
        };

        const res = await fetch(`${apiBase(storeHash)}/widgets`, {
            method: 'POST',
            headers: getHeaders(accessToken),
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        return data.data;
    } catch (err) {
        console.error('Error creating widget:', err);
        throw err 
    }
}

// 3. Get all widget templates
export async function getAllWidgetTemplates(storeHash, accessToken) {
    try {
        const res = await fetch(`${apiBase(storeHash)}/widget-templates`, {
            method: 'GET',
            headers: getHeaders(accessToken)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const templates = {};
        const namesOfWidgetTemplatesThatShouldBeCreated = widgetsThatShouldBeCreated.map(w => w.name)
        data.data.forEach(template => {
            if(namesOfWidgetTemplatesThatShouldBeCreated.includes(template.name))
            templates[template.name] = { uuid: template.uuid, name: template.name, widget_template: template.template};
        });
        return templates;
    } catch (err) {
        console.error('Error fetching widget templates:', err);
        throw err 
    }
}

// 4. Create a widget template
export async function   createWidgetTemplate(widgetTemplateName, templateBody, storeHash, accessToken) {
    try {
        const payload = {
            name: widgetTemplateName,
            template: templateBody
        };

        const res = await fetch(`${apiBase(storeHash)}/widget-templates`, {
            method: 'POST',
            headers: getHeaders(accessToken),
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        return data.data;
    } catch (err) {
        console.error('Error creating widget template:', err);
        throw err 
    }
}


export async function deleteWidget(uuid, store_hash, access_token) {
    try {
        const res = await fetch(`https://api.bigcommerce.com/stores/${store_hash}/v3/content/widgets/${uuid}`, {
            method: 'DELETE',
            headers: {
                'X-Auth-Token': access_token,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`Failed to delete widget: HTTP ${res.status}`);
        
        console.log(`Widget ${uuid} deleted successfully.`);
        return true;
    } catch (err) {
        console.error('Error deleting widget:', err);
        throw err 
    }
}


export async function deleteWidgetTemplate(uuid, storeHash, access_token) {

    try {
        const res = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/content/widget-templates/${uuid}`, {
            method: 'DELETE',
            headers: {
                'X-Auth-Token': access_token,
                'Accept': 'application/json'
            }
        });

        if (!res.ok) throw new Error(`Failed to delete widget template: HTTP ${res.status}`);
        
        console.log(`Widget Template ${uuid} deleted successfully.`);
        return true;
    } catch (err) {
        console.error('Error deleting widget template:', err);
        throw err 
    }
}


export async function updateWidgetTemplate(storeHash, access_token, uuid, template) {
    
    console.log(template)
    try {
        const res = await fetch(`https://api.bigcommerce.com/stores/${storeHash}/v3/content/widget-templates/${uuid}`, {
            method: 'PUT',
            headers: {
                'X-Auth-Token': access_token,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template: template
            })
        });

        const data = await res.json();

        if (!res.ok) {
            const errorMessage = data?.title || `HTTP ${res.status}`;
            throw new Error(`Failed to update widget template: ${errorMessage}`);
        }

        console.log(`Widget Template ${uuid} updated successfully.`);
        return true;
    } catch (err) {
        console.error('Error updating widget template:', err.message);
        throw err;
    }
}


export async function deleteAllWidgetsAndTemplates(store_hash, access_token){
            const allWidgetsCreated = await getAllWidgets(store_hash, access_token) 

        for(let widgetName in allWidgetsCreated){
            if(widgetsThatShouldBeCreated.map(w => w.name).includes(widgetName))
                await deleteWidget(allWidgetsCreated[widgetName], store_hash, access_token)
        }

        const allWidgetTemplatesCreated = await getAllWidgetTemplates(store_hash, access_token)

        for(let widgetTemplateName in allWidgetTemplatesCreated){
            if(widgetsThatShouldBeCreated.map(w => w.name).includes(widgetTemplateName))
                await deleteWidgetTemplate(allWidgetTemplatesCreated[widgetTemplateName].uuid, store_hash, access_token)
        }
}
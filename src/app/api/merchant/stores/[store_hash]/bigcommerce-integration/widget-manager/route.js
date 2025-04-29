import { fetchStoreData } from "../../indexing/fitment-data/fetch_store_data"
import { widgetsThatShouldBeCreated } from "./data"
import { createWidget, createWidgetTemplate, deleteWidget, deleteWidgetTemplate, getAllWidgets, getAllWidgetTemplates } from "./utils"

export async function GET(request, {params}){
    try{

        const {store_hash} = await params 

        const {access_token} = await fetchStoreData(store_hash)

        const allWidgetsCreated  = Object.keys(await getAllWidgets(store_hash,access_token)) 

        const widgetsRemainingToBeCreated = widgetsThatShouldBeCreated.filter(widget => !(allWidgetsCreated.includes(widget.name)))

        return new Response(JSON.stringify({success: true, widgetsThatShouldBeCreated, widgetsRemainingToBeCreated, allWidgetsCreated}))

    }catch(error){
        return new Response(JSON.stringify({success:false, message: error.message}))
    }
}

export async function POST(request, {params}){
    try{

        const {store_hash} = await params 

        const {access_token} = await fetchStoreData(store_hash) 

        const widgetsAlreadyCreated = Object.keys(await getAllWidgets(store_hash, access_token))

        const widgetsRemainingToBeCreated = widgetsThatShouldBeCreated.filter(widget => !(widgetsAlreadyCreated.includes(widget.name)))

        if(widgetsRemainingToBeCreated.length == 0) throw new Error("All necessary widgets have already been created")
        
        const widgetNameVsWidgetTemplateUuidCreated = await getAllWidgetTemplates(store_hash, access_token)

        for(let widgetToBeCreated of widgetsRemainingToBeCreated){

            let widgetTemplateUUID = ''

            if( widgetToBeCreated.name in widgetNameVsWidgetTemplateUuidCreated )
                widgetTemplateUUID = widgetNameVsWidgetTemplateUuidCreated[widgetToBeCreated.name]
            else {
                const createdWidgetTemplate = await createWidgetTemplate(
                    widgetToBeCreated.name,
                    widgetToBeCreated.template,
                    store_hash,
                    access_token
                )

                if(createdWidgetTemplate.name !== widgetToBeCreated.name)  
                    throw new Error("Error creating widget template. Please try again");

                widgetTemplateUUID = createdWidgetTemplate.uuid 
            }

            const createdWidget = await createWidget(
                widgetToBeCreated.name,
                widgetTemplateUUID,
                store_hash,
                access_token
            )

            if(createdWidget.name !== widgetToBeCreated.name)
                throw new Error('Error creating widget. Please try again');

        }

        return new Response(JSON.stringify({success:true, message: "Widgets created successfully"}))

    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }
}

export async function DELETE(request, {params}){

    try{
        
        const {store_hash} = await params 

        const {access_token} = await fetchStoreData(store_hash) 

        const allWidgetsCreated = await getAllWidgets(store_hash, access_token) 
        for(let widgetName in allWidgetsCreated){
            if(widgetsThatShouldBeCreated.map(w => w.name).includes(widgetName))
                await deleteWidget(allWidgetsCreated[widgetName], store_hash, access_token)
        }

        const allWidgetTemplatesCreated =await getAllWidgetTemplates(store_hash, access_token)
        for(let widgetTemplateName in allWidgetTemplatesCreated){
            if(widgetsThatShouldBeCreated.map(w => w.name).includes(widgetTemplateName))
                await deleteWidgetTemplate(allWidgetTemplatesCreated[widgetTemplateName], store_hash, access_token)
        }

        return new Response(JSON.stringify({success: true, message: "Widgets deleted successfully"}))

    }catch(error){
        
        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}
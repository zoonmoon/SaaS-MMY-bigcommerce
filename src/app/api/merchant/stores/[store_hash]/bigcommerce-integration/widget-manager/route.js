import { fetchStoreData } from "../../indexing/fitment-data/fetch_store_data"
import { widgetsThatShouldBeCreated } from "./data"
import { createWidget, createWidgetTemplate, deleteWidget, deleteWidgetTemplate, getAllWidgets, getAllWidgetTemplates, updateWidgetTemplate } from "./utils"
import { returnTemplate } from "./data"
import { deleteAllWidgetsAndTemplates } from "./utils"

export async function GET(request, {params}){
    try{

        const {store_hash} = await params 
        
        const {access_token} = await fetchStoreData(store_hash)
        
        const allWidgetsCreated  = Object.keys(await getAllWidgets(store_hash,access_token)) 
        
        const allWidgetTemplatesCreated = await getAllWidgetTemplates(store_hash, access_token) 
        
        const widgetsRemainingToBeCreated = widgetsThatShouldBeCreated.filter(widget => !(allWidgetsCreated.includes(widget.name)))
        
        return new Response(JSON.stringify({success: true, allWidgetTemplatesCreated, widgetsThatShouldBeCreated, widgetsRemainingToBeCreated, allWidgetsCreated}))

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
                widgetTemplateUUID = widgetNameVsWidgetTemplateUuidCreated[widgetToBeCreated.name].uuid 
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



export async function PUT(request, {params}){
    try{

        const {store_hash} = await params 
        const {access_token} = await fetchStoreData(store_hash) 
        
        const data = await request.formData()
        const uuid = data.get('uuid') 
        const widget_title = data.get('widget_title').trim()
        const widget_container_div_classes = data.get('widget_container_div_classes').trim()
        const submit_button_text = data.get('submit_button_text')
        const submit_button_background_color = data.get('submit_button_background_color')
        const widget_name = data.get('widget_name')
        const heading_font_size = data.get('heading_font_size')
        const idCustom = widgetsThatShouldBeCreated.filter(widget => widget.name === widget_name)[0].id



        await updateWidgetTemplate(
            store_hash, 
            access_token,
            uuid,
            returnTemplate(
                idCustom, 
                widget_container_div_classes,
                widget_title,
                submit_button_text,
                submit_button_background_color,
                heading_font_size
            )
        )

        return new Response(JSON.stringify({success:true, message: "Widget info saved"}))

    }catch(error){
        return new Response(JSON.stringify({success:false, message: error.message}))
    }
}

export async function DELETE(request, {params}){

    try{
        
        const {store_hash} = await params 
        
        const {access_token} = await fetchStoreData(store_hash) 
        
        await deleteAllWidgetsAndTemplates(store_hash, access_token)
        
        return new Response(JSON.stringify({success: true, message: "Widgets deleted successfully"}))

    }catch(error){
        
        return new Response(JSON.stringify({success:false, message: error.message}))

    }

}
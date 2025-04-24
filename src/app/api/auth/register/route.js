import { createUser } from "../_utils"
import { loginUser } from "../_utils"

export async function POST(request){

    try{

        const data = await request.formData()

        const username = data.get('username')
        const password = data.get('password') 

        let { success, message} = await createUser(username, password)

        if(!success) throw new Error(message)
            
        loginUser(username) 
    
        return new Response(JSON.stringify({success: true, message}))
        
    }catch(error){

        return new Response(JSON.stringify({success:false, message: error.message}))

    }
}
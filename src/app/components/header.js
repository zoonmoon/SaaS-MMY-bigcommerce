import LoggedInHeader from "./logged_in_header"
import NotLoggedInHeader from "./not_logged_in_header"
import { useEffect, useState } from "react"
import { Skeleton } from "@mui/material"

export function getLoggedInUsernameClient() {
    // Read cookies
    const cookieString = document.cookie;
    const cookies = Object.fromEntries(
      cookieString.split('; ').map(c => {
        const [key, ...v] = c.split('=');
        return [key, v.join('=')];
      })
    );
  
    const token = cookies['token'];
  
    if (!token) {
      return { token_exists: false, username: null };
    }
  
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return { token_exists: false, username: null };
      }
  
      const payload = JSON.parse(atob(parts[1]));
  
      if (payload && payload.username !== undefined) {
        return { token_exists: true, username: payload.username };
      } else {
        return { token_exists: false, username: null };
      }
  
    } catch (error) {
      console.error('Error parsing token:', error);
      return { token_exists: false, username: null };
    }
  }
  

export default function Header(){

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [loading, setLoading] = useState(true) 

    useEffect(() => {
        const {token_exists, username}= getLoggedInUsernameClient()
        if(token_exists){
            setIsLoggedIn(true)
        }
        setLoading(false)
    }, [])

    if(loading)return(
        <div style={{background:'white', height:'50px', display:'flex', justifyContent:'center'}}>
            <Skeleton width={300}  />
        </div>
    ) 


    return(
        <>
            {
                isLoggedIn ? <LoggedInHeader /> : <NotLoggedInHeader />
            }
        </>
    )
}
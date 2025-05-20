'use client'
// pages/logout.tsx (for redirect + deletion client-side)
import { useEffect } from 'react';

const Logout = () => {

  useEffect(() => {
    // Only works for non-HttpOnly cookies
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    window.location= '/'
  }, []);

  return <>Logging out</>; // or show "Logging out..."
};

export default Logout;
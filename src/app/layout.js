'use client'
import { Toaster } from "react-hot-toast";
import Header from "./components/header";
import './globals.css'
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin: 0, backgroundColor: 'rgba(0, 0, 0, 0.1)'}}>
        <Toaster  position="bottom-center" 
          toastOptions={{
            className: '',
            style: {
              backgroundColor: 'black',
              padding: '8px',
              color: 'white',
            },
          }}
        />
        <Header />
        {children}
      </body>
    </html>
  );
}
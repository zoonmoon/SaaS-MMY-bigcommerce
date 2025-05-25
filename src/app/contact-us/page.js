'use client'
import { useRef } from 'react';

export default function ContactUs() {
  const iframeRef = useRef(null);

  const handleIframeLoad = () => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    try {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      // Detect if the form is in the "Thank you" state by checking for specific text
      const isSubmitted = iframeDoc.body.innerText.includes("Your response has been recorded");

      if (isSubmitted) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      // Cannot access cross-origin iframe content
      console.warn("Cross-origin access blocked — fallback scroll");
      // Fallback: scroll anyway after form load
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <iframe
        ref={iframeRef}
        src="https://docs.google.com/forms/d/e/1FAIpQLSfMmn9sxxvt4cuy9QYNd5hL1IesQv4FM1apcXYkJxZ9xXbpnw/viewform?embedded=true"
        width="640"
        height="1200"
        style={{ border: 'none' }}
        frameBorder="0"
        marginHeight="0"
        marginWidth="0"
        onLoad={handleIframeLoad}
        title="Contact Form"
      >
        Loading…
      </iframe>
    </div>
  );
}

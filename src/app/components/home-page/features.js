'use client'
import React from "react";
import "./features.css"; // Make sure this file is in the same folder

const Features = () => {
  return (
    <div style={{padding:'3rem', marginBottom:'30px' }}>
        <h2 style={{textAlign:'center'}}>Fitment Lookup Features</h2>
        <div className="vl-container">

            <div className="vl-features">
                <p>
                    A fitment lookup that features everything you need to succeed, and is
                    backed by experienced spa aftermarket parts entrepreneurs with over
                    20 years experience.
                </p>
                <ul>
                    <li><strong>US Service and Support</strong></li>
                    <li><strong>My Spa Selector and Saved Choices</strong></li>
                    <li><strong>Product Page Fitment Validator</strong></li>
                    <li><strong>Product Page Fitment Table</strong></li>
                    <li><strong>Required & Optional Fitment Qualifiers</strong></li>
                    <li><strong>Spa Serial Number Search</strong></li>
                    <li><strong>Fitment-Specific Related Products</strong></li>
                    <li><strong>Tailored to hot tub and spa stores</strong></li>
                </ul>
            </div>
            
            <div className="vl-video">
                <video
                style={{border:'2px solid white!important'}}
                src="/videos/demo-f.mp4"
                autoPlay
                muted
                loop={true}
                playsInline
                controls={false}
                    onLoadedMetadata={(e) => {
                        e.currentTarget.playbackRate = 1.5;
                    }}
                />
            </div>
        </div>
    </div>

  );
};

export default Features;

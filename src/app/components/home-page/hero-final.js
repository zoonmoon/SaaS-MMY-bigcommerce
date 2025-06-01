'use client'
import React from "react";
import "./hero-final.css"; // Make sure this file is in the same folder

const HeroFinal = () => {
  return (
    <div style={{maxWidth:'100%', borderBottomLeftRadius:'60px', borderBottomRightRadius:'60px', background:'#1e1e26', padding:'40px', paddingBottom:'60px', color:'#00e6c3', overflowX:'hidden',}}>
        <div className="final-vl-container">
           <div className="final-vl-video">
                <video
                src="/videos/demo-2.mp4"
                autoPlay
                muted
                loop={true}
                style={{borderRadius:'60px'}}
                playsInline
                controls={false}
                    onLoadedMetadata={(e) => {
                        e.currentTarget.playbackRate = 1.5;
                    }}
                />
            </div>

            <div className="final-vl-features" style={{textAlign:'center'}}>
                <h5 style={{fontSize:'25px'}} className="final-elementor-heading-title elementor-size-default">[MORE CONVERSIONS. LESS RETURNS.]</h5>
                <h1 style={{fontSize:'50px'}}>Revolutionize Your Spa Parts Search</h1>
                <p style={{color:'#00e6c3'}}>MMY Lookup & Fitment Validation by Experienced Industry Veterans</p>
            </div>
            
 
        </div>
    </div>

  );
};

export default HeroFinal;
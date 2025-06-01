'use client'
import Link from 'next/link';
import './hero.css';

export default function HeroBanner() {
  return (
    <div className="hero-banner">
      <img
        src="/default-images/home-page-bg.png" // Adjust path as needed
        alt="Hot tub spa parts"
        className="hero-image"
      />

                      {/* <video
                src="/videos/demo.mp4"
                autoPlay
                muted
                className='hero-image'
                loop={true}
                playsInline
                controls={false}
                    onLoadedMetadata={(e) => {
                        e.currentTarget.playbackRate = 1.5;
                    }}
                /> */}
      <div className="hero-overlay">
        <h1 className="hero-title">  Add a Smart Fitment Tool to Your Hot Tub & Spa Store</h1>
        <p className="hero-subtitle">
          Help your customers find the exact parts they need by installing our Year-Make-Model search tool — built specifically for spa and hot tub ecommerce stores.
        </p>
        <div className='buttons-holder' >
          <button className="hero-button" onClick={() => window.location='/contact-us'}> Get Started for Your BigCommerce Store</button>
          <div className='link-holder'>
            <Link target='_blank' href={'https://spa-and-pool-source.mybigcommerce.com/'}>View Demo store</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

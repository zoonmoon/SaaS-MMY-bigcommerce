import './how_it_works.css'
export default function HowItWorks(){
    return(
    <div style={{zIndex: -1}} className="container">
        <div className="header">
            <h1>Year Make Model Fitment Tool</h1>
            <p>Transform your Spa store with intelligent fitment compatibility tool</p>
        </div>
        <div className="steps-container">
            <div className="step">
                <div className="step-visual">
                    <div className="visual-box">
                        <span className="icon website-icon">🔍</span>
                        <div className="visual-text">Website Analysis<br />& Product Review</div>
                    </div>
                </div>
                <div className="step-content">
                    <div className="step-number">1</div>
                    <h3 className="step-title">We Visit Your Website 🔍</h3>
                    <p className="step-description">Our team conducts a comprehensive review of your product catalog and website structure. We analyze your inventory, categorize your parts, and understand your current setup to ensure seamless integration.</p>
                </div>
            </div>
            
            <div className="step">
                <div className="step-visual">
                    <div className="visual-box">
                        <span className="icon sheet-icon">📊</span>
                        <div className="visual-text">Fitment<br />Compatibility Data</div>
                    </div>
                </div>
                <div className="step-content">
                    <div className="step-number">2</div>
                    <h3 className="step-title">We prepare fitment data 📊</h3>
                    <p className="step-description">
                        We manage the complete preparation of fitment data, eliminating the complexity for you. Our team manages accurate and comprehensive compatibility data tailored to your entire product catalog.
                    </p>
                </div>
            </div>
            
            <div className="step">
                <div className="step-visual">
                    <div className="visual-box">
                        <span className="icon setup-icon">🛠️</span>
                        <div className="visual-text">Live Implementation<br />& Integration</div>
                    </div>
                </div>
                <div className="step-content">
                    <div className="step-number">3</div>
                    <h3 className="step-title">We Set It Up for You 🛠️</h3>
                    <p className="step-description">We implement the YMM fitment filters directly on the website tailored to your requirements. Your customers can now select their vehicle year, make, and model to see only compatible parts. Everything is configured and ready to use.</p>
                </div>
            </div>
        </div>
        <div className="no-effort">
            <h3>🎉 No Effort Required on Your End</h3>
            <p>Sit back and relax while we handle everything from analysis to implementation. Your enhanced website will be ready to serve customers with precision vehicle fitment in no time!</p>
        </div>
        <div className="fitment-demo">
            <h2 className="fitment-title">🎯 Customer Experience Preview</h2>
            <div className="fitment-interface">
                <div className="dropdown">
                    <select>
                        <option>Select Year</option>
                        <option>2024</option>
                        <option>2023</option>
                        <option>2022</option>
                        <option>2021</option>
                    </select>
                </div>
                <div className="dropdown">
                    <select>
                        <option>Select Make</option>
                        <option>Ford</option>
                        <option>Chevrolet</option>
                        <option>Toyota</option>
                        <option>Honda</option>
                    </select>
                </div>
                <div className="dropdown">
                    <select>
                        <option>Select Model</option>
                        <option>F-150</option>
                        <option>Camaro</option>
                        <option>Corolla</option>
                        <option>Civic</option>
                    </select>
                </div>
                <button className="search-btn">Find Compatible Parts</button>
            </div>
            <div className="results">
                <p>✅ Showing 47 compatible parts for your vehicle</p>
            </div>
        </div>
        

    </div>
    )
}
'use client'
import './index.css'
import React, { useState } from 'react';

const YMMPricingPlan = () => {
  const [isAnnual, setIsAnnual] = useState(false);

  // Custom SVG Icons (same as before)
  const SearchIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </svg>
  );

  const StarIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
    </svg>
  );

  const ZapIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="13,2 3,14 12,14 11,22 21,10 12,10"/>
    </svg>
  );

  const CrownIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm7 16h6"/>
    </svg>
  );

  const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 1v6m0 6v6m11-7h-6m-6 0H1m16.24-5.76l-4.24 4.24m-6 0L2.76 6.24m12.48 12.48l-4.24-4.24m-6 0l-4.24 4.24"/>
    </svg>
  );

  const BarChartIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="20" x2="12" y2="10"/>
      <line x1="18" y1="20" x2="18" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="16"/>
    </svg>
  );

  const HeadphonesIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 18v-6a9 9 0 0 1 18 0v6"/>
      <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/>
    </svg>
  );

  const CheckIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  );

  // Pricing data (same as before)
  const pricingData = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for small spa retailers',
      icon: StarIcon,
      monthlyPrice: 29,
      annualPrice: 290,
      popular: false,
      features: [
        'Up to 500 Products',
        'Basic YMM Database',
        'Standard Search Widget',
        'Email Support',
        'Mobile Responsive',
        'Basic Analytics',
        '1 Store Integration'
      ],
      limits: {
        products: '500',
        searches: '1,000/month',
        support: 'Email only'
      }
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing spa businesses',
      icon: ZapIcon,
      monthlyPrice: 79,
      annualPrice: 790,
      popular: true,
      features: [
        'Up to 5,000 Products',
        'Advanced YMM Database',
        'Customizable Search Widget',
        'Priority Email Support',
        'Advanced Analytics & Reports',
        'Custom Styling Options',
        'Up to 3 Store Integrations',
        'Bulk Product Import',
        'API Access'
      ],
      limits: {
        products: '5,000',
        searches: '10,000/month',
        support: 'Priority Email'
      }
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Built for large spa distributors',
      icon: CrownIcon,
      monthlyPrice: 199,
      annualPrice: 1990,
      popular: false,
      features: [
        'Unlimited Products',
        'Complete YMM Database',
        'White-label Solution',
        'Phone & Email Support',
        'Advanced Analytics Dashboard',
        'Custom Integrations',
        'Unlimited Store Integrations',
        'Dedicated Account Manager',
        'Custom Development',
        'Priority Feature Requests',
        '99.9% Uptime SLA'
      ],
      limits: {
        products: 'Unlimited',
        searches: 'Unlimited',
        support: 'Phone & Email'
      }
    }
  ];

  const getPrice = (plan) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12;
    const annualCost = plan.annualPrice;
    return Math.round(((monthlyCost - annualCost) / monthlyCost) * 100);
  };

  const selectPlan = (planId) => {
    const plan = pricingData.find(p => p.id === planId);
    const billingType = isAnnual ? 'annual' : 'monthly';
    const price = getPrice(plan);
    
    alert(`Selected: ${plan.name} Plan\nBilling: ${billingType}\nPrice: $${price}/${isAnnual ? 'year' : 'month'}`);
  
};

  return (
    <div className="pricing-container" style={{zIndex:1,position:'relative', marginBottom:'50px'}}>
      <div className="max-width-container">
        {/* Header */}
        <div className="header-section">
          <div className="header-title-section">
            <h1 className="main-title">
              YMM Fitment Search
            </h1>
          </div>
          <p className="subtitle">
            Powerful Year-Make-Model search solution for Hot Tub & Spa retailers. Help customers find the exact parts they need.
          </p>
          
          {/* Feature Highlights */}
          <div className="feature-highlights">
            <div className="feature-item">
              <SettingsIcon />
              <span>Easy Integration</span>
            </div>
            <div className="feature-item">
              <BarChartIcon />
              <span>Detailed Analytics</span>
            </div>
            <div className="feature-item">
              <HeadphonesIcon />
              <span>Expert Support</span>
            </div>
          </div>
          
          {/* Toggle Switch */}
          <div className="toggle-section">
            <span className={`toggle-label ${!isAnnual ? 'active' : 'inactive'}`}>
              Monthly
            </span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="toggle-button"
            >
              <span className={`toggle-slider ${isAnnual ? 'active' : ''}`} />
            </button>
            <span className={`toggle-label ${isAnnual ? 'active' : 'inactive'}`}>
              Annual
            </span>
            {isAnnual && (
              <span className="savings-badge">
                Save up to 20%
              </span>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="pricing-grid">
          {pricingData.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`pricing-card ${plan.id}`}
              >
                {plan.popular && (
                  <div className="popular-badge">
                    Most Popular
                  </div>
                )}
                
                <div className="card-header">
                  <div className={`card-icon ${plan.id}`}>
                    <IconComponent />
                  </div>
                  <h3 className="card-title">{plan.name}</h3>
                  <p className="card-description">{plan.description}</p>
                </div>

                <div className="pricing-display">
                  <div className="price-container">
                    <span className="price-amount">${getPrice(plan)}</span>
                    <span className="price-period">/{isAnnual ? 'year' : 'month'}</span>
                  </div>
                  {isAnnual && (
                    <div className="savings-text">
                      Save {getSavings(plan)}% annually
                    </div>
                  )}
                </div>

                {/* Key Limits */}
                <div className="limits-box">
                  <div className="limits-grid">
                    <div className="limit-row">
                      <span className="limit-label">Products:</span>
                      <span className="limit-value">{plan.limits.products}</span>
                    </div>
                    <div className="limit-row">
                      <span className="limit-label">Searches:</span>
                      <span className="limit-value">{plan.limits.searches}</span>
                    </div>
                    <div className="limit-row">
                      <span className="limit-label">Support:</span>
                      <span className="limit-value">{plan.limits.support}</span>
                    </div>
                  </div>
                </div>

                <ul className="features-list">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="feature-item-list">
                      <div className="check-icon">
                        <CheckIcon />
                      </div>
                      <span className="feature-text">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{textAlign:'center', marginBottom:'20px'}}>
            <button
                onClick={() => window.location.href = '/contact-us'}
                className={`cta-button professional`}
            >
                Get Started
            </button>
      </div>

    </div>
  );
};

export default YMMPricingPlan;
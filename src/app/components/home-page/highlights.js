import React from "react";
import "./highlights.css";

const FeatureHighlights = () => {
  return (
    <section className="features-section">
      <div className="feature">
        <div className="icon"><img src="/default-images/icon-3.png" /></div>
        <h3>Fast Service</h3>
        <p>
          Response in less than 1 business day from our US-based customer
          service team!
        </p>
      </div>
      <div className="feature">
        <div className="icon"><img src="/default-images/icon-4.png" /></div>
        <h3>More Than an App</h3>
        <p>
          Grow your business with help from our team on all things eCommerce.
        </p>
      </div>
      <div className="feature">
        <div className="icon"><img src="/default-images/icon-5.png" /></div>
        <h3>Expand Beyond</h3>
        <p>
          Custom integrations available to meet any needs or to set your brand
          apart from the rest.
        </p>
      </div>
    </section>
  );
};

export default FeatureHighlights;

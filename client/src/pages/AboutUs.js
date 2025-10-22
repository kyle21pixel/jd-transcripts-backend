import React from 'react';

export default function AboutUs() {
  return (
    <div className="container py-4">
      <h2>About Us</h2>
      <p className="lead">We are a passionate team dedicated to delivering high-quality transcription and business solutions. Our mission is to empower clients with reliable, secure, and efficient services tailored to their needs.</p>
      <div className="row mt-4">
        <div className="col-md-6">
          <h4>Our Story</h4>
          <p>Founded in 2020, our company has grown from a small startup to a trusted partner for businesses worldwide. We believe in innovation, integrity, and customer satisfaction.</p>
        </div>
        <div className="col-md-6">
          <h4>Why Choose Us?</h4>
          <ul>
            <li>Experienced professionals</li>
            <li>Fast turnaround times</li>
            <li>Secure and confidential</li>
            <li>24/7 customer support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

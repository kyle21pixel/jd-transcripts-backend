import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="container py-4">
      <div className="hero-section text-center py-5">
        <h1 className="display-4 mb-3">JD Legal Transcripts Company</h1>
        <p className="lead mb-4">
          Professional legal transcription and reporting services.
          Accurate transcripts delivered quickly with industry-leading quality standards.
        </p>
        <div className="row">
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Request a Quote</h5>
                <p className="card-text">Get started with our professional transcription services. Fast quotes, quality work.</p>
                <Link to="/order" className="btn btn-success">Get Quote</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Track Your Order</h5>
                <p className="card-text">Check the status of your transcription order and get real-time updates.</p>
                <Link to="/track-order" className="btn btn-primary">Track Order</Link>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">Our Services</h5>
                <p className="card-text">Legal transcription, court reporting, audio processing, and timecoding services.</p>
                <Link to="/about" className="btn btn-outline-primary">Learn More</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="features-section py-5">
        <h2 className="text-center mb-4">Why Choose JD Legal Transcripts?</h2>
        <div className="row">
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">⚡ Fast Turnaround</h5>
                <p className="card-text">Quick delivery without compromising on quality and accuracy.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">🎯 99.9% Accuracy</h5>
                <p className="card-text">Industry-leading accuracy with multiple quality assurance checks.</p>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card h-100">
              <div className="card-body text-center">
                <h5 className="card-title">🔒 Secure & Confidential</h5>
                <p className="card-text">Your documents are handled with the highest level of security and confidentiality.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="cta-section text-center py-5">
        <h3>Ready to Get Started?</h3>
        <p className="mb-4">Contact us today for a custom quote or to discuss your transcription needs.</p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/contact" className="btn btn-primary btn-lg">Contact Us</Link>
          <Link to="/careers" className="btn btn-outline-primary btn-lg">Join Our Team</Link>
        </div>
      </div>
    </div>
  );
}
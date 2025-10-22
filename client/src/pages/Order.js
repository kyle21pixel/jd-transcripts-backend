import React from 'react';
import OrderForm from '../components/Orders/OrderForm';

export default function Order() {
  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-8 mx-auto">
          <h2 className="text-center mb-4">Request a Quote</h2>
          <p className="text-center mb-4">
            Get a professional transcription quote. Fill out the form below and we'll provide
            you with a detailed estimate within 24 hours.
          </p>
          <OrderForm />
        </div>
      </div>
    </div>
  );
}
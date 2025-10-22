import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/email/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const result = await res.json();
      if (result.success) setMsg('Message sent!');
      else setMsg(result.message || 'Failed to send message');
    } catch {
      setMsg('Could not send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Contact Us</h2>
      <p>Have questions or need support? Fill out the form below and our team will get back to you soon.</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        </div>
        <div className="mb-3">
          <input className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        </div>
        <div className="mb-3">
          <textarea className="form-control" name="message" value={form.message} onChange={handleChange} placeholder="Message" rows={4} required />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>Send</button>
      </form>
      {msg && <div className="alert alert-info">{msg}</div>}
    </div>
  );
}

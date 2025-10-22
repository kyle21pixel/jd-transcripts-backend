import React, { useState } from 'react';

export default function Careers() {
  const [form, setForm] = useState({ name: '', email: '', cover: '', resume: null });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({ ...f, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('cover', form.cover);
    if (form.resume) data.append('resume', form.resume);
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/careers/apply`, { method: 'POST', body: data });
      const result = await res.json();
      if (result.success) setMsg('Application submitted!');
      else setMsg(result.message || 'Submission failed');
    } catch {
      setMsg('Could not submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h2>Careers</h2>
      <p>Join our team! Fill out the form below to apply for open positions.</p>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
          <input className="form-control" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
        </div>
        <div className="mb-3">
          <input className="form-control" name="email" value={form.email} onChange={handleChange} placeholder="Email" type="email" required />
        </div>
        <div className="mb-3">
          <textarea className="form-control" name="cover" value={form.cover} onChange={handleChange} placeholder="Cover Letter" rows={4} required />
        </div>
        <div className="mb-3">
          <input className="form-control" name="resume" type="file" accept=".pdf,.doc,.docx" onChange={handleChange} />
        </div>
        <button className="btn btn-success" type="submit" disabled={loading}>Apply</button>
      </form>
      {msg && <div className="alert alert-info">{msg}</div>}
    </div>
  );
}

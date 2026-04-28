// src/components/marketing/MarketingDashboard.js  — UPDATED: uses real backend API
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { getMyCampaigns, createCampaign, deleteCampaign } from '../../services/api';
import './MarketingDashboard.css';

const MarketingDashboard = () => {
  const location = useLocation();
  const [campaigns, setCampaigns] = useState([]);

  useEffect(() => {
    getMyCampaigns().then(setCampaigns).catch(() => setCampaigns([]));
  }, []);

  const handleAddCampaign = async (campaign) => {
    const created = await createCampaign(campaign);
    setCampaigns(prev => [...prev, created]);
  };

  const handleDeleteCampaign = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    await deleteCampaign(id);
    setCampaigns(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="marketing-dashboard">
      <div className="dashboard-sidebar">
        <h2>Marketing Panel</h2>
        <nav>
          <Link to="/marketing" className={location.pathname === '/marketing' ? 'active' : ''}>
            Analytics
          </Link>
          <Link to="/marketing/campaigns" className={location.pathname === '/marketing/campaigns' ? 'active' : ''}>
            Campaigns
          </Link>
          <Link to="/marketing/create" className={location.pathname === '/marketing/create' ? 'active' : ''}>
            Create Campaign
          </Link>
        </nav>
      </div>

      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={<MarketingHome campaigns={campaigns} />} />
          <Route path="/campaigns" element={<CampaignList campaigns={campaigns} onDelete={handleDeleteCampaign} />} />
          <Route path="/create" element={<CreateCampaign onAddCampaign={handleAddCampaign} />} />
        </Routes>
      </div>
    </div>
  );
};

const MarketingHome = ({ campaigns }) => {
  const totalReach = campaigns.reduce((s, c) => s + (c.reach || 0), 0);
  const totalConversions = campaigns.reduce((s, c) => s + (c.conversions || 0), 0);
  const avgEngagement = campaigns.length
    ? (campaigns.reduce((s, c) => s + (c.engagement || 0), 0) / campaigns.length).toFixed(1)
    : 0;

  return (
    <div>
      <h1>Marketing Analytics</h1>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h3>Total Reach</h3>
          <p className="analytics-number">{totalReach.toLocaleString()}</p>
        </div>
        <div className="analytics-card">
          <h3>Conversions</h3>
          <p className="analytics-number">{totalConversions}</p>
        </div>
        <div className="analytics-card">
          <h3>Avg. Engagement</h3>
          <p className="analytics-number">{avgEngagement}%</p>
        </div>
        <div className="analytics-card">
          <h3>Active Campaigns</h3>
          <p className="analytics-number">{campaigns.filter(c => c.status === 'active').length}</p>
        </div>
      </div>
    </div>
  );
};

const CampaignList = ({ campaigns, onDelete }) => (
  <div>
    <h1>My Campaigns</h1>
    {campaigns.length === 0 ? (
      <p>No campaigns yet. <Link to="/marketing/create">Create one →</Link></p>
    ) : (
      <div className="campaigns-list">
        {campaigns.map(c => (
          <div key={c.id} className="campaign-card">
            <div className="campaign-header">
              <h3>{c.name}</h3>
              <span className={`status status-${c.status}`}>{c.status}</span>
            </div>
            <p>Platform: {c.platform}</p>
            <p>Budget: ₹{c.budget}</p>
            <p>Dates: {c.startDate} → {c.endDate}</p>
            <p>Reach: {c.reach?.toLocaleString()} | Conversions: {c.conversions}</p>
            <button className="btn btn-delete" onClick={() => onDelete(c.id)}>Delete</button>
          </div>
        ))}
      </div>
    )}
  </div>
);

const CreateCampaign = ({ onAddCampaign }) => {
  const [formData, setFormData] = useState({
    name: '', platform: 'social-media', budget: '',
    startDate: '', endDate: '', audience: '', description: '', status: 'active'
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onAddCampaign({ ...formData, budget: parseFloat(formData.budget) });
      setSuccess('Campaign created successfully!');
      setFormData({ name: '', platform: 'social-media', budget: '', startDate: '', endDate: '', audience: '', description: '', status: 'active' });
    } catch (err) {
      alert('Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Campaign</h1>
      {success && <div style={{ color: 'green', marginBottom: 12 }}>✅ {success}</div>}
      <form onSubmit={handleSubmit} className="campaign-form">
        <div className="form-group">
          <label>Campaign Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Platform:</label>
          <select name="platform" value={formData.platform} onChange={handleChange}>
            <option value="social-media">Social Media</option>
            <option value="email">Email</option>
            <option value="google-ads">Google Ads</option>
            <option value="influencer">Influencer</option>
          </select>
        </div>
        <div className="form-group">
          <label>Budget (₹):</label>
          <input type="number" name="budget" value={formData.budget} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>End Date:</label>
          <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Target Audience:</label>
          <input type="text" name="audience" value={formData.audience} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Creating...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
};

export default MarketingDashboard;

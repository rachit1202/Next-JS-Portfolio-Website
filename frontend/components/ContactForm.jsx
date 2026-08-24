'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';
import { api } from '@/lib/api';

const inputClass = "w-full px-4 py-3 rounded-xl text-sm text-slate-200 bg-white/[0.04] border border-white/10 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 placeholder:text-slate-500";

function Input({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <input
        id={id}
        className={inputClass}
        {...props}
      />
    </div>
  );
}

function Textarea({ label, id, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-medium text-slate-400 mb-1.5">{label}</label>
      <textarea
        id={id}
        className={`${inputClass} resize-none`}
        {...props}
      />
    </div>
  );
}

const DEFAULT_SERVICES = [
  'Full-Stack Web Development',
  'Custom WordPress & PHP Solutions',
  'UI/UX Design & High-Fidelity Figma',
  'Cyber Security Hardening & Penetration Testing',
  'SEO & Search Engine Dominance',
  'Website Maintenance & Speed Optimization',
  'Technical Consultation'
];

const DEFAULT_BUDGETS = [
  'Under ₹40K',
  '₹40K - ₹1.2L',
  '₹1.2L - ₹2.5L',
  '₹2.5L+'
];

export default function ContactForm({ servicesOptions = DEFAULT_SERVICES, budgetOptions = DEFAULT_BUDGETS }) {
  const finalServices = servicesOptions && servicesOptions.length > 0 ? servicesOptions : DEFAULT_SERVICES;
  const finalBudgets = budgetOptions && budgetOptions.length > 0 ? budgetOptions : DEFAULT_BUDGETS;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    serviceNeeded: finalServices[0],
    budget: finalBudgets[0],
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (field) => (e) => setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.phone.trim()) {
      setError('Please provide a valid contact phone number.');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const payload = {
        ...formData,
        pageUrl: typeof window !== 'undefined' ? window.location.href : ''
      };
      const res = await api.submitLead(payload);
      setSuccess(res.message || 'Message sent! I will get back to you within 24 hours.');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        serviceNeeded: finalServices[0],
        budget: finalBudgets[0],
        message: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to submit. Please try again or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="rounded-3xl p-6 sm:p-8 space-y-6"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div>
        <h2 className="text-lg font-black text-white">Send a Message</h2>
        <p className="text-xs text-slate-400 mt-1">Fill out the form and I&apos;ll get back to you as soon as possible.</p>
      </div>

      {success && (
        <div className="flex items-start gap-3 p-4 rounded-2xl text-sm" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)', color: '#34d399' }}>
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-2xl text-sm" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Row 1: Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="contact-name"
            label="Your Name *"
            type="text"
            required
            placeholder="Rahul Sharma"
            value={formData.name}
            onChange={handleChange('name')}
          />
          <Input
            id="contact-email"
            label="Email Address *"
            type="email"
            required
            placeholder="rahul@example.com"
            value={formData.email}
            onChange={handleChange('email')}
          />
        </div>

        {/* Row 2: Phone (Mandatory) and Subject (Together) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            id="contact-phone"
            label="Phone Number *"
            type="tel"
            required
            placeholder="+91 98765 43210"
            value={formData.phone}
            onChange={handleChange('phone')}
          />
          <Input
            id="contact-subject"
            label="Subject *"
            type="text"
            required
            placeholder="Project Inquiry — E-commerce Platform"
            value={formData.subject}
            onChange={handleChange('subject')}
          />
        </div>

        {/* Row 3: Custom UI Selects for Service & Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CustomSelect
            id="contact-service"
            label="Service Required"
            value={formData.serviceNeeded}
            options={finalServices}
            onChange={handleChange('serviceNeeded')}
          />
          <CustomSelect
            id="contact-budget"
            label="Estimated Budget"
            value={formData.budget}
            options={finalBudgets}
            onChange={handleChange('budget')}
          />
        </div>

        {/* Row 4: Message */}
        <Textarea
          id="contact-message"
          label="Message *"
          required
          rows={5}
          placeholder="Tell me about your project, timeline, and budget..."
          value={formData.message}
          onChange={handleChange('message')}
        />

        <button
          type="submit"
          id="contact-submit-btn"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:opacity-90 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #6366f1)', boxShadow: '0 8px 24px rgba(124,58,237,0.35)' }}
        >
          {loading ? (
            <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
          ) : (
            <><Send className="w-4 h-4" /> Send Message</>
          )}
        </button>
      </form>
    </div>
  );
}

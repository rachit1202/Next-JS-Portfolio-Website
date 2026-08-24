'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '@/components/AdminSidebar';
import { Inbox, Mail, Phone, Calendar, Trash2, CheckCircle2, MessageSquare, Filter, Search, X } from 'lucide-react';
import { api } from '@/lib/api';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedLead, setSelectedLead] = useState(null);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  const loadLeads = async () => {
    try {
      const res = await api.getLeads();
      setLeads(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('rachit_admin_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadLeads();
  }, [router]);

  const filteredLeads = leads.filter(lead => {
    const q = searchTerm.toLowerCase().trim();
    const matchStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchSearch = !q ||
      lead.name?.toLowerCase().includes(q) ||
      lead.email?.toLowerCase().includes(q) ||
      lead.phone?.toLowerCase().includes(q) ||
      lead.serviceNeeded?.toLowerCase().includes(q) ||
      lead.budget?.toLowerCase().includes(q) ||
      lead.message?.toLowerCase().includes(q) ||
      lead.notes?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await api.updateLeadStatus(leadId, { status: newStatus });
      loadLeads();
      if (selectedLead && selectedLead._id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleSaveNotes = async (leadId) => {
    try {
      await api.updateLeadStatus(leadId, { notes });
      alert('Notes saved successfully!');
      loadLeads();
    } catch (err) {
      alert('Error saving notes');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.deleteLead(id);
      if (selectedLead && selectedLead._id === id) setSelectedLead(null);
      loadLeads();
    } catch (err) {
      alert('Error deleting lead');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#07080f] text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-8 space-y-6 overflow-y-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Inbox className="w-6 h-6 text-emerald-400" /> Leads & Inquiries Inbox
            </h1>
            <p className="text-xs text-slate-400">Direct project inquiries received from public contact forms</p>
          </div>
        </div>

        {/* Search & Status Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 glass-card p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search leads by client name, email, phone, service needed, or message..."
              className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-400 transition-all"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['All', 'New', 'In Progress', 'Contacted', 'Closed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Leads List */}
          <div className="lg:col-span-2 glass-card rounded-2xl overflow-hidden border border-slate-800">
            <div className="divide-y divide-slate-800">
              {filteredLeads.length === 0 ? (
                <p className="p-8 text-center text-xs text-slate-400">No lead submissions found.</p>
              ) : (
                filteredLeads.map((lead) => (
                  <div
                    key={lead._id}
                    onClick={() => {
                      setSelectedLead(lead);
                      setNotes(lead.notes || '');
                    }}
                    className={`p-4 hover:bg-slate-900/60 cursor-pointer transition-colors ${
                      selectedLead?._id === lead._id ? 'bg-slate-900/90 border-l-4 border-purple-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-white">{lead.name}</h4>
                        {lead.subject && (
                          <span className="text-[10px] bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-medium truncate max-w-[180px]">
                            {lead.subject}
                          </span>
                        )}
                      </div>
                      <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full shrink-0 ${
                        lead.status === 'New' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold' :
                        lead.status === 'In Progress' ? 'bg-cyan-500/20 text-cyan-400' :
                        lead.status === 'Contacted' ? 'bg-purple-500/20 text-purple-400' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {lead.status}
                      </span>
                    </div>

                    <div className="text-xs text-cyan-400 font-mono mt-1">{lead.email} {lead.phone && `• ${lead.phone}`}</div>
                    <div className="text-xs text-slate-400 mt-1">
                      Requested: <strong className="text-slate-200">{lead.serviceNeeded}</strong> • Budget: <span className="text-emerald-400 font-semibold">{lead.budget}</span>
                    </div>
                    <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">{lead.message}</p>
                    
                    <div className="flex items-center justify-between gap-2 text-[10px] text-slate-500 font-mono mt-3 pt-2 border-t border-slate-900">
                      <span>{new Date(lead.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</span>
                      {lead.ipAddress && (
                        <span className="text-cyan-500/70 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                          IP: {lead.ipAddress}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Selected Lead Detailed Card */}
          <div>
            {selectedLead ? (
              <div className="glass-card p-6 rounded-3xl space-y-4 border border-purple-500/30 sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-base font-bold text-white">Lead Details</h3>
                  <button onClick={() => handleDelete(selectedLead._id)} className="text-xs text-rose-400 hover:underline flex items-center gap-1 cursor-pointer">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Sender Name</span>
                    <strong className="text-white text-sm">{selectedLead.name}</strong>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Subject / Topic</span>
                    <span className="text-purple-300 font-semibold text-xs">
                      {selectedLead.subject || `${selectedLead.serviceNeeded} Inquiry`}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Email Address</span>
                      <a href={`mailto:${selectedLead.email}`} className="text-cyan-400 font-mono hover:underline break-all">
                        {selectedLead.email}
                      </a>
                    </div>
                    {selectedLead.phone && (
                      <div>
                        <span className="text-slate-500 block text-[11px]">Phone</span>
                        <a href={`tel:${selectedLead.phone}`} className="text-cyan-400 font-mono hover:underline">
                          {selectedLead.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-slate-500 block text-[11px]">Service Needed</span>
                      <span className="text-slate-200 font-medium">{selectedLead.serviceNeeded}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px]">Budget Range</span>
                      <span className="text-emerald-400 font-semibold">{selectedLead.budget}</span>
                    </div>
                  </div>

                  {/* Metadata: User IP & Source URL */}
                  <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>User IP:</span>
                      <span className="text-cyan-400 font-bold">{selectedLead.ipAddress || '127.0.0.1'}</span>
                    </div>
                    {selectedLead.pageUrl && (
                      <div className="space-y-0.5 text-slate-400">
                        <span>Submitted From:</span>
                        <a href={selectedLead.pageUrl} target="_blank" rel="noreferrer" className="text-purple-300 hover:underline block break-all text-[10px]">
                          {selectedLead.pageUrl}
                        </a>
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px]">Full Message / Requirements</span>
                    <p className="text-slate-200 leading-relaxed bg-slate-900/90 p-3 rounded-xl border border-slate-800 mt-1 whitespace-pre-line text-xs">
                      {selectedLead.message}
                    </p>
                  </div>
                </div>

                {/* Status Switcher */}
                <div className="pt-2 border-t border-slate-800 space-y-2">
                  <label className="block text-xs font-semibold text-slate-400">Change Status</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => handleStatusChange(selectedLead._id, e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Internal Notes */}
                <div className="pt-2 space-y-2 text-xs">
                  <label className="block font-semibold text-slate-400">Internal Admin Notes</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add private notes about this client call or quote..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white"
                  />
                  <button
                    onClick={() => handleSaveNotes(selectedLead._id)}
                    className="w-full py-2 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500"
                  >
                    Save Internal Notes
                  </button>
                </div>

              </div>
            ) : (
              <div className="glass-card p-8 rounded-3xl text-center border border-slate-800 text-slate-400 text-xs">
                Select an inquiry from the list to view full details, update status, and write notes.
              </div>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}

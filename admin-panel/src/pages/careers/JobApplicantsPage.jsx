import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Download, ExternalLink, Mail, Phone, Calendar, User, FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const JobApplicantsPage = ({ jobId, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  useEffect(() => {
    fetchApplications();
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/jobs/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobTitle(response.data.title);
    } catch (error) {
      console.error('Error fetching job details', error);
    }
  };

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/applications/job/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/applications/${id}/status`, newStatus, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'text/plain' // Sending raw string as body based on controller
        }
      });
      toast.success('Status updated successfully');
      fetchApplications();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const downloadResume = async (resumeUrl, name) => {
    try {
      const token = localStorage.getItem('token');
      // Start download
      const response = await axios.get(`${API_URL}/admin/applications/resume/${resumeUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${name}_Resume.pdf`); // Assuming PDF/doc, browser handling usually works
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
      toast.error("Failed to download resume");
    }
  }

  const viewResume = async (resumeUrl) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/applications/resume/${resumeUrl}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      // Force PDF type for preview
      const file = new Blob([response.data], { type: 'application/pdf' });
      const fileURL = URL.createObjectURL(file);
      window.open(fileURL, '_blank');
    } catch (error) {
      console.error("Preview failed", error);
      toast.error("Failed to preview resume");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-800';
      case 'SCREENING': return 'bg-purple-100 text-purple-800';
      case 'INTERVIEW': return 'bg-yellow-100 text-yellow-800';
      case 'OFFER': return 'bg-green-100 text-green-800';
      case 'HIRED': return 'bg-green-600 text-white';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="flex items-center mb-6">
        <button
          onClick={onBack}
          className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Applicants</h1>
          <p className="text-gray-600 dark:text-gray-400">For role: {jobTitle || 'Loading...'}</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading applicants...</div>
      ) : (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div key={app.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    {app.firstName} {app.lastName}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={12} /> {new Date(app.appliedAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-gray-400" />
                    <a href={`mailto:${app.email}`} className="hover:text-blue-600">{app.email}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    {app.phone}
                  </div>
                  {app.linkedinUrl && (
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        LinkedIn <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                  {app.portfolioUrl && (
                    <div className="flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" />
                      <a href={app.portfolioUrl} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                        Portfolio <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>

                {app.resumeUrl && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => viewResume(app.resumeUrl)}
                      className="flex items-center gap-2 text-sm text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-colors border border-purple-100"
                    >
                      <Eye size={16} /> Preview
                    </button>
                    <button
                      onClick={() => downloadResume(app.resumeUrl, `${app.firstName}_${app.lastName}`)}
                      className="flex items-center gap-2 text-sm text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg transition-colors border border-blue-100"
                    >
                      <Download size={16} /> Download
                    </button>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2 justify-center border-l border-gray-100 pl-6 md:w-48">
                <label className="text-xs font-semibold text-gray-500 uppercase">Change Status</label>
                <select
                  value={app.status}
                  onChange={(e) => handleStatusUpdate(app.id, e.target.value)}
                  className="w-full text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 p-2 bg-gray-50"
                >
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="HIRED">Hired</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>
            </div>
          ))}

          {applications.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">No applications received yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobApplicantsPage;

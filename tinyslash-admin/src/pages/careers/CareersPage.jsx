import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, MapPin, Briefcase, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import JobForm from './JobForm';
import toast from 'react-hot-toast';

const CareersPage = ({ onViewApplicants }) => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  // Use the admin API URL from environment similar to other pages
  // Assuming axios instance is configured or we use direct axios with token
  // Ensure API_URL points to the correct endpoint
  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/jobs`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (jobData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/admin/jobs`, jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job created successfully');
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    }
  };

  const handleUpdate = async (jobData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`${API_URL}/admin/jobs/${editingJob.id}`, jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job updated successfully');
      setEditingJob(null);
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_URL}/admin/jobs/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Job deleted successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    }
  };

  if (showForm) {
    return (
      <JobForm
        job={editingJob}
        onSave={editingJob ? handleUpdate : handleCreate}
        onCancel={() => {
          setShowForm(false);
          setEditingJob(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Careers Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage job postings and openings.</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Job
        </button>
      </div>

      {loading ? (
        <div className="text-center py-10">Loading jobs...</div>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{job.title}</h3>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="flex items-center">
                      <Briefcase size={16} className="mr-1" /> {job.department}
                    </span>
                    <span className="flex items-center">
                      <MapPin size={16} className="mr-1" /> {job.location}
                    </span>
                    <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs border border-gray-200 dark:border-gray-600">
                      {job.type}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onViewApplicants(job.id)}
                    className="p-2 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg"
                    title="View Applicants"
                  >
                    <Users size={18} />
                  </button>
                  <button
                    onClick={() => {
                      setEditingJob(job);
                      setShowForm(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(job.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 line-clamp-2">{job.description}</p>
              <div className="mt-4 text-xs text-gray-400">
                Posted on: {job.postedDate}
              </div>
            </div>
          ))}

          {jobs.length === 0 && (
            <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No jobs posted yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-blue-600 hover:underline"
              >
                Create your first job posting
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CareersPage;

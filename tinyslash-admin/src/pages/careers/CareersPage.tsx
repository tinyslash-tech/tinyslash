import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, MapPin, Briefcase, Users } from 'lucide-react';
import { adminApiEndpoints } from '../../services/api';
import JobForm from './JobForm';
import toast from 'react-hot-toast';

import { Job } from '../../types';

interface CareersPageProps {
  onViewApplicants: (jobId: string) => void;
}

const CareersPage: React.FC<CareersPageProps> = ({ onViewApplicants }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const queryClient = useQueryClient();

  // Fetch jobs
  const { data: jobsData, isLoading } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => adminApiEndpoints.jobs.list(),
  });

  const rawJobs = jobsData?.data;
  const jobs: Job[] = Array.isArray(rawJobs) ? rawJobs : (rawJobs?.data || []);

  const createJobMutation = useMutation({
    mutationFn: (jobData: Partial<Job>) => adminApiEndpoints.jobs.create(jobData),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job created successfully');
      setShowForm(false);
    },
    onError: (error: any) => {
      console.error('Error creating job:', error);
      toast.error('Failed to create job');
    },
  });

  const updateJobMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Job> }) =>
      adminApiEndpoints.jobs.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job updated successfully');
      setEditingJob(null);
      setShowForm(false);
    },
    onError: (error: any) => {
      console.error('Error updating job:', error);
      toast.error('Failed to update job');
    },
  });

  const deleteJobMutation = useMutation({
    mutationFn: (id: string) => adminApiEndpoints.jobs.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['jobs']);
      toast.success('Job deleted successfully');
    },
    onError: (error: any) => {
      console.error('Error deleting job:', error);
      toast.error('Failed to delete job');
    },
  });

  const handleCreate = (jobData: Partial<Job>) => {
    createJobMutation.mutate(jobData);
  };

  const handleUpdate = (jobData: Partial<Job>) => {
    if (!editingJob) return;
    updateJobMutation.mutate({ id: editingJob.id, data: jobData });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    deleteJobMutation.mutate(id);
  };

  if (showForm) {
    return (
      <JobForm
        job={editingJob || undefined}
        onSave={(data: Partial<Job>) => editingJob ? handleUpdate(data) : handleCreate(data)}
        onCancel={() => {
          setShowForm(false);
          setEditingJob(null);
        }}
        loading={createJobMutation.isLoading || updateJobMutation.isLoading}
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

      {isLoading ? (
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

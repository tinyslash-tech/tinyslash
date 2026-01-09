import axios from 'axios';

// Define the Job interface matching the backend model and frontend usage
export interface JobRequirements {
  mustHave: string[];
  niceToHave: string[];
}

export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  salary?: string;
  position?: number;
  postedDate: string;
  description: string;
  responsibilities: string[];
  requirements: JobRequirements;
  benefits: string[];
}

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const careerApi = {
  getAllJobs: async (): Promise<Job[]> => {
    const response = await axios.get<Job[]>(`${API_URL}/public/jobs`);
    return response.data;
  },

  getJobById: async (id: string): Promise<Job> => {
    // Current backend implementation does not have a public single job endpoint, 
    // but the list is small enough to filter on client or we can add one.
    // For now, we'll fetch all and find one to match existing behavior if needed,
    // or request specific backend endpoint.
    const response = await axios.get<Job[]>(`${API_URL}/public/jobs`);
    const job = response.data.find(j => j.id === id);
    if (!job) throw new Error('Job not found');
    return job;
  },

  submitApplication: async (application: any, resume: File | null) => {
    const formData = new FormData();
    formData.append('application', JSON.stringify(application));
    if (resume) {
      formData.append('resume', resume);
    }
    const response = await axios.post(`${API_URL}/public/applications`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  }
};

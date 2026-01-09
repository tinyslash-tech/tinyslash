import React, { useState, useEffect } from 'react';
import { X, Plus, Trash } from 'lucide-react';

const JobForm = ({ job, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    department: 'Engineering',
    location: '',
    type: 'Full-time',
    experience: '',
    salary: '',
    position: 0,
    description: '',
    responsibilities: [''],
    requirements: { mustHave: [''], niceToHave: [''] },
    benefits: ['']
  });

  useEffect(() => {
    if (job) {
      setFormData({
        ...job,
        position: job.position || 0,
        responsibilities: job.responsibilities || [''],
        requirements: {
          mustHave: job.requirements?.mustHave || [''],
          niceToHave: job.requirements?.niceToHave || ['']
        },
        benefits: job.benefits || ['']
      });
    }
  }, [job]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field, index, value, parentField = null) => {
    if (parentField) {
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [field]: prev[parentField][field].map((item, i) => i === index ? value : item)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].map((item, i) => i === index ? value : item)
      }));
    }
  };

  const addArrayItem = (field, parentField = null) => {
    if (parentField) {
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [field]: [...prev[parentField][field], '']
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], '']
      }));
    }
  };

  const removeArrayItem = (field, index, parentField = null) => {
    if (parentField) {
      setFormData(prev => ({
        ...prev,
        [parentField]: {
          ...prev[parentField],
          [field]: prev[parentField][field].filter((_, i) => i !== index)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          {job ? 'Edit Job' : 'Create New Job'}
        </h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Department</label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>Engineering</option>
              <option>Design</option>
              <option>Marketing</option>
              <option>Product</option>
              <option>Support</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
              <option>Hybrid</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Experience</label>
            <input
              type="text"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Salary</label>
            <input
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          {/* Added Position Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Position (Order)</label>
            <input
              type="number"
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="0 (Lower shows first)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            required
          ></textarea>
        </div>

        {/* Dynamic Lists Sections */}
        {/* Responsibilities */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Responsibilities</label>
            <button type="button" onClick={() => addArrayItem('responsibilities')} className="text-blue-600 text-sm flex items-center">
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>
          {formData.responsibilities.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('responsibilities', index, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Responsibility"
              />
              <button type="button" onClick={() => removeArrayItem('responsibilities', index)} className="text-red-500">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Requirements: Must Have */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements (Must Have)</label>
            <button type="button" onClick={() => addArrayItem('mustHave', 'requirements')} className="text-blue-600 text-sm flex items-center">
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>
          {formData.requirements.mustHave.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('mustHave', index, e.target.value, 'requirements')}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Must have requirement"
              />
              <button type="button" onClick={() => removeArrayItem('mustHave', index, 'requirements')} className="text-red-500">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Requirements: Nice to Have */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements (Nice to Have)</label>
            <button type="button" onClick={() => addArrayItem('niceToHave', 'requirements')} className="text-blue-600 text-sm flex items-center">
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>
          {formData.requirements.niceToHave.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('niceToHave', index, e.target.value, 'requirements')}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Nice to have requirement"
              />
              <button type="button" onClick={() => removeArrayItem('niceToHave', index, 'requirements')} className="text-red-500">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Benefits</label>
            <button type="button" onClick={() => addArrayItem('benefits')} className="text-blue-600 text-sm flex items-center">
              <Plus size={16} className="mr-1" /> Add
            </button>
          </div>
          {formData.benefits.map((item, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Benefit"
              />
              <button type="button" onClick={() => removeArrayItem('benefits', index)} className="text-red-500">
                <Trash size={16} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t dark:border-gray-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {job ? 'Update Job' : 'Create Job'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default JobForm;

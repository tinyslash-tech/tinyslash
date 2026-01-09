import React, { useState } from 'react';

// Domain Management Page - Complete Implementation
const DomainsPage = ({ hasPermission }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);

  const [activeTab, setActiveTab] = useState('domains');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [domains, setDomains] = useState([]);

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  // Use correct endpoint base
  const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

  React.useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('token');
      // Note: CustomDomainController is mapped to /api/domains
      const response = await fetch(`${API_URL}/domains/admin/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          const mappedDomains = result.domains.map((d, index) => ({
            id: d.id || index,
            domain: d.domain,
            owner: d.ownerId, // Ideally map to name if available
            ownerEmail: 'N/A', // Not returned by admin endpoint yet
            type: d.ownerType === 'TEAM' ? 'Team Domain' : 'Personal Domain',
            status: d.isVerified ? 'Active' : (d.status === 'PENDING' ? 'Pending Verification' : d.status),
            ssl: d.sslStatus || 'Pending',
            sslExpiry: null,
            verified: d.isVerified,
            created: d.created ? new Date(d.created).toLocaleDateString() : 'N/A',
            lastChecked: d.lastChecked ? new Date(d.lastChecked).toLocaleString() : 'Never',
            usage: d.usage || { links: 0, clicks: 0, bandwidth: '0 GB' },
            dnsRecords: [] // Not fetched in list view
          }));
          setDomains(mappedDomains);
        } else {
          throw new Error(result.message || "Failed to fetch domains");
        }
      } else {
        throw new Error(`HTTP Error: ${response.status}`);
      }
    } catch (err) {
      console.error("Error fetching domains:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sslCertificates = domains.map(d => ({
    id: d.id,
    domain: d.domain,
    issuer: 'Cloudflare',
    type: 'Universal SSL',
    status: d.ssl,
    issued: 'N/A',
    expires: 'Auto-renew',
    autoRenew: true,
    daysLeft: 90
  }));

  const dnsRecords = []; // Placeholder until DNS details are fetched individually

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Domain Management</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage custom domains, SSL certificates, and DNS configuration</p>
        </div>
        <div className="flex space-x-3">
          {hasPermission('domains', 'verify') && (
            <button
              onClick={() => setShowVerifyModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Verify Domains
            </button>
          )}
          {hasPermission('domains', 'create') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Domain
            </button>
          )}
        </div>
      </div>

      {/* Domain Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Domains</h3>
          <p className="text-2xl font-bold text-blue-600 mt-2">{domains.length}</p>
          <p className="text-sm text-green-600 mt-1">+1 this month</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Domains</h3>
          <p className="text-2xl font-bold text-green-600 mt-2">{domains.filter(d => d.status === 'Active').length}</p>
          <p className="text-sm text-gray-500 mt-1">50% active rate</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">SSL Issues</h3>
          <p className="text-2xl font-bold text-red-600 mt-2">{domains.filter(d => d.ssl === 'Expired' || d.ssl === 'Pending').length}</p>
          <p className="text-sm text-red-600 mt-1">Needs attention</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Bandwidth</h3>
          <p className="text-2xl font-bold text-purple-600 mt-2">11.5 GB</p>
          <p className="text-sm text-purple-600 mt-1">This month</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'domains', label: 'Domains', count: domains.length },
            { id: 'ssl', label: 'SSL Certificates', count: sslCertificates.length },
            { id: 'dns', label: 'DNS Records', count: dnsRecords.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Domains Tab */}
      {activeTab === 'domains' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Owner</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">SSL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Usage</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {domains.map((domain) => (
                <tr key={domain.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white font-mono">{domain.domain}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Created: {domain.created}</div>
                      <div className="text-xs text-gray-400">Last checked: {domain.lastChecked}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{domain.owner}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{domain.ownerEmail}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${domain.type === 'Custom Domain' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {domain.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <span className={`px-2 py-1 text-xs rounded-full ${domain.status === 'Active' ? 'bg-green-100 text-green-800' :
                        domain.status === 'Pending Verification' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {domain.status}
                      </span>
                      {domain.verified && (
                        <span className="ml-2 text-green-500" title="Verified">✓</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <span className={`px-2 py-1 text-xs rounded-full ${domain.ssl === 'Valid' ? 'bg-green-100 text-green-800' :
                        domain.ssl === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                        {domain.ssl}
                      </span>
                      {domain.sslExpiry && (
                        <div className="text-xs text-gray-500 mt-1">Expires: {domain.sslExpiry}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      <div>{domain.usage.links} links</div>
                      <div>{domain.usage.clicks.toLocaleString()} clicks</div>
                      <div>{domain.usage.bandwidth}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">Configure</button>
                      {hasPermission('domains', 'verify') && domain.status !== 'Active' && (
                        <button className="text-green-600 hover:text-green-800">Verify</button>
                      )}
                      {hasPermission('domains', 'delete') && (
                        <button className="text-red-600 hover:text-red-800">Remove</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SSL Certificates Tab */}
      {activeTab === 'ssl' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Issuer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Expires</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Auto Renew</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {sslCertificates.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white font-mono">{cert.domain}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{cert.issuer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${cert.type === 'EV SSL' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                      {cert.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${cert.status === 'Valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {cert.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">{cert.expires}</div>
                    <div className={`text-xs ${cert.daysLeft < 30 ? 'text-red-500' : cert.daysLeft < 60 ? 'text-yellow-500' : 'text-gray-500'}`}>
                      {cert.daysLeft > 0 ? `${cert.daysLeft} days left` : `Expired ${Math.abs(cert.daysLeft)} days ago`}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${cert.autoRenew ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                      {cert.autoRenew ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      {hasPermission('ssl', 'renew') && (
                        <button className="text-green-600 hover:text-green-800">Renew</button>
                      )}
                      {hasPermission('ssl', 'configure') && (
                        <button className="text-blue-600 hover:text-blue-800">Configure</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* DNS Records Tab */}
      {activeTab === 'dns' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Domain</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">TTL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {dnsRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white font-mono">{record.domain}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full font-mono ${record.type === 'A' ? 'bg-blue-100 text-blue-800' :
                      record.type === 'CNAME' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                      {record.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{record.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-mono">{record.value}</td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{record.ttl}s</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${record.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                      {record.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      {hasPermission('dns', 'edit') && (
                        <button className="text-blue-600 hover:text-blue-800">Edit</button>
                      )}
                      {hasPermission('dns', 'delete') && (
                        <button className="text-red-600 hover:text-red-800">Delete</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Domain Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Add Custom Domain</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Domain Name</label>
                <input type="text" className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" placeholder="example.com" />
                <p className="text-xs text-gray-500 mt-1">Enter your custom domain without http://</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Owner Team</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option>Marketing Team</option>
                  <option>Development Team</option>
                  <option>Sales Team</option>
                  <option>Support Team</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SSL Certificate</label>
                <select className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                  <option>Auto-generate (Let's Encrypt)</option>
                  <option>Upload Custom Certificate</option>
                  <option>No SSL (Not Recommended)</option>
                </select>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">DNS Configuration Required</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  After adding the domain, you'll need to configure these DNS records:
                </p>
                <div className="mt-2 font-mono text-xs text-blue-600 dark:text-blue-400">
                  <div>A @ 192.168.1.100</div>
                  <div>CNAME www your-domain.com</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Add Domain
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Domains Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Domain Verification</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">Pending Verification</h4>
                <div className="space-y-2">
                  {domains.filter(d => !d.verified).map(domain => (
                    <div key={domain.id} className="flex items-center justify-between">
                      <span className="text-sm text-yellow-700 dark:text-yellow-300 font-mono">{domain.domain}</span>
                      <button className="text-xs bg-yellow-600 text-white px-2 py-1 rounded">Verify Now</button>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">Verification Steps</h4>
                <ol className="text-xs text-green-700 dark:text-green-300 space-y-1">
                  <li>1. Configure DNS records as shown above</li>
                  <li>2. Wait for DNS propagation (up to 24 hours)</li>
                  <li>3. Click "Verify Now" to check configuration</li>
                  <li>4. SSL certificate will be auto-generated upon verification</li>
                </ol>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowVerifyModal(false)}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                Verify All Domains
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DomainsPage;

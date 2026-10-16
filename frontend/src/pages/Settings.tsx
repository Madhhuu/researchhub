import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle, 
  Plus
} from 'lucide-react';
import Button from '../components/common/Button';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'general' | 'departments' | 'verification' | 'notifications'>('general');
  const [saved, setSaved] = useState(false);

  // Form state
  const [appName, setAppName] = useState('ResearchHub Repository');
  const [defaultYear, setDefaultYear] = useState('AY 2025 - 2026');
  const [autoDoiLookup, setAutoDoiLookup] = useState(true);
  const [requirePdf, setRequirePdf] = useState(true);
  const [adminNotifications, setAdminNotifications] = useState(true);

  const [depts, setDepts] = useState([
    { name: 'CSE', full: 'Computer Science and Engineering', code: 'CSE-101' },
    { name: 'ECE', full: 'Electronics and Communication Engineering', code: 'ECE-102' },
    { name: 'EEE', full: 'Electrical and Electronics Engineering', code: 'EEE-103' },
    { name: 'IT', full: 'Information Technology', code: 'IT-104' },
    { name: 'Mechanical', full: 'Mechanical Engineering', code: 'ME-105' },
    { name: 'Civil', full: 'Civil Engineering', code: 'CE-106' },
  ]);

  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptFull, setNewDeptFull] = useState('');

  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (newDeptName && newDeptFull) {
      setDepts([
        ...depts,
        { name: newDeptName, full: newDeptFull, code: `${newDeptName.toUpperCase()}-107` }
      ]);
      setNewDeptName('');
      setNewDeptFull('');
    }
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Platform Administration</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">System Settings & Guidelines</h2>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Settings saved!
            </span>
          )}
          <Button variant="primary" size="sm" onClick={handleSave} className="cursor-pointer">
            <Save className="w-4 h-4 mr-1.5" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="bg-white border border-gray-200/80 rounded-xl shadow-2xs overflow-hidden">
        {/* Navigation Tabs */}
        <div className="flex border-b border-gray-100 bg-gray-50/50 px-6 pt-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('general')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'general'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            General Preferences
          </button>
          <button
            onClick={() => setActiveTab('departments')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'departments'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Department Management
          </button>
          <button
            onClick={() => setActiveTab('verification')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'verification'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Verification Rules
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-900'
            }`}
          >
            Notification Preferences
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Repository Metadata</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Repository Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Default Academic Year Filter
                  </label>
                  <select
                    value={defaultYear}
                    onChange={(e) => setDefaultYear(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="AY 2025 - 2026">AY 2025 - 2026</option>
                    <option value="AY 2024 - 2025">AY 2024 - 2025</option>
                    <option value="AY 2023 - 2024">AY 2023 - 2024</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Automated Indexing Settings</h3>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200/60">
                  <div>
                    <span className="text-xs font-bold text-gray-800 block">Automatic CrossRef DOI Metadata Sync</span>
                    <span className="text-[11px] text-gray-500">Fetch citation count and journal volume automatically on DOI entry</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoDoiLookup}
                    onChange={(e) => setAutoDoiLookup(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div className="space-y-6 max-w-3xl">
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Configured Academic Departments</h3>
                <div className="divide-y divide-gray-100 border border-gray-200 rounded-xl overflow-hidden bg-white text-xs">
                  {depts.map((d, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between hover:bg-gray-50">
                      <div>
                        <span className="font-bold text-gray-900 text-sm block">{d.name}</span>
                        <span className="text-gray-500">{d.full}</span>
                      </div>
                      <span className="font-mono text-gray-400 font-semibold">{d.code}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Department Form */}
              <form onSubmit={handleAddDept} className="pt-4 border-t border-gray-100 space-y-3">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Add New Department</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={newDeptName}
                    onChange={(e) => setNewDeptName(e.target.value)}
                    placeholder="Short Code (e.g. AI-DS)"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={newDeptFull}
                    onChange={(e) => setNewDeptFull(e.target.value)}
                    placeholder="Full Department Name"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>
                <Button type="submit" variant="secondary" size="sm" className="cursor-pointer">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Add Department
                </Button>
              </form>
            </div>
          )}

          {activeTab === 'verification' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Verification Policies</h3>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Require PDF Upload for Verification</span>
                  <span className="text-[11px] text-gray-500">Require faculty to attach full-text PDF before submission can be marked Verified</span>
                </div>
                <input
                  type="checkbox"
                  checked={requirePdf}
                  onChange={(e) => setRequirePdf(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-4 max-w-2xl">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Notification Rules</h3>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200/60">
                <div>
                  <span className="text-xs font-bold text-gray-800 block">Notify Admin on New Publication Submission</span>
                  <span className="text-[11px] text-gray-500">Send instant notification when a faculty member submits a new claim</span>
                </div>
                <input
                  type="checkbox"
                  checked={adminNotifications}
                  onChange={(e) => setAdminNotifications(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

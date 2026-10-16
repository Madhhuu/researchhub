import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  CheckCircle, 
  X,
  Eye
} from 'lucide-react';
import { mockReportPresets } from '../data/mockData';
import type { ReportPreset } from '../types';
import Button from '../components/common/Button';

const Reports: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activePreset, setActivePreset] = useState<ReportPreset | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadedFormat, setDownloadedFormat] = useState<string | null>(null);

  const categories = ['All', 'Accreditation', 'Departmental', 'Faculty'];

  const filteredPresets = mockReportPresets.filter((preset) =>
    selectedCategory === 'All' ? true : preset.category === selectedCategory
  );

  const handleDownload = (format: string) => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadedFormat(format);
      setTimeout(() => setDownloadedFormat(null), 3000);
    }, 1200);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white border border-gray-200/80 rounded-xl p-5 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Reporting Suite</span>
          <h2 className="text-lg font-bold text-gray-900 mt-0.5">Accreditation & Institutional Reports</h2>
        </div>
        <div className="flex items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Report Presets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPresets.map((preset) => (
          <div 
            key={preset.id} 
            className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 border border-blue-100 rounded">
                  {preset.category}
                </span>
                <span className="text-[11px] text-gray-400 font-medium">
                  Last generated: {preset.lastGenerated}
                </span>
              </div>

              <h3 className="text-base font-bold text-gray-900 leading-snug">{preset.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{preset.description}</p>

              <div className="pt-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">
                  Supported Export Formats
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {preset.formatOptions.map((fmt, idx) => (
                    <span 
                      key={idx} 
                      className="px-2 py-0.5 text-[10px] font-semibold text-gray-600 bg-gray-100 rounded border border-gray-200/60"
                    >
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button 
                variant="primary" 
                size="sm" 
                onClick={() => setActivePreset(preset)}
                className="cursor-pointer"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                Generate & Preview
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Report Preview Modal */}
      {activePreset && (
        <div className="fixed inset-0 z-50 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Live Report Preview</span>
                <h3 className="text-lg font-bold text-gray-900 mt-0.5">{activePreset.title}</h3>
              </div>
              <button 
                onClick={() => setActivePreset(null)} 
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Document Preview Sheet */}
            <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-5 text-xs text-gray-700 font-sans">
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <div>
                  <span className="font-bold text-sm text-gray-900 block">ResearchHub Institutional Report</span>
                  <span className="text-[10px] text-gray-400">Generated on: 2026-03-15</span>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold text-green-700 bg-green-50 border border-green-200 rounded">
                  VERIFIED AUDIT DATA
                </span>
              </div>

              {/* Sample Data Table */}
              <div className="space-y-2">
                <span className="font-bold text-gray-800 uppercase tracking-wider text-[10px] block">
                  Report Executive Summary
                </span>
                <table className="w-full text-left border border-gray-200 rounded-lg overflow-hidden bg-white text-xs">
                  <thead className="bg-gray-100 text-gray-600 font-bold">
                    <tr>
                      <th className="p-2.5">Indicator Metric</th>
                      <th className="p-2.5 text-right">AY 2024-25</th>
                      <th className="p-2.5 text-right">AY 2025-26</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 font-medium">
                    <tr>
                      <td className="p-2.5">Total Journal Publications (Scopus / WoS)</td>
                      <td className="p-2.5 text-right font-mono">920</td>
                      <td className="p-2.5 text-right font-mono">1,013</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Conference Proceedings</td>
                      <td className="p-2.5 text-right font-mono">490</td>
                      <td className="p-2.5 text-right font-mono">553</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Patents Granted / Published</td>
                      <td className="p-2.5 text-right font-mono">75</td>
                      <td className="p-2.5 text-right font-mono">92</td>
                    </tr>
                    <tr>
                      <td className="p-2.5">Institutional h-index Score</td>
                      <td className="p-2.5 text-right font-mono">18.2</td>
                      <td className="p-2.5 text-right font-mono">19.4</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-[11px] text-gray-500 italic">
                * Note: All figures are compiled directly from verified faculty submission records in compliance with NAAC Criteria 3.4 guidelines.
              </p>
            </div>

            {/* Export Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              {downloadedFormat && (
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  Successfully downloaded {downloadedFormat}!
                </span>
              )}
              <div className="flex items-center gap-3 ml-auto">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  disabled={downloading}
                  onClick={() => handleDownload('PDF Document')}
                  className="cursor-pointer"
                >
                  <Download className="w-4 h-4 mr-1.5" />
                  {downloading ? 'Exporting...' : 'Export as PDF'}
                </Button>

                <Button 
                  variant="primary" 
                  size="sm" 
                  disabled={downloading}
                  onClick={() => handleDownload('CSV Sheet')}
                  className="cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 mr-1.5" />
                  {downloading ? 'Exporting...' : 'Export CSV Data'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;

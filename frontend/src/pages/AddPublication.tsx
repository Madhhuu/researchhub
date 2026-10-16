import React, { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  FileCheck,
  FileText,
  Newspaper,
  Award,
  BookOpen,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usePublications } from '../context/PublicationContext';
import Button from '../components/common/Button';

type OutputType = 'Conference' | 'Journal' | 'Patent' | 'Book Chapter';

const AddPublication: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addPublication } = usePublications();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [type, setType] = useState<OutputType>('Journal');
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('CSE');
  const [facultyName, setFacultyName] = useState(user?.name || 'Dr. Karthika');
  const [journalOrConference, setJournalOrConference] = useState('');
  const [year, setYear] = useState(2026);
  const [doi, setDoi] = useState('');
  const [publisher, setPublisher] = useState('');
  const [abstract, setAbstract] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [fileObj, setFileObj] = useState<File | undefined>(undefined);

  // Validation & Loading
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const categoryOptions = [
    {
      id: 'Journal' as OutputType,
      title: 'Journal Article',
      description: 'Peer-reviewed research article published in an academic journal.',
      icon: Newspaper,
    },
    {
      id: 'Conference' as OutputType,
      title: 'Research / Conference Paper',
      description: 'Paper presented and published in conference proceedings.',
      icon: FileText,
    },
    {
      id: 'Patent' as OutputType,
      title: 'Patent',
      description: 'Filed or granted patent application / invention specification.',
      icon: Award,
    },
    {
      id: 'Book Chapter' as OutputType,
      title: 'Book Chapter',
      description: 'Authored chapter in an edited academic book or volume.',
      icon: BookOpen,
    },
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFileObj(selectedFile);
      setFileName(selectedFile.name);
      const sizeMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      setFileSize(`${sizeMB} MB`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError(`Please enter the ${getLabelForType('title').toLowerCase()}.`);
      return;
    }
    if (!facultyName.trim()) {
      setError('Please specify the faculty author name.');
      return;
    }
    if (!journalOrConference.trim()) {
      setError(`Please enter the ${getLabelForType('venue').toLowerCase()}.`);
      return;
    }

    await addPublication({
      title,
      type,
      department,
      facultyName,
      journalOrConference,
      year: Number(year),
      doi,
      publisher: publisher || (type === 'Patent' ? 'Intellectual Property Office' : 'Academic Press'),
      abstract,
      fileUrl: fileName || (type === 'Patent' ? 'patent_specification.pdf' : 'submitted_paper.pdf')
    }, fileObj);

    setSubmitted(true);
    setTimeout(() => {
      navigate('/my-publications');
    }, 1200);
  };

  // Helper labels & placeholders based on selected type
  const getLabelForType = (field: 'title' | 'venue' | 'doi' | 'publisher' | 'upload') => {
    switch (type) {
      case 'Patent':
        if (field === 'title') return 'Patent Title / Invention Name';
        if (field === 'venue') return 'Patent Office / Issuing Authority';
        if (field === 'doi') return 'Patent Application / Grant Number (e.g. IN202541092831A)';
        if (field === 'publisher') return 'Assignee / Applicant Organization';
        if (field === 'upload') return 'Upload Patent Specification PDF / Official Grant Document';
        break;
      case 'Journal':
        if (field === 'title') return 'Journal Article Title';
        if (field === 'venue') return 'Journal Name';
        if (field === 'doi') return 'Digital Object Identifier (DOI)';
        if (field === 'publisher') return 'Publisher (e.g. IEEE, Springer, Elsevier)';
        if (field === 'upload') return 'Upload Journal Article Full PDF';
        break;
      case 'Conference':
        if (field === 'title') return 'Research Paper Title';
        if (field === 'venue') return 'Conference Name & Proceedings';
        if (field === 'doi') return 'DOI / Proceedings Link';
        if (field === 'publisher') return 'Sponsoring Society / Publisher (e.g. ACM, IEEE)';
        if (field === 'upload') return 'Upload Conference Paper PDF';
        break;
      case 'Book Chapter':
        if (field === 'title') return 'Chapter Title';
        if (field === 'venue') return 'Book Title & Volume';
        if (field === 'doi') return 'ISBN / DOI';
        if (field === 'publisher') return 'Book Publisher (e.g. Springer, CRC Press)';
        if (field === 'upload') return 'Upload Book Chapter PDF';
        break;
    }
    return '';
  };

  const getPlaceholderForVenue = () => {
    switch (type) {
      case 'Patent':
        return 'e.g. Indian Patent Office (IPO), USPTO, EPO';
      case 'Journal':
        return 'e.g. IEEE Transactions on Medical Imaging, Nature';
      case 'Conference':
        return 'e.g. ACM/IEEE IPSN International Conference 2026';
      case 'Book Chapter':
        return 'e.g. Handbook of Educational Technology Innovations';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50/30 min-h-full font-sans max-w-4xl mx-auto">
      {/* Top Navigation Back */}
      <div>
        <Link 
          to="/my-publications" 
          className="inline-flex items-center text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" />
          Back to My Uploads
        </Link>
      </div>

      <div className="bg-white border border-gray-200/80 rounded-xl p-6 shadow-2xs space-y-6">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">Faculty Workspace</span>
          <h1 className="text-xl font-bold text-gray-900 mt-0.5">Upload New Research</h1>
          <p className="text-xs text-gray-500 mt-1">
            First choose whether you are uploading a Research Paper, Journal Article, Patent, or Book Chapter.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-green-50 border border-green-200 rounded-xl text-center space-y-3">
            <CheckCircle className="w-10 h-10 text-green-600 mx-auto animate-bounce" />
            <h3 className="text-base font-bold text-green-900">Upload Submitted Successfully!</h3>
            <p className="text-xs text-green-700">
              Your research output has been logged and sent to the Research Administrator verification queue.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-lg text-xs font-medium text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: Select What You Are Uploading */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                1. Select Output Type (Paper / Journal / Patent / Book)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {categoryOptions.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = type === cat.id;
                  return (
                    <div
                      key={cat.id}
                      onClick={() => setType(cat.id)}
                      className={`
                        relative p-4 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3.5
                        ${isSelected 
                          ? 'border-blue-600 bg-blue-50/50 shadow-2xs' 
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/50'
                        }
                      `}
                    >
                      <div className={`p-2.5 rounded-lg flex-shrink-0 ${isSelected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className={`text-xs font-bold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>{cat.title}</h4>
                          {isSelected && (
                            <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">{cat.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Basic Metadata */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                2. {type} Details & Metadata
              </h3>

              {/* Title */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {getLabelForType('title')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`Enter ${getLabelForType('title').toLowerCase()}...`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Grid 2 cols */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Faculty Author */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Faculty Author <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    placeholder="e.g. Dr. Karthika"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Department */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 cursor-pointer"
                  >
                    <option value="CSE">CSE (Computer Science)</option>
                    <option value="ECE">ECE (Electronics & Comm)</option>
                    <option value="EEE">EEE (Electrical & Electronics)</option>
                    <option value="IT">IT (Information Tech)</option>
                    <option value="Mechanical">Mechanical Engg</option>
                    <option value="Civil">Civil Engg</option>
                  </select>
                </div>
              </div>
            </div>

            {/* STEP 3: Venue & Identifiers */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                3. Venue, Publisher & Identifiers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Venue / Journal / Patent Office */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {getLabelForType('venue')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={journalOrConference}
                    onChange={(e) => setJournalOrConference(e.target.value)}
                    placeholder={getPlaceholderForVenue()}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>

                {/* Publication / Filing Year */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {type === 'Patent' ? 'Filing / Grant Year' : 'Publication Year'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min={2015}
                    max={2027}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* DOI / Patent Number */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {getLabelForType('doi')}
                  </label>
                  <input
                    type="text"
                    value={doi}
                    onChange={(e) => setDoi(e.target.value)}
                    placeholder={type === 'Patent' ? 'e.g. IN202541092831A' : 'e.g. 10.1109/TMI.2026.3104928'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all font-mono"
                  />
                </div>

                {/* Publisher / Assignee */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {getLabelForType('publisher')}
                  </label>
                  <input
                    type="text"
                    value={publisher}
                    onChange={(e) => setPublisher(e.target.value)}
                    placeholder={type === 'Patent' ? 'e.g. Intellectual Property India / University' : 'e.g. IEEE, Springer, Elsevier'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>

            {/* STEP 4: Abstract & File Upload */}
            <div className="space-y-4 pt-4 border-t border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                4. Abstract & Verification File
              </h3>

              {/* Abstract */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {type === 'Patent' ? 'Patent Abstract / Claims Summary' : 'Abstract'}
                </label>
                <textarea
                  rows={4}
                  value={abstract}
                  onChange={(e) => setAbstract(e.target.value)}
                  placeholder={`Enter summary or abstract for this ${type.toLowerCase()}...`}
                  className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3.5 text-xs text-gray-900 outline-none focus:border-blue-500 focus:bg-white transition-all"
                />
              </div>

              {/* Upload Box */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {getLabelForType('upload')}
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-blue-50/20 hover:border-blue-300 transition-colors cursor-pointer bg-gray-50/50"
                >
                  {fileName ? (
                    <div className="flex items-center justify-center gap-2 text-green-600 font-semibold text-xs">
                      <FileCheck className="w-6 h-6 text-green-500" />
                      <span>{fileName} {fileSize ? `(${fileSize})` : ''}</span>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                      <p className="text-xs font-semibold text-gray-700">
                        {getLabelForType('upload')}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Supports PDF, DOCX up to 15MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Action Buttons */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Link to="/my-publications">
                <Button type="button" variant="secondary" size="md">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" variant="primary" size="md" className="cursor-pointer">
                <Plus className="w-4 h-4 mr-1.5" />
                Submit {type} Claim
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddPublication;

import React, { useState, useRef } from 'react';
import {
  FileText,
  Upload,
  Link as LinkIcon,
  X,
  Check,
  Download,
  AlertCircle,
  FileCheck,
  Eye,
  Sparkles
} from 'lucide-react';

// Preset Authentic Exam & Practice Documents
export const PRESET_DOCUMENTS = [
  {
    id: 'oct-2025-ca',
    title: 'October 2025 Current Affairs MCQs Compendium',
    url: '/assets/aistudio/October_2025_Current_Affairs_MCQs_9e8d634c.pdf',
    size: '1.4 MB PDF',
    board: 'UPSC / State PSC'
  },
  {
    id: 'nov-2025-ca',
    title: 'November 2025 Current Affairs MCQs Compendium',
    url: '/assets/aistudio/November_2025_Current_Affairs_MCQs_106d2ab4.pdf',
    size: '1.8 MB PDF',
    board: 'UPSC / State PSC'
  },
  {
    id: 'dec-2025-ca',
    title: 'December 2025 Current Affairs MCQs Compendium',
    url: '/assets/aistudio/December_2025_Current_Affairs_MCQs_fea0a8ff.pdf',
    size: '1.6 MB PDF',
    board: 'UPSC / SSC / Banking'
  },
  {
    id: 'jan-2026-ca',
    title: 'January 2026 Current Affairs MCQs Compendium',
    url: '/assets/aistudio/January_2026_Current_Affairs_MCQ_31a6a736.pdf',
    size: '1.2 MB PDF',
    board: 'All India Competitive'
  },
  {
    id: 'upsc-pyq-gs1',
    title: 'UPSC Civil Services Prelims GS Paper-I Previous Paper',
    url: 'https://upsc.gov.in/sites/default/files/CSP-2024-GS-I.pdf',
    size: '2.5 MB PDF',
    board: 'UPSC'
  },
  {
    id: 'appsc-grp2-pyq',
    title: 'APPSC Group-II Services Screening & Mains Model Paper',
    url: 'https://psc.ap.gov.in',
    size: '3.1 MB PDF',
    board: 'APPSC'
  }
];

export default function DocumentFileUploader({
  value,
  onChange,
  onFileSizeChange,
  onFileNameChange,
  currentFileSize = '',
  label = 'Document / Question Paper File (PDF, DOC)'
}) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [urlInput, setUrlInput] = useState(value && !value.startsWith('data:') ? value : '');
  const [uploadStatus, setUploadStatus] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [fileName, setFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleProcessFile = (file) => {
    if (!file) return;

    setUploadError('');
    setUploadStatus('Reading file...');

    // Allowed mime types or extensions
    const isPdfOrDoc =
      file.type.includes('pdf') ||
      file.type.includes('document') ||
      file.type.includes('word') ||
      file.name.match(/\.(pdf|doc|docx|txt)$/i);

    if (!isPdfOrDoc) {
      setUploadError('Please select a valid document (PDF, DOC, DOCX, or TXT).');
      setUploadStatus('');
      return;
    }

    if (file.size > 700000) {
      setUploadError('This file is too large to store in Firestore. Host the PDF and paste the official URL instead.');
      setUploadStatus('');
      return;
    }

    const calculatedSize = `${formatBytes(file.size)} ${file.name.split('.').pop().toUpperCase()}`;
    setFileName(file.name);
    if (onFileSizeChange) onFileSizeChange(calculatedSize);
    if (onFileNameChange) onFileNameChange(file.name);

    // Read file as Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      onChange(dataUrl);
      setUploadStatus(`Document "${file.name}" uploaded successfully!`);
      setTimeout(() => setUploadStatus(''), 4000);
    };
    reader.onerror = () => {
      setUploadError('Failed to read file from local disk.');
      setUploadStatus('');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      if (onFileSizeChange && !currentFileSize) onFileSizeChange('Web PDF');
      setUploadStatus('Document URL connected!');
      setTimeout(() => setUploadStatus(''), 3000);
    }
  };

  const handleRemoveDocument = () => {
    onChange('');
    setUrlInput('');
    setFileName('');
    if (onFileSizeChange) onFileSizeChange('');
    if (onFileNameChange) onFileNameChange('');
    setUploadStatus('');
    setUploadError('');
  };

  const handleSelectPreset = (preset) => {
    onChange(preset.url);
    setUrlInput(preset.url);
    setFileName(preset.title);
    if (onFileSizeChange) onFileSizeChange(preset.size);
    if (onFileNameChange) onFileNameChange(preset.title);
    setUploadStatus(`Attached pre-bundled official paper: ${preset.title}`);
    setTimeout(() => setUploadStatus(''), 3000);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700 text-xs">
          {label} *
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemoveDocument}
            className="text-[11px] text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3 h-3" />
            <span>Remove Document</span>
          </button>
        )}
      </div>

      {/* Document Attached Preview Card */}
      {value ? (
        <div className="p-3.5 rounded-2xl border-2 border-emerald-200 bg-emerald-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div className="text-xs space-y-0.5">
              <div className="font-bold text-[#182B45] flex items-center gap-2">
                <span className="truncate max-w-xs">{fileName || 'Document Attached'}</span>
                <span className="px-2 py-0.2 rounded bg-emerald-100 text-emerald-800 text-[10px] font-semibold">
                  {currentFileSize || 'Ready'}
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-sm">
                {value.startsWith('data:') ? 'Stored document file (Base64 data URL ready for instant download)' : value}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              download={fileName ? fileName : 'exam_document.pdf'}
              className="px-3 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xs"
            >
              <Download className="w-3 h-3" />
              <span>Test Download</span>
            </a>
            <button
              type="button"
              onClick={handleRemoveDocument}
              className="p-1.5 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-red-600 hover:bg-red-50"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-1">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'upload'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload Document File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'presets'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F2BE4F]" />
          <span>Exam Paper Presets</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('url')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeTab === 'url'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>External Link / Drive URL</span>
        </button>
      </div>

      {/* Tab 1: Direct File Upload */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                handleProcessFile(e.target.files[0]);
              }
            }}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-[#2468B4] bg-blue-50/70 ring-4 ring-[#2468B4]/20'
                : 'border-slate-300 hover:border-[#2468B4] bg-[#F6F8FC] hover:bg-blue-50/30'
            }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#2468B4] flex items-center justify-center mx-auto mb-2 shadow-xs">
              <Upload className="w-6 h-6" />
            </div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-[#182B45]">
              Click to browse or Drag & Drop document here
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
              Supports official question papers, model test keys, syllabus guides (PDF, DOC, DOCX up to 25MB).
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Pre-bundled Presets */}
      {activeTab === 'presets' && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-500">
            Select one of the pre-bundled official current affairs question paper compendiums:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {PRESET_DOCUMENTS.map((doc) => (
              <button
                key={doc.id}
                type="button"
                onClick={() => handleSelectPreset(doc)}
                className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all cursor-pointer ${
                  value === doc.url
                    ? 'border-[#2468B4] bg-blue-50/70 ring-2 ring-[#2468B4]/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  PDF
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-xs text-[#182B45] line-clamp-1">
                    {doc.title}
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span className="text-[#2468B4]">{doc.board}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: External URL */}
      {activeTab === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://upsc.gov.in/papers/exam.pdf or Google Drive link"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 p-2 bg-[#F6F8FC] border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-[#12345A] text-white rounded-xl text-xs font-bold hover:bg-[#0B1F3A]"
            >
              Connect URL
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Paste any link from UPSC, APPSC, SSC, Google Drive, or official cloud repository.
          </p>
        </div>
      )}

      {uploadStatus && (
        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadStatus}</span>
        </div>
      )}

      {uploadError && (
        <div className="p-2 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-medium">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}
    </div>
  );
}

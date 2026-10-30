import React, { useState, useEffect, useRef } from 'react';
import {
  Image as ImageIcon,
  Clipboard,
  Upload,
  Link as LinkIcon,
  X,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';

// Curated high quality exam editorial presets for quick selection
export const EXAM_IMAGE_PRESETS = [
  {
    id: 'navy',
    label: 'Navy & Defence',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'agriculture',
    label: 'Agriculture & Rural',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cabinet',
    label: 'Cabinet & Governance',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'space',
    label: 'Space & ISRO',
    url: 'https://images.unsplash.com/photo-1517976487502-d216f9f6e632?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'economy',
    label: 'Economy & Banking',
    url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'technology',
    label: 'Technology & AI',
    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'environment',
    label: 'Environment & Climate',
    url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'coastal',
    label: 'Coastal & Marine',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  }
];

export default function ImagePasteUploader({ value, onChange, label = 'Current Affair Image' }) {
  const [activeMode, setActiveMode] = useState('paste'); // 'paste' | 'url' | 'upload' | 'presets'
  const [urlInput, setUrlInput] = useState('');
  const [pasteStatus, setPasteStatus] = useState('');
  const [pasteError, setPasteError] = useState('');
  const pasteAreaRef = useRef(null);
  const fileInputRef = useRef(null);

  // Synchronize urlInput when value changes
  useEffect(() => {
    if (value && typeof value === 'string' && value.startsWith('http')) {
      setUrlInput(value);
    }
  }, [value]);

  // Convert File / Blob to a compressed JPEG data URL (Firestore 1 MB doc limit)
  const processImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) {
      setPasteError('Pasted item is not a recognized image.');
      return;
    }
    setPasteError('');
    setPasteStatus('Compressing image...');

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1200;
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        let quality = 0.72;
        let dataUrl = canvas.toDataURL('image/jpeg', quality);
        while (dataUrl.length > 700000 && quality > 0.4) {
          quality -= 0.1;
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }
        if (dataUrl.length > 700000) {
          setPasteError('Image is still too large. Use an image URL instead.');
          setPasteStatus('');
          return;
        }
        onChange(dataUrl);
        setPasteStatus('Image loaded from clipboard!');
        setTimeout(() => setPasteStatus(''), 3000);
      };
      img.onerror = () => {
        setPasteError('Failed to process image.');
        setPasteStatus('');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      setPasteError('Failed to read image file.');
      setPasteStatus('');
    };
    reader.readAsDataURL(file);
  };

  // Handle Ctrl+V / Cmd+V paste event
  const handlePasteEvent = (e) => {
    const clipboardData = e.clipboardData;
    if (!clipboardData) return;

    // Check items for image file
    const items = clipboardData.items;
    let foundImage = false;

    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            e.preventDefault();
            foundImage = true;
            processImageFile(blob);
            break;
          }
        }
      }
    }

    // If no direct image file, check for pasted image URL text
    if (!foundImage) {
      const text = clipboardData.getData('text');
      if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
        if (text.match(/\.(jpeg|jpg|gif|png|webp|svg)(\?.*)?$/i) || text.startsWith('data:image/')) {
          e.preventDefault();
          onChange(text);
          setUrlInput(text);
          setPasteStatus('Image URL pasted successfully!');
          setTimeout(() => setPasteStatus(''), 3000);
        }
      }
    }
  };

  // Handle direct "Paste from Clipboard" button click using Async Clipboard API
  const handleClipboardButtonClick = async () => {
    setPasteError('');
    setPasteStatus('Accessing clipboard...');

    try {
      if (navigator.clipboard && navigator.clipboard.read) {
        const clipboardItems = await navigator.clipboard.read();
        let found = false;

        for (const item of clipboardItems) {
          const imageType = item.types.find(type => type.startsWith('image/'));
          if (imageType) {
            const blob = await item.getType(imageType);
            processImageFile(blob);
            found = true;
            break;
          }
        }

        if (!found) {
          // Fallback to text reading if no binary image
          const text = await navigator.clipboard.readText();
          if (text && (text.startsWith('http://') || text.startsWith('https://') || text.startsWith('data:image/'))) {
            onChange(text);
            setUrlInput(text);
            setPasteStatus('Image URL pasted from clipboard!');
            setTimeout(() => setPasteStatus(''), 3000);
          } else {
            setPasteError('No image found in clipboard. Please copy an image (or image address) first.');
            setPasteStatus('');
          }
        }
      } else {
        // Fallback instructions
        setPasteStatus('Click the box below and press Ctrl+V (or ⌘+V) to paste');
      }
    } catch (err) {
      console.warn('Clipboard read error:', err);
      setPasteError('Clipboard access denied or unsupported. Click the box below and press Ctrl+V to paste directly.');
      setPasteStatus('');
    }
  };

  // Handle File Input selection
  const handleFileInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyUrl = (e) => {
    e.preventDefault();
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setPasteStatus('Image URL set!');
      setTimeout(() => setPasteStatus(''), 2500);
    }
  };

  const handleRemoveImage = () => {
    onChange('');
    setUrlInput('');
    setPasteStatus('');
    setPasteError('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block font-semibold text-slate-700 text-xs">
          {label}
        </label>
        {value && (
          <button
            type="button"
            onClick={handleRemoveImage}
            className="text-[11px] text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 font-semibold"
          >
            <X className="w-3 h-3" />
            <span>Remove Image</span>
          </button>
        )}
      </div>

      {/* Preview Card if image is selected */}
      {value ? (
        <div className="relative rounded-2xl border-2 border-slate-200 overflow-hidden bg-slate-50 p-2 flex flex-col sm:flex-row items-center gap-3">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-slate-200 shrink-0 border border-slate-300 relative group">
            <img
              src={value}
              alt="Current Affair Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = EXAM_IMAGE_PRESETS[0].url;
              }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] text-white font-bold bg-black/60 px-2 py-1 rounded">Active</span>
            </div>
          </div>

          <div className="flex-1 text-xs space-y-1.5 w-full">
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Image Attached</span>
            </div>
            <p className="text-[11px] text-slate-500 line-clamp-2 break-all">
              {value.startsWith('data:image') ? 'Pasted/Uploaded Image (Stored Base64)' : value}
            </p>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setActiveMode('paste');
                  if (pasteAreaRef.current) pasteAreaRef.current.focus();
                }}
                className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg text-slate-700 font-semibold text-[11px] flex items-center gap-1"
              >
                <Clipboard className="w-3 h-3 text-[#12345A]" />
                <span>Paste Another</span>
              </button>
              <button
                type="button"
                onClick={handleRemoveImage}
                className="px-2.5 py-1 bg-red-50 border border-red-200 hover:bg-red-100 rounded-lg text-red-700 font-semibold text-[11px] flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Mode Switcher Tabs */}
      <div className="flex items-center gap-1 border-b border-slate-200 pb-1">
        <button
          type="button"
          onClick={() => setActiveMode('paste')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeMode === 'paste'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clipboard className="w-3.5 h-3.5" />
          <span>Copy-Paste Image</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('url')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeMode === 'url'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <LinkIcon className="w-3.5 h-3.5" />
          <span>Image URL</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('upload')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeMode === 'upload'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload File</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveMode('presets')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors ${
            activeMode === 'presets'
              ? 'bg-[#12345A] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F2BE4F]" />
          <span>Presets</span>
        </button>
      </div>

      {/* Tab 1: Paste Mode */}
      {activeMode === 'paste' && (
        <div className="space-y-2">
          <div
            ref={pasteAreaRef}
            tabIndex={0}
            onPaste={handlePasteEvent}
            className="border-2 border-dashed border-[#2468B4]/40 hover:border-[#2468B4] bg-[#F6F8FC] hover:bg-blue-50/40 rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all focus:outline-hidden focus:ring-2 focus:ring-[#2468B4] focus:bg-blue-50/60"
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 text-[#2468B4] flex items-center justify-center mx-auto mb-2">
              <Clipboard className="w-5 h-5" />
            </div>
            <h4 className="font-heading font-bold text-xs sm:text-sm text-[#182B45]">
              Copy Any Image and Paste Here (Ctrl+V or ⌘+V)
            </h4>
            <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-1">
              Copy an image from your browser, snipping tool, screenshot, or another tab, click here and press Paste.
            </p>

            <div className="pt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={handleClipboardButtonClick}
                className="px-3.5 py-1.5 rounded-xl bg-[#12345A] hover:bg-[#0B1F3A] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
              >
                <Clipboard className="w-3.5 h-3.5" />
                <span>Paste from Clipboard Button</span>
              </button>
            </div>
          </div>

          {pasteStatus && (
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5 font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{pasteStatus}</span>
            </div>
          )}

          {pasteError && (
            <div className="p-2 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-1.5 font-medium">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{pasteError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: URL Mode */}
      {activeMode === 'url' && (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="flex-1 p-2 bg-[#F6F8FC] border border-slate-300 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#2468B4]"
            />
            <button
              type="button"
              onClick={handleApplyUrl}
              className="px-4 py-2 bg-[#12345A] text-white rounded-xl text-xs font-bold hover:bg-[#0B1F3A]"
            >
              Apply
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Paste any direct image URL from PIB, Wikimedia, or Unsplash.
          </p>
        </div>
      )}

      {/* Tab 3: Upload Mode */}
      {activeMode === 'upload' && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-slate-400 bg-slate-50 hover:bg-slate-100/70 rounded-2xl p-4 text-center cursor-pointer transition-colors"
          >
            <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1" />
            <span className="font-bold text-xs text-slate-700 block">
              Click to browse an image file
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              PNG, JPG, WebP supported
            </span>
          </div>
        </div>
      )}

      {/* Tab 4: Presets Mode */}
      {activeMode === 'presets' && (
        <div className="space-y-2">
          <p className="text-[11px] text-slate-500">
            Select an exam-targeted editorial photo:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {EXAM_IMAGE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setUrlInput(preset.url);
                }}
                className={`p-1.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                  value === preset.url
                    ? 'border-[#2468B4] bg-blue-50/70 ring-2 ring-[#2468B4]/30'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-8 h-8 rounded-lg object-cover shrink-0"
                />
                <span className="text-[10px] font-bold text-slate-700 truncate">
                  {preset.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

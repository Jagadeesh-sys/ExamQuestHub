import React, { useState } from 'react';
import { Database, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';
import { isFirebaseConfigured } from '../firebase/config.js';

export default function FirebaseBanner({ forceShow = false }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  // If Firebase is configured and forceShow is false, don't show
  if (isFirebaseConfigured && !forceShow) {
    return null;
  }

  const sampleEnv = `VITE_FIREBASE_API_KEY="AIzaSyBpzxeB87P4A0PC4K8rhj-KJZU70WSvSMw"
VITE_FIREBASE_AUTH_DOMAIN="examquesthub.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="examquesthub"
VITE_FIREBASE_STORAGE_BUCKET="examquesthub.firebasestorage.app"
VITE_FIREBASE_MESSAGING_SENDER_ID="991312604879"
VITE_FIREBASE_APP_ID="1:991312604879:web:f26ff50aa0f9c13ee091ba"
VITE_FIREBASE_MEASUREMENT_ID="G-X70K1F3PS4"`;

  const copyEnv = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 my-4 text-xs text-amber-900 shadow-xs">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-950 text-xs">
                {isFirebaseConfigured ? 'Firebase Live Connected' : 'Demonstration Storage Mode'}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                isFirebaseConfigured ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-200/70 text-amber-900'
              }`}>
                {isFirebaseConfigured ? 'Active Cloud Firestore' : 'Local Persistence & Demo Records'}
              </span>
            </div>
            <p className="text-[11px] text-amber-800 mt-0.5">
              {isFirebaseConfigured
                ? 'All exam updates and editorial changes are streaming directly to Google Cloud Firestore.'
                : 'Showing verified demonstration exam updates. You can manage, publish, and test all features locally, or wire your Firebase project keys.'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-amber-900 font-semibold hover:bg-amber-100/50 transition-colors"
        >
          <span>{expanded ? 'Hide Config Guide' : 'Connect Your Firebase'}</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-amber-200/60 space-y-3">
          <p className="text-slate-700 leading-relaxed">
            To connect your live Firebase project, add the following variables into your project environment (e.g. <code className="bg-white px-1 py-0.5 rounded border border-amber-300">.env</code> or Vercel Environment Variables):
          </p>

          <div className="relative bg-slate-900 text-slate-100 p-3 rounded-xl font-mono text-[11px] overflow-x-auto">
            <button
              type="button"
              onClick={copyEnv}
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Template'}</span>
            </button>
            <pre className="pr-20">{sampleEnv}</pre>
          </div>

          <p className="text-[11px] text-amber-800">
            Once saved, restart the Vite dev server or redeploy. The app will automatically switch from local demo records to live Firestore queries and Authentication!
          </p>
        </div>
      )}
    </div>
  );
}

import React from 'react';

export default function SkeletonLoader({ count = 3, type = 'card' }) {
  const items = Array.from({ length: count });

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-[#E3EAF2] p-5 space-y-4 animate-pulse"
          >
            <div className="flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-5 bg-slate-200 rounded-full w-20" />
            </div>
            <div className="h-6 bg-slate-200 rounded w-4/5" />
            <div className="h-4 bg-slate-100 rounded w-2/3" />
            <div className="flex gap-2">
              <div className="h-5 bg-slate-100 rounded w-16" />
              <div className="h-5 bg-slate-100 rounded w-20" />
            </div>
            <div className="pt-3 border-t border-slate-100 flex justify-between">
              <div className="h-4 bg-slate-100 rounded w-24" />
              <div className="h-8 bg-slate-200 rounded-lg w-20" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((_, i) => (
        <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

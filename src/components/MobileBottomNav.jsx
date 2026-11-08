import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  GraduationCap,
  BookOpen,
  Briefcase,
  Sparkles
} from 'lucide-react';

export default function MobileBottomNav() {
  const navItems = [
    { to: '/', label: 'Home', icon: Home, end: true },
    { to: '/mocks', label: 'Mock Tests', icon: GraduationCap },
    { to: '/current-affairs', label: 'CA & GK', icon: BookOpen },
    { to: '/jobs', label: 'Latest Jobs', icon: Briefcase },
    { to: '/gk-practice', label: 'Practice', icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Mobile Bottom App Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAF2] px-2 pt-1 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-1 px-1 min-w-[56px] min-h-[48px] transition-all select-none tap-highlight-transparent active:scale-95 ${
                  isActive ? 'text-[#12345A]' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'w-14 bg-[#12345A] text-white shadow-xs'
                        : 'w-10 text-slate-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] tracking-tight leading-tight mt-1 whitespace-nowrap transition-colors ${
                      isActive ? 'font-black text-[#12345A]' : 'font-semibold text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-3.5 h-1 bg-[#F2BE4F] rounded-full mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

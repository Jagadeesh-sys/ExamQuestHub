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
    { to: '/jobs', label: 'Jobs', icon: Briefcase },
    { to: '/gk-practice', label: 'Practice', icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Mobile Bottom App Navigation"
      className="lg:hidden fixed left-3 right-3 bottom-[max(10px,env(safe-area-inset-bottom))] z-[70] pointer-events-none"
    >
      <div className="pointer-events-auto max-w-md mx-auto bg-white/95 backdrop-blur-md border border-[#DCE5F0] rounded-[24px] px-2 py-1.5 shadow-[0_10px_28px_rgba(11,31,58,0.16)] flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center py-0.5 px-1 min-w-[54px] min-h-[44px] transition-all select-none tap-highlight-transparent active:scale-95 ${
                  isActive ? 'text-[#12345A]' : 'text-slate-500 hover:text-slate-800'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
                      isActive
                        ? 'w-[50px] bg-[#12345A] text-white shadow-xs'
                        : 'w-9 text-slate-500'
                    }`}
                  >
                    <Icon className="w-[18px] h-[18px]" />
                  </div>
                  <span
                    className={`text-[9.5px] tracking-tight leading-tight mt-0.5 whitespace-nowrap transition-colors ${
                      isActive ? 'font-black text-[#12345A]' : 'font-semibold text-slate-600'
                    }`}
                  >
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-3.5 h-[2.5px] bg-[#F2BE4F] rounded-full mt-0.5" />
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

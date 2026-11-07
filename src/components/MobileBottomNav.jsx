import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Briefcase,
  Newspaper,
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function MobileBottomNav() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', label: t('navHome') || 'Home', icon: Home, end: true },
    { to: '/mocks', label: 'Mock Tests', icon: GraduationCap, badge: 'HOT' },
    { to: '/current-affairs', label: 'CA & GK', icon: Newspaper },
    { to: '/jobs', label: t('navJobs') || 'Jobs', icon: Briefcase },
    { to: '/gk-practice', label: 'Practice', icon: Sparkles },
  ];

  return (
    <nav
      aria-label="Mobile Bottom App Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-[110] bg-white/95 backdrop-blur-md border-t border-[#E3EAF2] px-2 pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `relative flex flex-col items-center justify-center py-1 px-2 rounded-2xl transition-all duration-200 min-w-[58px] outline-none select-none tap-highlight-transparent active:scale-95 ${
                  isActive
                    ? 'text-[#12345A] font-black'
                    : 'text-slate-500 hover:text-[#12345A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="relative">
                    <div
                      className={`w-10 h-7 rounded-xl flex items-center justify-center transition-all duration-200 ${
                        isActive
                          ? 'bg-[#12345A] text-[#F2BE4F] shadow-sm ring-2 ring-[#12345A]/10 scale-105'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {item.badge && !isActive && (
                      <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-rose-500 text-white text-[7.5px] font-black rounded-full leading-tight shadow-2xs">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <span
                    className={`text-[10px] tracking-tight leading-tight mt-1 truncate max-w-[62px] transition-colors ${
                      isActive ? 'text-[#12345A] font-extrabold' : 'text-slate-600 font-medium'
                    }`}
                  >
                    {item.label}
                  </span>

                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F2BE4F] mt-0.5 shadow-2xs animate-in zoom-in-50 duration-150" />
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

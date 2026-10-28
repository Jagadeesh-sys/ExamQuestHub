import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Briefcase,
  FileCheck2,
  Award,
  GraduationCap
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.jsx';

export default function MobileBottomNav() {
  const { t } = useLanguage();

  const navItems = [
    { to: '/', label: t('navHome'), icon: Home, end: true },
    { to: '/jobs', label: t('navJobs'), icon: Briefcase },
    { to: '/mocks', label: 'Mock Tests', icon: GraduationCap },
    { to: '/admit-cards', label: t('navAdmitCards'), icon: FileCheck2 },
    { to: '/results', label: t('navResults'), icon: Award },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E3EAF2] px-2 py-1.5 shadow-lg safe-area-pb"
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
                `flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-150 min-w-[56px] ${
                  isActive
                    ? 'text-[#12345A] font-bold'
                    : 'text-slate-500 hover:text-[#12345A]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div
                    className={`w-9 h-7 rounded-xl flex items-center justify-center transition-colors ${
                      isActive ? 'bg-[#EAF3FF] text-[#12345A]' : 'text-slate-500'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-[62px]">
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

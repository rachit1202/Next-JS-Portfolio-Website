'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomSelect({ label, id, value, options = [], onChange, placeholder = 'Select an option' }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSelect = (opt) => {
    if (onChange) {
      onChange({ target: { value: opt } });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative space-y-1.5" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="block text-xs font-medium text-slate-400">
          {label}
        </label>
      )}

      {/* Button Trigger */}
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full px-4 py-3 rounded-xl text-sm text-left flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'bg-slate-900 border-purple-500 ring-2 ring-purple-500/20 text-white'
            : 'bg-white/[0.04] border border-white/10 hover:border-white/20 text-slate-200'
        }`}
      >
        <span className={value ? 'text-slate-100 font-medium truncate' : 'text-slate-500 truncate'}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 shrink-0 ml-2 ${
            isOpen ? 'rotate-180 text-cyan-400' : ''
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 right-0 z-50 mt-1.5 p-1.5 rounded-2xl bg-[#0d0e1a]/95 backdrop-blur-2xl border border-purple-500/30 shadow-2xl shadow-purple-950/40 max-h-60 overflow-y-auto space-y-1 animate-fade-in"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: 'rgba(147,51,234,0.3) transparent'
          }}
        >
          {options.map((opt, i) => {
            const isSelected = opt === value;
            return (
              <div
                key={i}
                onClick={() => handleSelect(opt)}
                className={`px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-gradient-to-r from-purple-600/30 to-indigo-600/30 text-cyan-300 border border-purple-500/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="truncate">{opt}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-2" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Option } from '../types';

interface SettingsPanelProps<T extends string | number> {
  title: string;
  options: Option<T>[];
  selectedValue: T;
  onChange: (value: T) => void;
  colorClasses: string;
  activeColorClasses: string;
}

const SettingsPanel = <T extends string | number>({ title, options, selectedValue, onChange, colorClasses, activeColorClasses }: SettingsPanelProps<T>) => {
  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3">{title}</h2>
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {options.map((option) => (
          <button
            key={String(option.value)}
            onClick={() => onChange(option.value)}
            className={`px-4 py-2 text-sm md:text-base rounded-full font-semibold shadow-md transition-all duration-200 transform hover:scale-105 ${
              selectedValue === option.value
                ? `${activeColorClasses}`
                : `${colorClasses}`
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsPanel;
import React, { useState, useRef, useEffect } from 'react';

const MultiSelect = ({ options, value, onChange, labelledBy }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option) => {
    const exists = value.some((v) => v.value === option.value);
    const newSelected = exists
      ? value.filter((v) => v.value !== option.value)
      : [...value, option];
    onChange(newSelected);
  };

  const isSelected = (option) => value.some((v) => v.value === option.value);

  const allSelected = options.length > 0 && value.length === options.length;

  const handleSelectAllToggle = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange([...options]);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative w-full max-w-xs sm:max-w-full md:max-w-full text-sm"
      ref={dropdownRef}
    >
      <div
        onClick={toggleDropdown}
        className="border border-gray-300 rounded-sm px-3 py-2 bg-white cursor-pointer flex justify-between items-center shadow-sm"
      >
        <span className="truncate w-[90%] whitespace-nowrap overflow-hidden text-ellipsis">
          {value.length === 0
            ? labelledBy
            : value.map((v) => v.label).join(', ')}
        </span>
        <span className="text-gray-500 text-xs">{isOpen ? '▲' : '▼'}</span>
      </div>

      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto z-50">
          {/* Select All Toggle */}
          <div
            onClick={handleSelectAllToggle}
            className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 cursor-pointer border-b"
          >
            <input
              type="checkbox"
              checked={allSelected}
              readOnly
              className="mr-2"
            />
            <span className="truncate">
              {allSelected ? 'Deselect All' : 'Select All'}
            </span>
          </div>

          {/* Options List */}
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => handleOptionClick(option)}
              className={`flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer ${
                isSelected(option) ? 'bg-blue-50' : ''
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected(option)}
                readOnly
                className="mr-2"
              />
              <span className="truncate">{option.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiSelect;

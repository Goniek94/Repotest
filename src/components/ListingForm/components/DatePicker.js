import React, { useState, useRef, useEffect } from 'react';

const DatePicker = ({ 
  name, 
  label, 
  value, 
  onChange, 
  required = false, 
  disabled = false, 
  placeholder = "Wybierz datę",
  minDate = null,
  maxDate = null,
  error = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(value ? new Date(value) : null);
  const calendarRef = useRef(null);
  const inputRef = useRef(null);

  // Polish month names
  const monthNames = [
    'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
    'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
  ];

  // Polish day names
  const dayNames = ['Pon', 'Wto', 'Śro', 'Czw', 'Pią', 'Sob', 'Nie'];

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update selectedDate when value prop changes
  useEffect(() => {
    if (value) {
      const date = new Date(value);
      setSelectedDate(date);
      setCurrentMonth(date);
    }
  }, [value]);

  // Format date for display
  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get days in month
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get first day of week (Monday = 0)
    let firstDayOfWeek = firstDay.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6;

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  // Check if date is disabled
  const isDateDisabled = (date) => {
    if (!date) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (minDate && date < new Date(minDate)) return true;
    if (maxDate && date > new Date(maxDate)) return true;
    
    return false;
  };

  // Check if date is selected
  const isDateSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Check if date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDate(date);
    setIsOpen(false);
    
    // Format date as YYYY-MM-DD for form submission
    const formattedDate = date.toISOString().split('T')[0];
    onChange({ target: { name, value: formattedDate } });
  };

  // Navigate months
  const navigateMonth = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  // Navigate years
  const navigateYear = (direction) => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setFullYear(prev.getFullYear() + direction);
      return newMonth;
    });
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="relative">
      <label className="block text-sm font-medium mb-2 text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          name={name}
          value={formatDate(selectedDate)}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onChange={() => {}} // Controlled by calendar
          placeholder={placeholder}
          disabled={disabled}
          readOnly
          className={`w-full h-9 text-sm px-3 pr-10 border border-gray-300 rounded-md bg-white cursor-pointer transition-all duration-200 hover:border-gray-400 focus:border-[#35530A] ${
            disabled ? 'cursor-not-allowed bg-gray-50' : ''
          }`}
        />
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      </div>

      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}

      {isOpen && !disabled && (
        <div 
          ref={calendarRef}
          className="absolute z-50 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 w-80"
        >
          {/* Calendar Header with Dropdowns */}
          <div className="flex items-center justify-center gap-4 mb-4">
            {/* Month Dropdown */}
            <div className="relative">
              <select
                value={currentMonth.getMonth()}
                onChange={(e) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setMonth(parseInt(e.target.value));
                  setCurrentMonth(newMonth);
                }}
                className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm font-medium focus:outline-none focus:border-[#35530A] cursor-pointer"
              >
                {monthNames.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Year Dropdown */}
            <div className="relative">
              <select
                value={currentMonth.getFullYear()}
                onChange={(e) => {
                  const newMonth = new Date(currentMonth);
                  newMonth.setFullYear(parseInt(e.target.value));
                  setCurrentMonth(newMonth);
                }}
                className="appearance-none bg-white border border-gray-300 rounded px-3 py-1 pr-8 text-sm font-medium focus:outline-none focus:border-[#35530A] cursor-pointer"
              >
                {(() => {
                  const currentYear = new Date().getFullYear();
                  const years = [];
                  for (let year = currentYear + 1; year >= 1950; year--) {
                    years.push(year);
                  }
                  return years.map(year => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ));
                })()}
              </select>
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => navigateMonth(-1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Poprzedni miesiąc"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => navigateMonth(1)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
                title="Następny miesiąc"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day Names Header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((date, index) => {
              if (!date) {
                return <div key={index} className="h-8"></div>;
              }

              const disabled = isDateDisabled(date);
              const selected = isDateSelected(date);
              const today = isToday(date);

              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  disabled={disabled}
                  className={`
                    h-8 w-8 text-sm rounded-md transition-all duration-150 flex items-center justify-center
                    ${disabled 
                      ? 'text-gray-300 cursor-not-allowed' 
                      : 'hover:bg-gray-100 cursor-pointer'
                    }
                    ${selected 
                      ? 'bg-[#35530A] text-white hover:bg-[#2D4A06]' 
                      : ''
                    }
                    ${today && !selected 
                      ? 'bg-blue-100 text-blue-600 font-semibold' 
                      : ''
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                if (!isDateDisabled(today)) {
                  handleDateSelect(today);
                }
              }}
              className="text-sm text-[#35530A] hover:text-[#2D4A06] font-medium transition-colors"
            >
              Dzisiaj
            </button>
            
            <button
              type="button"
              onClick={() => {
                setSelectedDate(null);
                setIsOpen(false);
                onChange({ target: { name, value: '' } });
              }}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Wyczyść
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;

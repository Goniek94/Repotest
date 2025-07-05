import React from "react";

/**
 * Card for a single user activity.
 * Props:
 * - icon: ReactNode (icon component)
 * - title: string
 * - description: string
 * - time: string
 * - href: string
 * - actionLabel: string
 * - onRemove: function (optional)
 * - color: string (for accent, optional)
 */
const ActivityItem = ({
  icon,
  title,
  description,
  time,
  href,
  actionLabel = "Zobacz",
  onRemove,
  color = "#35530A",
}) => (
  <div
    className="bg-white shadow-sm border border-gray-100 p-2 sm:p-3 relative hover:shadow-md transition-shadow duration-300 rounded-md"
  >
    {onRemove && (
      <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
        <button
          className="text-red-500 hover:text-red-700 bg-white rounded-full w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center shadow-sm"
          onClick={onRemove}
        >
          ×
        </button>
      </div>
    )}
    <div className="flex items-start">
      <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-full flex items-center justify-center mr-2.5 sm:mr-3 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-800 truncate text-sm sm:text-base">{title}</h4>
        </div>
        <p className="text-xs text-gray-600 mt-0.5 sm:mt-1 mb-1 sm:mb-2 truncate">{description}</p>
      </div>
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-xs text-gray-500">{time}</span>
      <a href={href} className="text-xs sm:text-sm font-medium flex items-center hover:underline" style={{ color }}>
        {actionLabel} <span className="ml-1">→</span>
      </a>
    </div>
  </div>
);

export default ActivityItem;

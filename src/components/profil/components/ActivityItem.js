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
    className="bg-white shadow-sm border border-gray-100 p-3 relative hover:shadow-md transition-shadow duration-300"
    style={{ borderRadius: "2px" }}
  >
    {onRemove && (
      <div className="absolute top-2 right-2">
        <button
          className="text-red-500 hover:text-red-700 bg-white rounded-full w-5 h-5 flex items-center justify-center shadow-sm"
          onClick={onRemove}
        >
          ×
        </button>
      </div>
    )}
    <div className="flex items-start">
      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center mr-3 shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-grow">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-gray-800 truncate">{title}</h4>
        </div>
        <p className="text-xs text-gray-600 mt-1 mb-2 truncate">{description}</p>
      </div>
    </div>
    <div className="flex justify-between mt-1">
      <span className="text-xs text-gray-500">{time}</span>
      <a href={href} className="text-sm font-medium flex items-center" style={{ color }}>
        {actionLabel} <span className="ml-1">→</span>
      </a>
    </div>
  </div>
);

export default ActivityItem;

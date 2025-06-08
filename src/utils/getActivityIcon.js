import React from 'react';
import {
  Star,
  LogIn,
  Mail,
  Heart,
  Reply,
  Bell,
  Car,
  AlertCircle
} from 'lucide-react';

const iconMap = {
  star: <Star size={16} className="text-yellow-500" />,
  'log-in': <LogIn size={16} className="text-gray-500" />,
  mail: <Mail size={16} className="text-blue-500" />,
  reply: <Reply size={16} className="text-blue-500" />,
  heart: <Heart size={16} className="text-red-500" />,
  bell: <Bell size={16} className="text-green-600" />,
  car: <Car size={16} className="text-green-600" />,
  'alert-circle': <AlertCircle size={16} className="text-amber-500" />
};

export default function getActivityIcon(name) {
  return iconMap[name] || <Bell size={16} className="text-green-600" />;
}

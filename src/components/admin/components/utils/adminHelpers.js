// utils/adminHelpers.js
export const formatDate = (date, format = 'datetime') => {
  if (!date) return '-';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '-';
  
  const options = {
    date: { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    },
    datetime: { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    },
    time: {
      hour: '2-digit',
      minute: '2-digit'
    }
  };
  
  return d.toLocaleDateString('pl-PL', options[format]);
};

export const formatCurrency = (amount, currency = 'PLN') => {
  if (!amount && amount !== 0) return '-';
  
  return new Intl.NumberFormat('pl-PL', {
    style: 'currency',
    currency: currency
  }).format(amount);
};

export const formatNumber = (num) => {
  if (!num && num !== 0) return '-';
  return new Intl.NumberFormat('pl-PL').format(num);
};

export const truncateText = (text, maxLength = 100) => {
  if (!text) return '-';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const generateSlug = (text) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9ąćęłńóśźż]/g, '-')
    .replace(/ą/g, 'a')
    .replace(/ć/g, 'c')
    .replace(/ę/g, 'e')
    .replace(/ł/g, 'l')
    .replace(/ń/g, 'n')
    .replace(/ó/g, 'o')
    .replace(/ś/g, 's')
    .replace(/ź/g, 'z')
    .replace(/ż/g, 'z')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+48\s?)?(\d{3}\s?\d{3}\s?\d{3}|\d{2}\s?\d{3}\s?\d{2}\s?\d{2})$/;
  return re.test(phone);
};

export const getStatusColor = (status) => {
  const statusColors = {
    active: 'text-green-600 bg-green-100',
    inactive: 'text-red-600 bg-red-100',
    pending: 'text-yellow-600 bg-yellow-100',
    blocked: 'text-red-600 bg-red-100',
    verified: 'text-blue-600 bg-blue-100',
    draft: 'text-gray-600 bg-gray-100',
    published: 'text-green-600 bg-green-100',
    archived: 'text-gray-600 bg-gray-100'
  };
  
  return statusColors[status] || 'text-gray-600 bg-gray-100';
};

export const getStatusLabel = (status) => {
  const statusLabels = {
    active: 'Aktywny',
    inactive: 'Nieaktywny',
    pending: 'Oczekujący',
    blocked: 'Zablokowany',
    verified: 'Zweryfikowany',
    draft: 'Szkic',
    published: 'Opublikowany',
    archived: 'Zarchiwizowany'
  };
  
  return statusLabels[status] || status;
};

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};

export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

export const downloadCSV = (data, filename = 'export.csv') => {
  const csvContent = convertToCSV(data);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};

export const convertToCSV = (data) => {
  if (!data || data.length === 0) return '';
  
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];
  
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header];
      return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
    });
    csvRows.push(values.join(','));
  });
  
  return csvRows.join('\n');
};

export const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const data = [];
  
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim()) {
      const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index];
      });
      data.push(row);
    }
  }
  
  return data;
};

export const generatePassword = (length = 12) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

export const getFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const isValidImageFile = (file) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  return allowedTypes.includes(file.type);
};

export const resizeImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob(resolve, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export const getDaysAgo = (date) => {
  const today = new Date();
  const targetDate = new Date(date);
  const diffTime = Math.abs(today - targetDate);
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Dzisiaj';
  if (diffDays === 1) return 'Wczoraj';
  if (diffDays < 7) return `${diffDays} dni temu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} tygodni temu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} miesięcy temu`;
  return `${Math.floor(diffDays / 365)} lat temu`;
};

export const createQueryString = (params) => {
  const query = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    const value = params[key];
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        value.forEach(v => query.append(key, v));
      } else {
        query.append(key, value);
      }
    }
  });
  
  return query.toString();
};

export const parseQueryString = (queryString) => {
  const params = {};
  const urlParams = new URLSearchParams(queryString);
  
  for (const [key, value] of urlParams.entries()) {
    if (params[key]) {
      if (Array.isArray(params[key])) {
        params[key].push(value);
      } else {
        params[key] = [params[key], value];
      }
    } else {
      params[key] = value;
    }
  }
  
  return params;
};

export const validateForm = (data, rules) => {
  const errors = {};
  let isValid = true;

  Object.keys(rules).forEach(field => {
    const rule = rules[field];
    const value = data[field];

    // Required validation
    if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field] = `Pole ${field} jest wymagane`;
      isValid = false;
      return;
    }

    // Skip other validations if field is empty and not required
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return;
    }

    // Min length validation
    if (rule.minLength && value.length < rule.minLength) {
      errors[field] = `Pole ${field} musi mieć co najmniej ${rule.minLength} znaków`;
      isValid = false;
    }

    // Max length validation
    if (rule.maxLength && value.length > rule.maxLength) {
      errors[field] = `Pole ${field} może mieć maksymalnie ${rule.maxLength} znaków`;
      isValid = false;
    }

    // Pattern validation
    if (rule.pattern && !rule.pattern.test(value)) {
      errors[field] = rule.patternMessage || `Pole ${field} ma nieprawidłowy format`;
      isValid = false;
    }

    // Custom validation
    if (rule.custom && !rule.custom(value)) {
      errors[field] = rule.message || `Pole ${field} jest nieprawidłowe`;
      isValid = false;
    }
  });

  return { isValid, errors };
};

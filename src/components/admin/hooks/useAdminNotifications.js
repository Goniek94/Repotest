import { useState, useCallback, useEffect, useRef } from 'react';

const useAdminNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const nextId = useRef(1);

  // Generate unique ID for notifications
  const generateId = useCallback(() => {
    return `notification_${Date.now()}_${nextId.current++}`;
  }, []);

  // Remove notification
  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  // Add notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Auto-remove after specified duration
    if (notification.duration) {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, notification.duration);
    }

    return newNotification.id;
  }, [generateId, removeNotification]);

  // Quick notification types
  const showSuccess = useCallback((message, options = {}) => {
    return addNotification({
      type: 'success',
      message,
      duration: 5000,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message, options = {}) => {
    return addNotification({
      type: 'error',
      message,
      duration: 0, // Don't auto-remove errors
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message, options = {}) => {
    return addNotification({
      type: 'warning',
      message,
      duration: 7000,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message, options = {}) => {
    return addNotification({
      type: 'info',
      message,
      duration: 5000,
      ...options
    });
  }, [addNotification]);

  // System notifications
  const showSystemAlert = useCallback((message, severity = 'medium', options = {}) => {
    return addNotification({
      type: 'system',
      message,
      severity,
      duration: 0,
      priority: 'high',
      ...options
    });
  }, [addNotification]);

  // User action notifications
  const showUserAction = useCallback((action, user, details = {}) => {
    return addNotification({
      type: 'user_action',
      action,
      user,
      details,
      message: `${user.name} ${action}`,
      duration: 10000
    });
  }, [addNotification]);

  // Mark as read
  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (notification.id === id && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  }, []);

  // Clear all notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // Clear notifications by type
  const clearByType = useCallback((type) => {
    setNotifications(prev => {
      const toRemove = prev.filter(n => n.type === type);
      const unreadToRemove = toRemove.filter(n => !n.read).length;
      
      setUnreadCount(count => Math.max(0, count - unreadToRemove));
      
      return prev.filter(n => n.type !== type);
    });
  }, []);

  // Get notifications by type
  const getByType = useCallback((type) => {
    return notifications.filter(n => n.type === type);
  }, [notifications]);

  // Get unread notifications
  const getUnread = useCallback(() => {
    return notifications.filter(n => !n.read);
  }, [notifications]);

  // Get notifications by priority
  const getByPriority = useCallback((priority) => {
    return notifications.filter(n => n.priority === priority);
  }, [notifications]);

  // Bulk operations
  const bulkMarkAsRead = useCallback((ids) => {
    setNotifications(prev => 
      prev.map(notification => {
        if (ids.includes(notification.id) && !notification.read) {
          setUnreadCount(count => Math.max(0, count - 1));
          return { ...notification, read: true };
        }
        return notification;
      })
    );
  }, []);

  const bulkRemove = useCallback((ids) => {
    setNotifications(prev => {
      const toRemove = prev.filter(n => ids.includes(n.id));
      const unreadToRemove = toRemove.filter(n => !n.read).length;
      
      setUnreadCount(count => Math.max(0, count - unreadToRemove));
      
      return prev.filter(n => !ids.includes(n.id));
    });
  }, []);

  // Persistence (localStorage)
  const saveToStorage = useCallback(() => {
    try {
      // Powiadomienia są teraz zarządzane przez backend i cookies
      // Nie przechowujemy ich w localStorage
    } catch (err) {
      console.warn('Failed to save notifications to localStorage:', err);
    }
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const saved = localStorage.getItem('admin_notifications');
      const savedUnread = localStorage.getItem('admin_notifications_unread');
      
      if (saved) {
        setNotifications(JSON.parse(saved));
      }
      if (savedUnread) {
        setUnreadCount(parseInt(savedUnread, 10) || 0);
      }
    } catch (err) {
      console.warn('Failed to load notifications from localStorage:', err);
    }
  }, []);

  // Auto-save to localStorage on changes
  useEffect(() => {
    if (notifications.length > 0) {
      saveToStorage();
    }
  }, [notifications, saveToStorage]);

  // Load from localStorage on mount
  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  // WebSocket or polling for real-time notifications
  const connectToNotifications = useCallback((wsUrl) => {
    if (!wsUrl) return;

    setLoading(true);
    
    try {
      const ws = new WebSocket(wsUrl);
      
      ws.onopen = () => {
        setLoading(false);
        setError(null);
        console.log('Connected to notification service');
      };

      ws.onmessage = (event) => {
        try {
          const notification = JSON.parse(event.data);
          addNotification(notification);
        } catch (err) {
          console.error('Failed to parse notification:', err);
        }
      };

      ws.onerror = (error) => {
        setError('WebSocket connection error');
        setLoading(false);
      };

      ws.onclose = () => {
        setLoading(false);
        // Attempt to reconnect after 5 seconds
        setTimeout(() => connectToNotifications(wsUrl), 5000);
      };

      return () => {
        ws.close();
      };
    } catch (err) {
      setError('Failed to connect to notification service');
      setLoading(false);
    }
  }, [addNotification]);

  // Get notification counts by type
  const getCounts = useCallback(() => {
    const counts = {
      total: notifications.length,
      unread: unreadCount,
      byType: {}
    };

    notifications.forEach(notification => {
      const type = notification.type;
      if (!counts.byType[type]) {
        counts.byType[type] = { total: 0, unread: 0 };
      }
      counts.byType[type].total++;
      if (!notification.read) {
        counts.byType[type].unread++;
      }
    });

    return counts;
  }, []);

  // Filter and sort notifications
  const getFilteredNotifications = useCallback((filters = {}) => {
    let filtered = [...notifications];

    // Filter by type
    if (filters.type) {
      filtered = filtered.filter(n => n.type === filters.type);
    }

    // Filter by read status
    if (filters.unreadOnly) {
      filtered = filtered.filter(n => !n.read);
    }

    // Filter by priority
    if (filters.priority) {
      filtered = filtered.filter(n => n.priority === filters.priority);
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      filtered = filtered.filter(n => {
        const date = new Date(n.timestamp);
        if (filters.dateFrom && date < new Date(filters.dateFrom)) return false;
        if (filters.dateTo && date > new Date(filters.dateTo)) return false;
        return true;
      });
    }

    // Sort
    const sortBy = filters.sortBy || 'timestamp';
    const sortOrder = filters.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'timestamp') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [notifications]);

  return {
    // State
    notifications,
    unreadCount,
    loading,
    error,
    
    // Basic operations
    addNotification,
    removeNotification,
    markAsRead,
    markAllAsRead,
    clearAll,
    clearByType,
    
    // Quick notification types
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showSystemAlert,
    showUserAction,
    
    // Getters
    getByType,
    getUnread,
    getByPriority,
    getCounts,
    getFilteredNotifications,
    
    // Bulk operations
    bulkMarkAsRead,
    bulkRemove,
    
    // Persistence
    saveToStorage,
    loadFromStorage,
    
    // Real-time
    connectToNotifications
  };
};

export default useAdminNotifications;

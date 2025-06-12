import React, { useState, useCallback, memo, useRef, useEffect } from 'react';
import { Star, Trash2, MoreVertical, Paperclip, Archive, Clock, Eye, EyeOff, Pin, Users, MessageCircle } from 'lucide-react';
import useBreakpoint from '../../../utils/responsive/useBreakpoint';

/**
 * Enhanced MessageList - Ożywiony komponent wyświetlający listę konwersacji
 * z nowoczesnymi animacjami, interakcjami i wizualnymi ulepszeniami
 */
const MessageList = memo(({ 
  messages, 
  activeConversation, 
  onSelectConversation, 
  onStar, 
  onDelete, 
  onMove 
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === 'mobile';
  
  // Stany dla interakcji
  const [openActionMenuId, setOpenActionMenuId] = useState(null);
  const [hoveredConversation, setHoveredConversation] = useState(null);
  const [draggedConversation, setDraggedConversation] = useState(null);
  const [swipeState, setSwipeState] = useState({});
  
  // Referencje do elementów
  const listRef = useRef(null);
  const touchStartRef = useRef({});

  // Sortowanie konwersacji z dodatkową logiką
  const sortedConversations = [...messages].sort((a, b) => {
    // Przypięte konwersacje na górze
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    // Nieprzeczytane konwersacje na górze
    if ((a.unreadCount > 0) !== (b.unreadCount > 0)) {
      return a.unreadCount > 0 ? -1 : 1;
    }
    // Sortowanie według daty ostatniej wiadomości
    return new Date(b.lastMessage.date) - new Date(a.lastMessage.date);
  });

  // Formatowanie daty z względnym czasem
  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInMinutes < 1) return 'teraz';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    if (diffInDays < 7) return `${diffInDays}d`;
    
    return date.toLocaleDateString('pl-PL', { 
      day: 'numeric', 
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  }, []);

  // Skracanie tekstu z inteligentnym cięciem
  const truncateText = (text, maxLength = 80) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > maxLength * 0.8 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  };

  // Generowanie kolorów avatar na podstawie nazwy użytkownika
  const getAvatarColor = useCallback((userName) => {
    if (!userName) return '#5A7834';
    const colors = [
      '#35530A', '#5A7834', '#8B5F3B', '#2C5F41', '#4A5568',
      '#744210', '#553C9A', '#1A365D', '#744210', '#9F7AEA'
    ];
    const hash = userName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  }, []);

  // Obsługa swipe na mobile
  const handleTouchStart = useCallback((e, conversationId) => {
    if (!isMobile) return;
    
    const touch = e.touches[0];
    touchStartRef.current[conversationId] = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
  }, [isMobile]);

  const handleTouchMove = useCallback((e, conversationId) => {
    if (!isMobile || !touchStartRef.current[conversationId]) return;
    
    const touch = e.touches[0];
    const startTouch = touchStartRef.current[conversationId];
    const deltaX = touch.clientX - startTouch.x;
    const deltaY = Math.abs(touch.clientY - startTouch.y);
    
    // Sprawdź czy to poziomy swipe
    if (Math.abs(deltaX) > 30 && deltaY < 30) {
      e.preventDefault();
      setSwipeState(prev => ({
        ...prev,
        [conversationId]: {
          x: Math.max(-120, Math.min(120, deltaX)),
          direction: deltaX > 0 ? 'right' : 'left'
        }
      }));
    }
  }, [isMobile]);

  const handleTouchEnd = useCallback((e, conversationId) => {
    if (!isMobile || !touchStartRef.current[conversationId]) return;
    
    const swipe = swipeState[conversationId];
    if (swipe && Math.abs(swipe.x) > 60) {
      if (swipe.direction === 'left') {
        // Swipe left - usuń lub archiwizuj
        onDelete && onDelete(conversationId);
      } else {
        // Swipe right - oznacz jako przeczytane/ważne
        onStar && onStar(conversationId);
      }
    }
    
    // Reset swipe state
    setSwipeState(prev => {
      const newState = { ...prev };
      delete newState[conversationId];
      return newState;
    });
    delete touchStartRef.current[conversationId];
  }, [isMobile, swipeState, onDelete, onStar]);

  // Obsługa drag and drop
  const handleDragStart = useCallback((e, conversationId) => {
    setDraggedConversation(conversationId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', conversationId);
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e, targetConversationId) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    
    if (draggedId !== targetConversationId) {
      // Tutaj można dodać logikę zmiany kolejności
      console.log('Przeniesiono konwersację', draggedId, 'nad', targetConversationId);
    }
    
    setDraggedConversation(null);
  }, []);

  // Obsługa akcji z animacjami
  const handleStarClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    
    // Dodaj efekt ripple
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    ripple.className = 'absolute inset-0 rounded-full bg-yellow-400 opacity-25 animate-ping';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    
    onStar && onStar(conversationId);
  }, [onStar]);

  const handleDeleteClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onDelete && onDelete(conversationId);
  }, [onDelete]);
  
  const handleArchiveClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(null);
    onMove && onMove(conversationId, 'archiwum');
  }, [onMove]);
  
  const handleActionMenuClick = useCallback((e, conversationId) => {
    e.stopPropagation();
    setOpenActionMenuId(openActionMenuId === conversationId ? null : conversationId);
  }, [openActionMenuId]);
  
  const handleOutsideClick = useCallback((e) => {
    if (openActionMenuId && !e.target.closest('.action-menu')) {
      setOpenActionMenuId(null);
    }
  }, [openActionMenuId]);
  
  // Nasłuchiwanie kliknięć poza menu
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, [handleOutsideClick]);

  // Funkcja do renderowania statusu konwersacji
  const renderConversationStatus = (conversation) => {
    const indicators = [];
    
    if (conversation.isPinned) {
      indicators.push(
        <Pin key="pin" className="w-3 h-3 text-[#35530A]" />
      );
    }
    
    if (conversation.hasAttachments) {
      indicators.push(
        <Paperclip key="attachment" className="w-3 h-3 text-gray-400" />
      );
    }
    
    if (conversation.participantCount > 2) {
      indicators.push(
        <Users key="group" className="w-3 h-3 text-blue-500" />
      );
    }
    
    return indicators.length > 0 ? (
      <div className="flex items-center gap-1 mt-1">
        {indicators}
      </div>
    ) : null;
  };

  // Funkcja do renderowania typu wiadomości
  const getMessageTypeIcon = (messageType) => {
    switch (messageType) {
      case 'image':
        return <span className="text-xs text-gray-500">📷</span>;
      case 'file':
        return <span className="text-xs text-gray-500">📎</span>;
      case 'voice':
        return <span className="text-xs text-gray-500">🎵</span>;
      default:
        return null;
    }
  };

  if (sortedConversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500 px-4 text-center py-10">
        <div className="mb-4 p-4 rounded-full bg-gray-100 animate-pulse">
          <MessageCircle className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-center font-medium text-lg">Brak wiadomości</p>
        <p className="text-sm mt-2 max-w-xs">Kiedy otrzymasz wiadomości, pojawią się tutaj</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto h-full bg-gradient-to-b from-white to-gray-50 flex-1" ref={listRef}>
      <ul className={`divide-y divide-gray-100 ${isMobile ? 'text-sm' : ''}`}>
        {sortedConversations.map((conversation, index) => {
          const isActive = activeConversation === conversation.id;
          const isHovered = hoveredConversation === conversation.id;
          const isDragged = draggedConversation === conversation.id;
          const swipe = swipeState[conversation.id];
          
          return (
            <li 
              key={conversation.id}
              className={`
                relative cursor-pointer transition-all duration-200 ease-out
                ${isDragged ? 'opacity-50 scale-95' : ''}
                ${isActive ? 'bg-gradient-to-r from-[#35530A]/10 to-[#35530A]/5 shadow-md' : ''}
                ${!isActive && conversation.unreadCount > 0 ? 'bg-gradient-to-r from-[#35530A]/5 to-transparent' : ''}
                ${!isActive && conversation.unreadCount === 0 ? 'hover:bg-gradient-to-r hover:from-gray-50 hover:to-white' : ''}
                ${isHovered ? 'shadow-lg shadow-gray-200/50' : ''}
                group
              `}
              style={{
                transform: swipe ? `translateX(${swipe.x}px)` : 'translateX(0)',
                animation: `slideInFromLeft 0.3s ease-out ${index * 0.05}s both`
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onSelectConversation && onSelectConversation(conversation.id);
              }}
              onMouseEnter={() => setHoveredConversation(conversation.id)}
              onMouseLeave={() => setHoveredConversation(null)}
              onTouchStart={(e) => handleTouchStart(e, conversation.id)}
              onTouchMove={(e) => handleTouchMove(e, conversation.id)}
              onTouchEnd={(e) => handleTouchEnd(e, conversation.id)}
              draggable={!isMobile}
              onDragStart={(e) => handleDragStart(e, conversation.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, conversation.id)}
            >
              {/* Swipe indicators na mobile */}
              {isMobile && swipe && (
                <>
                  <div className={`absolute left-0 top-0 h-full w-16 flex items-center justify-center transition-opacity duration-200 ${
                    swipe.direction === 'right' ? 'bg-yellow-400 opacity-75' : 'opacity-0'
                  }`}>
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <div className={`absolute right-0 top-0 h-full w-16 flex items-center justify-center transition-opacity duration-200 ${
                    swipe.direction === 'left' ? 'bg-red-400 opacity-75' : 'opacity-0'
                  }`}>
                    <Trash2 className="w-6 h-6 text-white" />
                  </div>
                </>
              )}
              
              <div className={`flex items-start p-4 ${isMobile ? 'space-x-3' : 'space-x-4'} relative z-10 bg-white/90 backdrop-blur-sm`}>
                {/* Avatar z efektami */}
                <div className="relative flex-shrink-0">
                  <div 
                    className={`
                      w-12 h-12 rounded-full flex items-center justify-center font-bold text-white
                      transition-all duration-300 ease-out relative overflow-hidden
                      ${isActive ? 'ring-2 ring-[#35530A] ring-offset-2 scale-110' : ''}
                      ${isHovered ? 'scale-105' : ''}
                      group-hover:shadow-lg
                    `}
                    style={{ 
                      backgroundColor: getAvatarColor(conversation.userName),
                      background: isActive 
                        ? `linear-gradient(135deg, ${getAvatarColor(conversation.userName)}, #35530A)`
                        : getAvatarColor(conversation.userName)
                    }}
                  >
                    {conversation.userName?.charAt(0).toUpperCase() || '?'}
                    
                    {/* Online status indicator */}
                    {conversation.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Unread badge na avatarze */}
                    {conversation.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-[#35530A] text-white text-xs font-bold rounded-full flex items-center justify-center px-1 animate-bounce">
                        {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Informacje o konwersacji */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <p className={`
                        text-sm font-medium truncate transition-colors duration-200
                        ${conversation.unreadCount > 0 ? 'text-[#35530A] font-bold' : 'text-gray-900'}
                        ${isActive ? 'text-[#35530A]' : ''}
                      `}>
                        {conversation.userName || 'Nieznany użytkownik'}
                      </p>
                      
                      {/* Status indicators */}
                      {conversation.isPinned && (
                        <Pin className="w-3 h-3 text-[#35530A] flex-shrink-0" />
                      )}
                      
                      {conversation.isArchived && (
                        <Archive className="w-3 h-3 text-gray-400 flex-shrink-0" />
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`
                        text-xs transition-all duration-200
                        ${conversation.unreadCount > 0 ? 'font-semibold text-[#35530A]' : 'text-gray-500'}
                        ${isHovered ? 'text-gray-700' : ''}
                      `}>
                        {formatDate(conversation.lastMessage.date)}
                      </span>
                      
                      {/* Read status */}
                      {conversation.lastMessageRead ? (
                        <Eye className="w-3 h-3 text-green-500" />
                      ) : (
                        <EyeOff className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                  </div>
                  
                  {/* Informacje o ogłoszeniu */}
                  {conversation.adInfo && (
                    <div className="flex items-center gap-2">
                      <div className="w-1 h-1 bg-blue-500 rounded-full animate-pulse"></div>
                      <p className={`
                        text-xs truncate transition-colors duration-200
                        ${conversation.unreadCount > 0 ? 'font-medium text-[#35530A]' : 'text-gray-600'}
                      `}>
                        {conversation.adInfo.headline || 
                          (conversation.adInfo.brand && conversation.adInfo.model && 
                            `${conversation.adInfo.brand} ${conversation.adInfo.model}`) || 
                          'Ogłoszenie'}
                      </p>
                    </div>
                  )}
                  
                  {/* Ostatnia wiadomość */}
                  <div className="flex items-center gap-2">
                    {getMessageTypeIcon(conversation.lastMessage.type)}
                    <p className={`
                      ${isMobile ? 'text-xs' : 'text-sm'} truncate transition-colors duration-200
                      ${conversation.unreadCount > 0 ? 'text-gray-700 font-medium' : 'text-gray-500'}
                    `}>
                      {truncateText(conversation.lastMessage.content)}
                    </p>
                  </div>
                  
                  {/* Status indicators */}
                  {renderConversationStatus(conversation)}
                </div>
              </div>

              {/* Akcje - animowane przy hover */}
              <div className={`
                absolute right-4 top-1/2 transform -translate-y-1/2 
                flex items-center gap-2 transition-all duration-300 ease-out
                ${isHovered || isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
                ${isMobile ? 'opacity-100 translate-x-0' : ''}
              `}>
                {/* Gwiazdka z efektem */}
                <button 
                  className={`
                    relative p-2 rounded-full transition-all duration-200 hover:scale-110
                    ${conversation.isStarred ? 'text-yellow-500 bg-yellow-50' : 'text-gray-400 hover:text-yellow-500 hover:bg-yellow-50'}
                  `}
                  onClick={(e) => handleStarClick(e, conversation.id)}
                  aria-label={conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
                >
                  <Star className={`w-4 h-4 transition-all duration-200 ${conversation.isStarred ? 'fill-current' : ''}`} />
                </button>
                
                {/* Menu akcji */}
                <div className="relative action-menu">
                  <button 
                    className="p-2 rounded-full text-gray-400 hover:text-[#35530A] hover:bg-[#35530A]/10 transition-all duration-200 hover:scale-110"
                    onClick={(e) => handleActionMenuClick(e, conversation.id)}
                    aria-label="Więcej opcji"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                  
                  {/* Animowane menu rozwijane */}
                  {openActionMenuId === conversation.id && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-30 py-2 border border-gray-100 animate-in slide-in-from-top-2 duration-200">
                      <button 
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                        onClick={(e) => handleArchiveClick(e, conversation.id)}
                      >
                        <Archive className="w-4 h-4 text-gray-500" />
                        Archiwizuj
                      </button>
                      
                      <button 
                        className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150"
                        onClick={(e) => handleStarClick(e, conversation.id)}
                      >
                        <Star className="w-4 h-4 text-gray-500" />
                        {conversation.isStarred ? 'Usuń z ważnych' : 'Oznacz jako ważne'}
                      </button>
                      
                      <div className="border-t border-gray-100 my-1"></div>
                      
                      <button 
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150"
                        onClick={(e) => handleDeleteClick(e, conversation.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                        Usuń konwersację
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Efekt aktywnej konwersacji - lewa krawędź */}
              {isActive && (
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-[#35530A] to-[#5A7834] rounded-r-full shadow-lg"></div>
              )}
            </li>
          );
        })}
      </ul>
      
      {/* Dodaj style CSS dla animacji */}
      <style jsx>{`
        @keyframes slideInFromLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .animate-in {
          animation-fill-mode: both;
        }
        
        .slide-in-from-top-2 {
          animation: slideInFromTop 0.2s ease-out;
        }
        
        @keyframes slideInFromTop {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
});

MessageList.displayName = 'MessageList';

export default MessageList;
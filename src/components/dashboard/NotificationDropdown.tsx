'use client';

import { useState, useRef, useEffect } from 'react';
import { useNotifications, useMarkNotificationRead } from '@/lib/hooks/use-notifications';
import { cn, formatDate } from '@/lib/utils';

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { data: notificationsData, isLoading } = useNotifications({ 
    pageSize: 5,
    pageNumber: 1 
  });
  
  const markReadMutation = useMarkNotificationRead();
  
  const notifications = notificationsData?.items || [];
  const unreadCount = notifications.filter(n => n.status === 0).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMarkRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markReadMutation.mutate(id);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface-dark-highlight text-text-main hover:bg-surface-dark transition-colors relative"
      >
        <span className="material-symbols-outlined text-[20px]">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 bg-primary rounded-full border border-surface-dark-highlight" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-surface-dark border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <h3 className="font-semibold text-text-main">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                {unreadCount} new
              </span>
            )}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {isLoading ? (
              <div className="p-8 text-center text-text-muted text-sm italic">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-text-muted text-sm italic">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={cn(
                      "p-4 hover:bg-white/5 transition-colors cursor-pointer group border-b border-white/5 last:border-0",
                      notification.status === 0 ? "bg-primary/5" : ""
                    )}
                    onClick={() => notification.status === 0 && markReadMutation.mutate(notification.id)}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "mt-1 w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                        notification.type === 1 ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-500"
                      )}>
                        <span className="material-symbols-outlined text-[18px]">
                          {notification.type === 1 ? "error" : "warning"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            notification.status === 0 ? "text-text-main" : "text-text-muted"
                          )}>
                            {notification.title}
                          </p>
                          {notification.status === 0 && (
                            <button 
                              onClick={(e) => handleMarkRead(notification.id, e)}
                              className="opacity-0 group-hover:opacity-100 text-[10px] text-primary hover:underline transition-opacity whitespace-nowrap"
                            >
                              Mark as read
                            </button>
                          )}
                        </div>
                        <p className="text-xs text-text-muted line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-[10px] text-text-muted/60">
                          {formatDate(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-white/10 bg-surface-dark-highlight/50 text-center">
            <button className="text-xs text-text-muted hover:text-text-main transition-colors">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

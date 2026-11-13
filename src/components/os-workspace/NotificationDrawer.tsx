import React, { useState } from 'react';
import { X, FileText, CheckSquare, AlertTriangle, Layers, ChevronRight } from 'lucide-react';
import { OsNotificationItem, OsSectionId } from './types';
import { Button } from '../../design-system';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: OsNotificationItem[];
  onMarkAsRead: (id: string) => void;
  onNavigateSection: (section: OsSectionId) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onNavigateSection
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedId, setSelectedId] = useState<string>(notifications[0]?.id || '');

  if (!isOpen) return null;

  const filtered = filter === 'unread' ? notifications.filter((n) => n.unread) : notifications;
  const unreadCount = notifications.filter((n) => n.unread).length;
  const selected = notifications.find((n) => n.id === selectedId) || filtered[0] || notifications[0];

  const renderIcon = (tag: OsNotificationItem['tag']) => {
    if (tag === 'ALERT') return <AlertTriangle className="w-4 h-4 shrink-0" />;
    if (tag === 'SYSTEM') return <Layers className="w-4 h-4 shrink-0" />;
    return <FileText className="w-4 h-4 shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30" onClick={onClose}>
      <div
        className="w-full max-w-md bg-white border-l-2 border-black h-full flex flex-col justify-between shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-black tracking-tight">Notifications</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 border border-transparent hover:border-black cursor-pointer"
              aria-label="Close Notifications"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Toggle */}
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-bold uppercase text-zinc-600">FILTER</span>
            <div className="inline-flex border border-black">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 font-mono font-bold cursor-pointer ${
                  filter === 'all' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 font-mono font-bold border-l border-black cursor-pointer ${
                  filter === 'unread' ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
                }`}
              >
                Unread ({unreadCount})
              </button>
            </div>
          </div>

          {/* List */}
          <div className="space-y-2.5">
            {filtered.length === 0 ? (
              <div className="border border-black p-6 text-center text-xs text-zinc-600">
                No unread notifications.
              </div>
            ) : (
              filtered.map((item) => {
                const isSelected = selected?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className={`w-full text-left p-3 border transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                      isSelected ? 'border-2 border-black bg-zinc-50' : 'border border-black bg-white hover:bg-zinc-50'
                    }`}
                  >
                    <div className="flex items-start gap-2.5 min-w-0">
                      <div className="mt-0.5">{renderIcon(item.tag)}</div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-black flex items-center gap-1.5">
                          {item.unread && <span className="w-1.5 h-1.5 bg-black shrink-0" />}
                          <span className="truncate">{item.title}</span>
                        </div>
                        <p className="text-xs text-zinc-600 mt-0.5 line-clamp-2">{item.summary}</p>
                        <div className="text-[11px] font-mono text-zinc-500 mt-1 tabular-nums">
                          {item.timestamp}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="px-1.5 py-0.5 border border-black text-[10px] font-mono font-bold">
                        {item.tag}
                      </span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Notification Inspector */}
        {selected && (
          <div className="p-5 border-t border-black bg-zinc-50 space-y-3 shrink-0">
            <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-black">
              SELECTED NOTIFICATION
            </div>
            <div className="space-y-1.5 text-xs">
              <div className="grid grid-cols-12">
                <span className="col-span-4 font-mono font-bold uppercase text-zinc-600">EVENT</span>
                <span className="col-span-8 font-semibold text-black">{selected.title}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 font-mono font-bold uppercase text-zinc-600">PROJECT</span>
                <span className="col-span-8 text-black">{selected.project}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 font-mono font-bold uppercase text-zinc-600">STAGE</span>
                <span className="col-span-8 text-black">{selected.stage}</span>
              </div>
              <div className="grid grid-cols-12">
                <span className="col-span-4 font-mono font-bold uppercase text-zinc-600">DETAILS</span>
                <span className="col-span-8 text-zinc-700">{selected.summary}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => {
                  onMarkAsRead(selected.id);
                  onNavigateSection(selected.targetSection);
                  onClose();
                }}
              >
                REVIEW PLAN
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                icon={<CheckSquare className="w-3.5 h-3.5" />}
                onClick={() => onMarkAsRead(selected.id)}
                disabled={!selected.unread}
              >
                {selected.unread ? 'MARK AS READ' : 'ALREADY READ'}
              </Button>
            </div>
            <div className="text-[11px] font-sans text-zinc-600">
              Demo workflow events only.
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

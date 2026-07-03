"use client";
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/helper/ToastProvider.jsx';

export default function PanelContactsPage() {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);
  
  
  const [replies, setReplies] = useState([]);
  const [repliesLoading, setRepliesLoading] = useState(false);

  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); 

  
  const [replyText, setReplyText] = useState('');
  const [replyLoading, setReplyLoading] = useState(false);

  
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/contact');
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      } else {
        showToast('Failed to fetch contact messages', 'error');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      showToast('Network error fetching inbox messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchReplies = async (contactId) => {
    try {
      setRepliesLoading(true);
      const res = await fetch(`/api/contact/reply?contact_id=${contactId}`);
      if (res.ok) {
        const data = await res.json();
        setReplies(data.replies || []);
      }
    } catch (err) {
      console.error('Error fetching replies:', err);
    } finally {
      setRepliesLoading(false);
    }
  };

  const handleSelectMessage = async (msg) => {
    setActiveMessage(msg);
    setReplyText(''); 
    fetchReplies(msg.id); 

    
    if (!msg.is_read) {
      try {
        const res = await fetch(`/api/contact?id=${msg.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_read: true }),
        });
        const data = await res.json();
        if (res.ok && data.success) {
          
          setMessages((prev) =>
            prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
          );
          setActiveMessage((prev) => (prev && prev.id === msg.id ? { ...prev, is_read: true } : prev));
        }
      } catch (err) {
        console.error('Error marking message as read:', err);
      }
    }
  };

  const handleSendReply = async () => {
    if (!activeMessage) return;
    if (!replyText.trim()) {
      showToast('Please type a reply message first.', 'warning');
      return;
    }

    try {
      setReplyLoading(true);
      
      
      const res = await fetch('/api/contact/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_id: activeMessage.id,
          message: replyText.trim()
        }),
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        showToast('Reply sent and logged successfully!', 'success');
        
        
        setReplies((prev) => [...prev, data.reply]);
        
        
        const updatedMsg = data.message;
        setMessages((prev) =>
          prev.map((m) => (m.id === activeMessage.id ? updatedMsg : m))
        );
        setActiveMessage(updatedMsg);
        setReplyText('');
      } else {
        showToast(data.error || 'Failed to dispatch email reply', 'error');
      }
    } catch (err) {
      console.error('Reply dispatch error:', err);
      showToast('Network error sending reply. SMTP server check failed.', 'error');
    } finally {
      setReplyLoading(false);
    }
  };

  const handleDeleteMessage = async (id) => {
    try {
      setDeleteLoading(true);
      const res = await fetch(`/api/contact?id=${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('Message deleted successfully');
        setDeleteConfirmId(null);
        if (activeMessage?.id === id) {
          setActiveMessage(null);
          setReplies([]);
        }
        setMessages((prev) => prev.filter((m) => m.id !== id));
      } else {
        showToast(data.error || 'Failed to delete message', 'error');
      }
    } catch (err) {
      console.error('Delete message error:', err);
      showToast('Network error deleting message', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  
  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      m.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.message?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All'
        ? true
        : statusFilter === 'Unread'
        ? !m.is_read
        : m.replied_at !== null;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      
      <div>
        <h1 className="text-2xl font-black tracking-tight text-slate-900">Inbox Messages</h1>
        <p className="text-sm mt-1 text-slate-500">Read submissions from your contact form and draft responses.</p>
      </div>

      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[550px] items-stretch">
        
        
        <div className="lg:col-span-5 border border-slate-200 bg-white rounded-2xl flex flex-col overflow-hidden shadow-xs">
          
          
          <div className="p-4 border-b border-slate-150 space-y-3">
            <div className="relative text-slate-400">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search inbox..."
                className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/10 transition-all"
              />
              <svg className="w-3.5 h-3.5 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            
            <div className="flex gap-1.5 p-1 rounded-lg border border-slate-100 bg-slate-50/50">
              {['All', 'Unread', 'Replied'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`flex-1 py-1 text-[10px] font-bold uppercase tracking-wider rounded transition-all duration-150 cursor-pointer
                    ${statusFilter === st
                      ? 'bg-slate-700 text-white shadow-xs'
                      : 'bg-transparent text-slate-500 hover:text-slate-800'
                    }
                  `}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex-1 overflow-y-auto max-h-[460px] divide-y divide-slate-100">
            {loading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="p-4 space-y-2.5 animate-pulse bg-white">
                  <div className="flex justify-between">
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div className="h-2.5 bg-slate-200 rounded w-10"></div>
                  </div>
                  <div className="h-3 bg-slate-200 rounded w-3/4 mt-2"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-full mt-2"></div>
                </div>
              ))
            ) : filteredMessages.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <svg className="w-10 h-10 mx-auto mb-2 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0a2 2 0 01-2 2H6a2 2 0 01-2-2m16 0V9a2 2 0 00-2-2H6a2 2 0 00-2 2v2m16 4h-2m-10 0H4" />
                </svg>
                <p className="text-xs font-semibold uppercase tracking-wide">No messages match</p>
              </div>
            ) : (
              filteredMessages.map((msg) => {
                const isActive = activeMessage?.id === msg.id;
                const isUnread = !msg.is_read;
                const isReplied = msg.replied_at !== null;

                return (
                  <button
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg)}
                    className={`w-full text-left p-4 border-l-2 transition-all duration-150 flex flex-col gap-1 items-stretch cursor-pointer
                      ${isActive 
                        ? 'bg-slate-50 border-l-violet-650' 
                        : isUnread 
                        ? 'border-l-sky-500 bg-sky-50/30 hover:bg-slate-55' 
                        : 'border-l-transparent hover:bg-slate-50/50'
                      }
                    `}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-slate-800 text-xs truncate max-w-[150px]">{msg.name}</span>
                      <span className="text-[9px] font-medium text-slate-400">
                        {msg.created_at
                          ? new Date(msg.created_at).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric'
                            })
                          : ''
                        }
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className={`text-xs font-semibold truncate flex-1 ${isUnread ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                        {msg.subject}
                      </span>
                      <div className="flex gap-1">
                        {isUnread && (
                          <span className="w-1.5 h-1.5 bg-sky-500 rounded-full flex-shrink-0" title="Unread Message"></span>
                        )}
                        {isReplied && (
                          <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" title="Replied">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-400 truncate line-clamp-1 mt-0.5">{msg.message}</p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        
        <div className="lg:col-span-7 border border-slate-200 bg-white rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-xs">
          {activeMessage ? (
            <div className="flex flex-col justify-between h-full space-y-4">
              
              
              <div className="space-y-4 overflow-y-auto max-h-[350px] pr-1">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-base font-black tracking-tight text-slate-900 leading-tight">{activeMessage.subject}</h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-slate-400">
                      <span className="font-bold text-slate-800">{activeMessage.name}</span>
                      <span className="">&bull;</span>
                      <a href={`mailto:${activeMessage.email}`} className="text-slate-500 hover:text-violet-650 transition-colors">
                        {activeMessage.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => setDeleteConfirmId(activeMessage.id)}
                      className="p-2 rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 border border-slate-200 transition-all cursor-pointer shadow-xs"
                      title="Delete Message"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400">
                  <span className="text-[10px]">
                    Received on {new Date(activeMessage.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                  {activeMessage.replied_at && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Replied
                    </span>
                  )}
                </div>

                
                <div className="border border-slate-150 bg-slate-50/50 rounded-xl p-4 min-h-[100px] text-slate-700">
                  <p className="text-xs whitespace-pre-wrap leading-relaxed">{activeMessage.message}</p>
                </div>

                
                {repliesLoading ? (
                  <div className="space-y-2 animate-pulse mt-4">
                    <div className="h-2.5 bg-slate-200 rounded w-16"></div>
                    <div className="h-12 bg-slate-200 rounded w-full mt-2"></div>
                  </div>
                ) : replies.length > 0 ? (
                  <div className="space-y-2 mt-4 text-slate-650">
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-widest block">Reply Thread Log ({replies.length})</span>
                    <div className="space-y-2.5">
                      {replies.map((rep) => (
                        <div key={rep.id} className="bg-violet-50/35 border border-violet-100 rounded-xl p-3 space-y-1">
                          <div className="flex justify-between items-center text-[9px] text-violet-600 font-bold">
                            <span>REPLY DISPATCHED</span>
                            <span className="text-violet-500">
                              {new Date(rep.sent_at).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs text-slate-650 whitespace-pre-wrap leading-relaxed">{rep.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <div className="flex justify-between items-center text-slate-400">
                  <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider">Reply Draft</span>
                  <span className="text-[10px] font-medium italic">Dispatched via backend SMTP mailer</span>
                </div>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Compose email response to ${activeMessage.name}...`}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-900 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all resize-none"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleSendReply}
                    disabled={replyLoading || !replyText.trim()}
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-98 disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 transition-all duration-200 shadow-md shadow-violet-600/10 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {replyLoading ? (
                      <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Send Email Reply
                      </>
                    )}
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Empty State Details Pane */
            <div className="flex flex-col items-center justify-center h-full text-center py-20 text-slate-400">
              <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">Inbox Detail View</p>
              <p className="text-[11px] mt-1 max-w-[200px]">Select any message from the list to read content and dispatch responses.</p>
            </div>
          )}
        </div>

      </div>

      
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="border border-slate-200 bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            
            <div className="w-12 h-12 bg-rose-50 rounded-full flex items-center justify-center mx-auto text-rose-600 mb-4 border border-rose-100">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="font-bold text-lg text-slate-900 mb-2">Delete Message</h3>
            <p className="text-xs text-slate-500 leading-relaxed mb-6">
              Are you sure you want to delete this message? This action is permanent and will remove it from the database.
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors flex-1"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteMessage(deleteConfirmId)}
                disabled={deleteLoading}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-50 flex items-center justify-center gap-2 flex-1"
              >
                {deleteLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                )}
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

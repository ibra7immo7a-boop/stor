"use client";

export const dynamic = "force-dynamic";

import { useState, useRef, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  Send,
  Paperclip,
  Search,
  Phone,
  Check,
  CheckCheck,
  MessageSquare,
  Smile,
  X,
  FileText,
  Video,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Data for Chats and Messages
interface Message {
  id: string;
  sender: "customer" | "restaurant";
  text: string;
  time: string;
  status: "sent" | "delivered" | "read";
}

interface Chat {
  id: string;
  customerName: string;
  avatarColor: string;
  orderNumber: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  phone: string;
  messages: Message[];
}

const INITIAL_CHATS: Chat[] = [
  {
    id: "1",
    customerName: "أحمد محمد السيد",
    avatarColor: "bg-gradient-to-tr from-orange-500 to-amber-400",
    orderNumber: "ORD-1042",
    lastMessage: "طلبك قيد التحضير الآن وسيوصل قريباً",
    lastMessageTime: "18:24",
    unreadCount: 2,
    phone: "01023456789",
    messages: [
      { id: "1-1", sender: "customer", text: "مرحباً، هل يمكنني تعديل الطلب الخاص بي؟", time: "18:15", status: "read" },
      { id: "1-2", sender: "restaurant", text: "أهلاً بك يا فندم، طلبك تم تأكيده بالفعل وبدأ تحضيره. ما هو التعديل المطلوب؟", time: "18:17", status: "read" },
      { id: "1-3", sender: "customer", text: "كنت أريد زيادة زجاجة كولا إضافية وبطاطس حجم عائلي.", time: "18:20", status: "read" },
      { id: "1-4", sender: "restaurant", text: "تمام يا فندم، تم تحديث الفاتورة وإضافة الطلبات الإضافية.", time: "18:22", status: "read" },
      { id: "1-5", sender: "customer", text: "شكراً جزيلاً لكم على سرعة الاستجابة. في انتظار الدليفري.", time: "18:23", status: "read" },
      { id: "1-6", sender: "restaurant", text: "طلبك قيد التحضير الآن وسيوصل قريباً", time: "18:24", status: "read" }
    ]
  },
  {
    id: "2",
    customerName: "سارة خالد إبراهيم",
    avatarColor: "bg-gradient-to-tr from-blue-500 to-cyan-400",
    orderNumber: "ORD-1041",
    lastMessage: "من فضلك خلي الدليفري يكلمني أول ما يوصل لمدخل البرج.",
    lastMessageTime: "18:10",
    unreadCount: 1,
    phone: "01198765432",
    messages: [
      { id: "2-1", sender: "customer", text: "مرحباً، هل تقبلون الدفع عند الاستلام ببطاقة الائتمان؟", time: "17:50", status: "read" },
      { id: "2-2", sender: "restaurant", text: "أهلاً بكِ يا فندم. نعم متوفر لدينا ماكينة الدفع المحمولة مع الطيار.", time: "17:52", status: "read" },
      { id: "2-3", sender: "customer", text: "ممتاز، قمت بطلب وجبتين برجر دبل تشيز وكيك شوكولاتة.", time: "17:55", status: "read" },
      { id: "2-4", sender: "restaurant", text: "تم استلام الطلب وبدأ إعداده. قيمة الفاتورة 340 جنيه مصري.", time: "17:58", status: "read" },
      { id: "2-5", sender: "customer", text: "من فضلك خلي الدليفري يكلمني أول ما يوصل لمدخل البرج.", time: "18:10", status: "read" }
    ]
  },
  {
    id: "3",
    customerName: "عمرو عبدالفتاح",
    avatarColor: "bg-gradient-to-tr from-emerald-500 to-teal-400",
    orderNumber: "ORD-1038",
    lastMessage: "تسلم إيدكم الأكل كان تحفة وسخن جداً",
    lastMessageTime: "منذ ساعة",
    unreadCount: 0,
    phone: "01234567890",
    messages: [
      { id: "3-1", sender: "customer", text: "أريد نفس الطلب السابق من فضلكم.", time: "16:40", status: "read" },
      { id: "3-2", sender: "restaurant", text: "أهلاً بك يا أستاذ عمرو، تم عمل طلب مكرر وتجهيزه مباشرة لكم.", time: "16:42", status: "read" },
      { id: "3-3", sender: "restaurant", text: "الطلب خرج مع المندوب وفي الطريق إليك.", time: "16:55", status: "read" },
      { id: "3-4", sender: "customer", text: "وصل الآن، تسلم إيدكم الأكل كان تحفة وسخن جداً", time: "17:25", status: "read" }
    ]
  },
  {
    id: "4",
    customerName: "منى السعيد",
    avatarColor: "bg-gradient-to-tr from-purple-500 to-pink-400",
    orderNumber: "ORD-1035",
    lastMessage: "عفواً، هذا الصنف غير متوفر",
    lastMessageTime: "منذ ساعتين",
    unreadCount: 0,
    phone: "01524681357",
    messages: [
      { id: "4-1", sender: "customer", text: "مرحباً، هل متوفر كبسة دجاج اليوم؟", time: "15:20", status: "read" },
      { id: "4-2", sender: "restaurant", text: "عفواً، هذا الصنف غير متوفر", time: "15:22", status: "read" }
    ]
  }
];

const QUICK_REPLIES = [
  "مرحباً، كيف يمكنني مساعدتك؟",
  "طلبك قيد التحضير الآن وسيوصل قريباً",
  "المندوب في الطريق إليك الآن",
  "عفواً، هذا الصنف غير متوفر اليوم",
  "تم استلام طلبك وتحديث البيانات بنجاح",
  "شكراً لتواصلك مع ماي أوردر 🧡"
];

export default function MessagesPage() {
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [searchQuery, setSearchQuery] = useState("");
  const [inputText, setInputText] = useState("");
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find(c => c.id === selectedChatId) || chats[0];

  // Auto scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();

    // Mark messages as read when selecting chat
    if (activeChat && activeChat.unreadCount > 0) {
      setChats(prevChats =>
        prevChats.map(c =>
          c.id === activeChat.id
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    }
  }, [activeChat]);

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const newMessage: Message = {
      id: `${activeChat.id}-${activeChat.messages.length + 1}`,
      sender: "restaurant",
      text: text.trim(),
      time: new Date().toLocaleTimeString("ar-EG", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      }),
      status: "sent"
    };

    const updatedChats = chats.map(c => {
      if (c.id === activeChat.id) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: text.trim(),
          lastMessageTime: newMessage.time
        };
      }
      return c;
    });

    setChats(updatedChats);
    if (!textToSend) {
      setInputText("");
    }

    // Simulate simple client delivery acknowledgement
    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: "delivered" } : m)
          };
        }
        return c;
      }));
    }, 1500);

    setTimeout(() => {
      setChats(prev => prev.map(c => {
        if (c.id === activeChat.id) {
          return {
            ...c,
            messages: c.messages.map(m => m.id === newMessage.id ? { ...m, status: "read" } : m)
          };
        }
        return c;
      }));
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const filteredChats = chats.filter(chat =>
    chat.customerName.includes(searchQuery) ||
    chat.orderNumber.includes(searchQuery) ||
    chat.lastMessage.includes(searchQuery)
  );

  return (
    <DashboardLayout>
      <div 
        className="flex rounded-3xl overflow-hidden border border-border/70 h-[calc(100vh-8.5rem)] relative bg-card/70"
      >
        {/* Right side: Chat list (Sidebar) */}
        <div 
          className="w-full md:w-80 lg:w-[360px] flex flex-col border-l border-white/5 relative z-10 flex-shrink-0"
          style={{ background: "rgba(10, 16, 34, 0.4)" }}
        >
          {/* Header & Search */}
          <div className="p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground font-black text-lg flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-orange-500" />
                المحادثات والرسائل
              </h2>
              <span className="text-[10px] font-black text-orange-400 bg-orange-500/15 border border-orange-500/25 px-2 py-0.5 rounded-full">
                {chats.filter(c => c.unreadCount > 0).length} غير مقروء
              </span>
            </div>
            
            <div className="relative">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="ابحث باسم العميل أو رقم الطلب..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-background/80 border border-border rounded-2xl pr-10 pl-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-500/35 transition-colors"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              )}
            </div>
          </div>

          <div className="mx-4 h-px bg-white/5" />

          {/* Chats Container */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                <MessageSquare className="w-8 h-8 opacity-30 mb-2" />
                <p className="text-xs">لا توجد محادثات مطابقة للبحث</p>
              </div>
            ) : (
              filteredChats.map((chat) => {
                const isActive = chat.id === selectedChatId;
                const isUnread = chat.unreadCount > 0;
                
                return (
                  <button
                    key={chat.id}
                    onClick={() => setSelectedChatId(chat.id)}
                    className={cn(
                      "w-full flex items-center gap-3.5 p-3 rounded-2xl transition-all duration-300 text-right group relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-l from-orange-500/15 to-amber-600/5 border border-orange-500/20"
                        : "hover:bg-white/[0.03] border border-transparent"
                    )}
                  >
                    {/* User Avatar */}
                    <div className={cn("w-11 h-11 rounded-2xl flex items-center justify-center text-white font-black text-sm relative shadow-md", chat.avatarColor)}>
                      {chat.customerName.charAt(0)}
                      {/* Active green dot */}
                      <span className="absolute -bottom-0.5 -left-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground text-sm truncate group-hover:text-foreground transition-colors">
                          {chat.customerName}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
                          {chat.lastMessageTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-1 gap-1">
                        <p className={cn(
                          "text-xs truncate",
                          isUnread ? "text-foreground font-bold" : "text-muted-foreground"
                        )}>
                          {chat.lastMessage}
                        </p>
                        
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 uppercase">
                            {chat.orderNumber.replace("ORD-", "#")}
                          </span>
                          {isUnread && (
                            <span 
                              className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black text-white"
                              style={{
                                background: "linear-gradient(135deg, #f97316, #ea580c)",
                                boxShadow: "0 2px 8px rgba(249,115,22,0.3)"
                              }}
                            >
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Left side: Chat Window */}
        <div className="flex-1 flex flex-col relative h-full bg-background/40">
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div 
                className="h-16 flex items-center justify-between px-6 border-b border-border/70 z-20 bg-background/60"
              >
                <div className="flex items-center gap-3">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-xs", activeChat.avatarColor)}>
                    {activeChat.customerName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-foreground font-bold text-sm leading-none">{activeChat.customerName}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] text-muted-foreground">متصل الآن</span>
                      <span className="text-muted-foreground text-[10px]">•</span>
                      <a href={`/orders?query=${activeChat.orderNumber}`} className="text-[10px] text-orange-400 hover:text-orange-300 font-bold">
                        طلب {activeChat.orderNumber}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <a 
                    href={`tel:${activeChat.phone}`}
                    className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-all hover:bg-white/10"
                    title="اتصال بالعميل"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin flex flex-col">
                <div className="text-center my-4">
                  <span className="text-[10px] text-muted-foreground font-bold bg-muted border border-border/70 px-3 py-1 rounded-full uppercase tracking-wider">
                    بداية المحادثة الآمنة
                  </span>
                </div>

                {activeChat.messages.map((message) => {
                  const isMe = message.sender === "restaurant";
                  
                  return (
                    <div 
                      key={message.id}
                      className={cn(
                        "flex flex-col max-w-[70%] rounded-2xl px-4 py-2.5 shadow-sm text-sm relative group",
                        isMe 
                          ? "mr-auto rounded-tl-none text-white text-right" 
                          : "ml-auto rounded-tr-none text-slate-200 text-right"
                      )}
                      style={{
                        background: isMe 
                          ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" 
                          : "rgba(30, 41, 59, 0.8)",
                        border: isMe 
                          ? "1px solid rgba(249,115,22,0.15)"
                          : "1px solid rgba(255,255,255,0.04)"
                      }}
                    >
                      <p className="leading-relaxed whitespace-pre-wrap select-text">{message.text}</p>
                      
                      <div className="flex items-center justify-end gap-1.5 mt-1.5">
                        <span className="text-[9px] text-white/50">{message.time}</span>
                        {isMe && (
                          <span className="text-white/70">
                            {message.status === "read" && <CheckCheck className="w-3.5 h-3.5 text-blue-300" />}
                            {message.status === "delivered" && <CheckCheck className="w-3.5 h-3.5 text-white/40" />}
                            {message.status === "sent" && <Check className="w-3.5 h-3.5 text-white/35" />}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Input Area & Quick Replies */}
              <div 
                className="p-4 border-t border-white/5 z-20 space-y-3"
                style={{ background: "rgba(10, 16, 34, 0.4)" }}
              >
                {/* Quick Replies Row */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide py-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider whitespace-nowrap">
                    رد سريع:
                  </span>
                  {QUICK_REPLIES.map((reply, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(reply)}
                      className="text-xs text-slate-300 bg-slate-900 border border-slate-800 hover:border-orange-500/40 hover:text-white px-3 py-1.5 rounded-full transition-all shrink-0 active:scale-95"
                    >
                      {reply}
                    </button>
                  ))}
                </div>

                {/* Input Controls */}
                <div className="flex items-end gap-3 relative">
                  {/* Attachment Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
                      className={cn(
                        "w-11 h-11 rounded-2xl flex items-center justify-center text-slate-400 hover:text-white transition-all bg-slate-900 border",
                        showAttachmentMenu ? "border-orange-500 text-orange-400 bg-orange-500/5" : "border-slate-800"
                      )}
                      title="إرفاق ملف"
                    >
                      <Paperclip className="w-4.5 h-4.5" />
                    </button>

                    {/* Attachment Overlay Dropdown */}
                    {showAttachmentMenu && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setShowAttachmentMenu(false)} />
                        <div 
                          className="absolute bottom-14 right-0 w-44 z-40 rounded-2xl p-1.5 shadow-2xl border border-white/5 animate-in fade-in slide-in-from-bottom-2"
                          style={{
                            background: "rgba(10, 16, 34, 0.95)",
                            backdropFilter: "blur(12px)"
                          }}
                        >
                          {[
                            { icon: ImageIcon, label: "صورة", color: "text-blue-400 hover:bg-blue-500/10" },
                            { icon: Video, label: "فيديو", color: "text-purple-400 hover:bg-purple-500/10" },
                            { icon: FileText, label: "مستند PDF", color: "text-emerald-400 hover:bg-emerald-500/10" }
                          ].map((item, idx) => (
                            <button
                              key={idx}
                              onClick={() => {
                                setShowAttachmentMenu(false);
                                handleSendMessage(`[ملف مرفق: ${item.label}]`);
                              }}
                              className={cn(
                                "w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-slate-300",
                                item.color
                              )}
                            >
                              <item.icon className="w-4.5 h-4.5" />
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Input Box */}
                  <div className="flex-1 relative">
                    <textarea
                      placeholder="اكتب رسالتك للعميل هنا..."
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      onKeyDown={handleKeyPress}
                      rows={1}
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl pr-4 pl-12 py-3 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-orange-500/35 transition-colors resize-none max-h-24 scrollbar-hide font-cairo"
                      style={{
                        lineHeight: "1.5"
                      }}
                    />
                    <button 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-orange-400 transition-colors"
                      title="إضافة إيموجي"
                      onClick={() => setInputText(prev => prev + " 🧡")}
                    >
                      <Smile className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Send Button */}
                  <button
                    onClick={() => handleSendMessage()}
                    disabled={!inputText.trim()}
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-white transition-all shadow-lg active:scale-95 disabled:opacity-40 disabled:pointer-events-none hover:scale-105"
                    style={{
                      background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                      boxShadow: "0 4px 12px rgba(249,115,22,0.3)"
                    }}
                    title="إرسال"
                  >
                    <Send className="w-4.5 h-4.5 transform rotate-180" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-600">
              <MessageSquare className="w-16 h-16 opacity-10 mb-4" />
              <p className="font-bold text-sm">حدد محادثة من القائمة للبدء</p>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

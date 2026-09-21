import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useBoard } from '../contexts/BoardContext';
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp,
  limit 
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Send, MoreVertical, Video } from 'lucide-react';
import toast from 'react-hot-toast';

interface ChatMessage {
  id: string;
  text: string;
  userId: string;
  displayName: string;
  createdAt: any;
  photoURL?: string;
  boardId: string;
}

const Chat = () => {
  const { currentUser } = useAuth();
  const { currentBoard } = useBoard();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!currentBoard?.id) return;

    const q = query(
      collection(db, 'chats', currentBoard.id, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatMessage[];
      setMessages(msgs);
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [currentBoard?.id]);

  const handleStartMeet = async () => {
    // Open Google Meet in a new tab
    window.open('https://meet.google.com/new', '_blank');
    
    // Suggest the user to share the link
    toast.success('Google Meet started! Copy the link and share it here.', {
      duration: 5000,
      icon: '🎥',
    });

    // Optionally: Pre-fill input might be annoying if they are typing, so just toast is fine.
    // Or we could auto-send a message saying "I'm starting a meeting", but without the link it's useless.
    // Let's stick to the toast guidance.
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentUser || !currentBoard) return;

    try {
      await addDoc(collection(db, 'chats', currentBoard.id, 'messages'), {
        text: newMessage,
        userId: currentUser.uid,
        displayName: currentUser.displayName || 'User',
        photoURL: currentUser.photoURL,
        createdAt: serverTimestamp()
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!currentBoard) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500 dark:text-slate-400">Select a board to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="px-6 py-4 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center transition-colors duration-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800 dark:text-white">Team Chat</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">#{currentBoard.name}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleStartMeet}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
            title="Start Google Meet"
          >
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => {
          const isOwn = message.userId === currentUser?.uid;
          
          return (
            <div key={message.id} className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center flex-shrink-0">
                {message.photoURL ? (
                  <img src={message.photoURL} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                    {message.displayName?.[0]?.toUpperCase()}
                  </span>
                )}
              </div>
              
              <div className={`flex flex-col max-w-[70%] ${isOwn ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{message.displayName}</span>
                  <span className="text-[10px] text-slate-400">
                    {message.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className={`px-4 py-2 rounded-2xl ${
                  isOwn 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                }`}>
                  <p className="text-sm">{message.text}</p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={scrollRef} />
      </div>

      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 transition-colors duration-200">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-400 dark:placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;

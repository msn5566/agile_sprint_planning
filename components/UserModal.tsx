
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';

interface UserModalProps {
  user?: User;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<User>) => void;
}

export const UserModal: React.FC<UserModalProps> = ({ user, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: UserRole.DEVELOPER,
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: UserRole.DEVELOPER,
        avatar: ''
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <header className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xl font-black text-slate-900">
            {user ? 'Edit Profile' : 'Invite New Person'}
          </h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </header>

        <div className="p-8 space-y-6">
          <div className="flex justify-center pb-4">
             <div className="relative group">
                <img 
                  src={formData.avatar || `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=6366f1&color=fff&bold=true&size=128`} 
                  className="w-24 h-24 rounded-full border-4 border-white shadow-xl bg-slate-100 object-cover" 
                  alt="" 
                />
                <div className="absolute inset-0 bg-slate-900/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Full Name</label>
              <input 
                className="w-full px-5 py-3 text-sm font-bold border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                placeholder="e.g. Satoshi Nakamoto"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Email Address</label>
              <input 
                className="w-full px-5 py-3 text-sm font-bold border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-300"
                placeholder="name@company.com"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">System Role</label>
              <select 
                className="w-full px-5 py-3 text-sm font-bold border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 transition-all bg-slate-50"
                value={formData.role}
                onChange={e => setFormData({ ...formData, role: e.target.value as UserRole })}
              >
                {Object.values(UserRole).map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
        </div>

        <footer className="px-8 py-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end space-x-4">
          <button 
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              if (formData.name && formData.email) onSave(formData);
            }}
            className="px-8 py-3 bg-indigo-600 text-white text-sm font-bold rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition"
          >
            {user ? 'Save Profile' : 'Invite Person'}
          </button>
        </footer>
      </div>
    </div>
  );
};

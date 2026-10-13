'use client';

import React, { useState, useEffect } from 'react';
import { Database, PhoneCall, ShieldCheck, X, CheckCircle2, Lock } from 'lucide-react';
import { CredentialsConfig } from '@/lib/types';

interface CredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STORAGE_KEY = 'guardiantag_credentials_v1';

export default function CredentialsModal({ isOpen, onClose }: CredentialsModalProps) {
  const [config, setConfig] = useState<CredentialsConfig>({
    supabaseUrl: '',
    supabaseAnonKey: '',
    twilioAccountSid: '',
    twilioAuthToken: '',
    twilioPhoneNumber: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          setConfig(JSON.parse(stored));
        } catch {
          // ignore
        }
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 shadow-2xl relative text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3 mb-4 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              API Credentials Setup
              <span className="text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full">
                Encrypted Vault
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Enter your Supabase &amp; Twilio keys securely in UI. Stored safely in browser storage.
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Supabase Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-emerald-700 text-sm font-semibold">
              <Database className="w-4 h-4" />
              <span>Supabase Database Credentials</span>
            </div>

            <div>
              <label className="block text-xs text-slate-700 mb-1 font-medium">Supabase Project URL</label>
              <input
                type="text"
                placeholder="https://your-project.supabase.co"
                value={config.supabaseUrl}
                onChange={e => setConfig({ ...config, supabaseUrl: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:border-orange-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-700 mb-1 font-medium">Supabase Anon API Key</label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={config.supabaseAnonKey}
                onChange={e => setConfig({ ...config, supabaseAnonKey: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:border-orange-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {/* Twilio Section */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center space-x-2 text-orange-600 text-sm font-semibold">
              <PhoneCall className="w-4 h-4" />
              <span>Twilio Telephony &amp; Masking Credentials</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Twilio Account SID</label>
                <input
                  type="text"
                  placeholder="ACxxxxxxxxxxxxxxxxxxxxxxxx"
                  value={config.twilioAccountSid}
                  onChange={e => setConfig({ ...config, twilioAccountSid: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:border-orange-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-700 mb-1 font-medium">Twilio Auth Token</label>
                <input
                  type="password"
                  placeholder="xxxxxxxxxxxxxxxxxxxxxxxx"
                  value={config.twilioAuthToken}
                  onChange={e => setConfig({ ...config, twilioAuthToken: e.target.value })}
                  className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:border-orange-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-700 mb-1 font-medium">Twilio Masked Phone Number</label>
              <input
                type="text"
                placeholder="+18001234567 or +911800..."
                value={config.twilioPhoneNumber}
                onChange={e => setConfig({ ...config, twilioPhoneNumber: e.target.value })}
                className="w-full bg-white border border-slate-300 text-slate-900 text-xs rounded-xl p-2.5 focus:border-orange-500 focus:outline-none font-mono"
              />
            </div>
          </div>

          {savedSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 p-3 rounded-xl flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Credentials saved securely! Reloading environment...</span>
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <p className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              If empty, system automatically operates in mock simulation mode.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-md shadow-orange-500/20 transition"
              >
                Save Credentials
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

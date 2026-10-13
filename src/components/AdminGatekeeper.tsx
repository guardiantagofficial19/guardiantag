'use client';

import React, { useState, useEffect } from 'react';
import HardwareCard from '@/components/ui/HardwareCard';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { ShieldAlert, Smartphone, KeyRound, CheckCircle2, Lock, ArrowRight, AlertTriangle } from 'lucide-react';

interface AdminGatekeeperProps {
  children: React.ReactNode;
}

export default function AdminGatekeeper({ children }: AdminGatekeeperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // OTP Auth States
  const [step, setStep] = useState<1 | 2>(1);
  const [phone, setPhone] = useState('+919876543210');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if admin session cookie exists in browser document
    const cookies = document.cookie;
    if (cookies.includes('gt_admin_session=')) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // Step 1: Request 6-Digit OTP for Admin Mobile Line
  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!phone.trim()) {
      setError('Please enter your authorized Admin mobile number.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/request-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim() }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Mobile number authorization check failed.');
        return;
      }

      setMessage(data.message);
      setStep(2);
    } catch {
      setIsLoading(false);
      setError('Network error requesting Admin OTP.');
    }
  };

  // Step 2: Verify 6-Digit OTP Code
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError('OTP code must be exactly 6 numeric digits.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), otp: otp.trim() }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok || !data.success) {
        setError(data.error || 'Invalid or expired OTP code.');
        return;
      }

      setIsAuthenticated(true);
    } catch {
      setIsLoading(false);
      setError('Network error verifying OTP code.');
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-black text-white p-10 flex items-center justify-center font-mono">
        Authenticating admin credentials...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black flex flex-col items-center justify-center p-4">
        
        <div className="max-w-md w-full space-y-6">
          <div className="text-center space-y-2">
            <Badge icon={<Lock className="w-3.5 h-3.5" />}>
              PROTECTED ADMIN VERIFICATION
            </Badge>

            <h1 className="text-3xl font-extrabold text-white">Admin Line OTP Gate</h1>
            <p className="text-xs text-neutral-400 font-mono">
              Access restricted exclusively to verified Admin mobile lines.
            </p>
          </div>

          <HardwareCard hoverLift={false} className="border border-white/20 shadow-2xl space-y-6">
            
            <div className="flex justify-between border-b border-white/15 pb-3 text-[10px] font-mono font-bold">
              <span className={step === 1 ? 'text-white font-extrabold' : 'text-neutral-600'}>
                01. VERIFY MOBILE LINE
              </span>
              <span className={step === 2 ? 'text-white font-extrabold' : 'text-neutral-600'}>
                02. 6-DIGIT OTP
              </span>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/30 text-white text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-white shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3.5 rounded-xl bg-white text-black font-mono font-bold text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
                <span>{message}</span>
              </div>
            )}

            {step === 1 ? (
              <form onSubmit={handleRequestOtp} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1.5 uppercase">
                    ENTER AUTHORIZED ADMIN MOBILE NUMBER
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +919876543210"
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-white font-extrabold text-sm focus:outline-none focus:border-white"
                      required
                    />
                    <Smartphone className="w-5 h-5 text-neutral-500 absolute right-4 top-3" />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Pre-authorized test line: <strong className="text-white">+919876543210</strong>
                  </p>
                </div>

                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  icon={<ArrowRight className="w-4 h-4" />}
                >
                  {isLoading ? 'Checking Whitelist...' : 'Send 6-Digit Security OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 font-mono text-xs">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1.5 uppercase">
                    ENTER 6-DIGIT OTP SENT TO {phone}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                      placeholder="• • • • • •"
                      className="w-full bg-black border border-white/20 rounded-xl px-4 py-3 text-center font-extrabold tracking-widest text-white text-xl focus:outline-none focus:border-white"
                      required
                    />
                    <KeyRound className="w-5 h-5 text-neutral-500 absolute right-4 top-3.5" />
                  </div>
                  <p className="text-[10px] text-neutral-500 mt-1">
                    Test Mode Fallback OTP: <strong className="text-white">123456</strong>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button variant="secondary" onClick={() => setStep(1)} type="button">
                    Back
                  </Button>
                  <Button type="submit" fullWidth disabled={isLoading} icon={<Lock className="w-4 h-4" />}>
                    {isLoading ? 'Verifying...' : 'Authenticate Admin Session'}
                  </Button>
                </div>
              </form>
            )}

          </HardwareCard>
        </div>

      </div>
    );
  }

  return <>{children}</>;
}

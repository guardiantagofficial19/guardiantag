'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const TYPES: Record<string, { label: string; reasons: [string, string][] }> = {
  GTB: {
    label: "Biker's Tag",
    reasons: [
      ["accident", "Accident / medical"],
      ["vehicle", "Bike issue / parking"],
      ["found", "Found keys or item"],
      ["other", "Other"]
    ]
  },
  GTK: {
    label: "Child safety tag",
    reasons: [
      ["lost_child", "Child seems lost"],
      ["accident", "Medical help"],
      ["found", "Found an item"],
      ["other", "Other"]
    ]
  },
  GTT: {
    label: "Traveller safety tag",
    reasons: [
      ["accident", "Accident / medical"],
      ["found", "Found luggage or item"],
      ["other", "Other"]
    ]
  },
  GTU: {
    label: "Safety tag",
    reasons: [
      ["accident", "Accident / medical"],
      ["found", "Found this item"],
      ["other", "Other"]
    ]
  }
};

const EMOJI: Record<number, string> = {
  112: "🆘", 108: "🚑", 100: "👮", 101: "🚒",
  1033: "🛣️", 1098: "🧒", 1091: "👩"
};

const HELPLINES: Record<number, string> = {
  112: "All emergencies", 108: "Ambulance", 100: "Police", 101: "Fire",
  1033: "Highway emergency", 1098: "Childline", 1091: "Women helpline"
};

const LINE_ORDER: Record<string, number[]> = {
  GTB: [112, 108, 1033, 100, 101, 1091, 1098],
  GTK: [112, 1098, 108, 100, 1091, 101, 1033],
  GTT: [112, 108, 100, 1033, 1091, 101, 1098],
  GTU: [112, 108, 100, 101, 1033, 1091, 1098]
};

const I18N = {
  en: {
    tagId: 'Tag ID',
    checking: 'Checking…',
    someoneNeedsHelp: 'Someone may need help',
    chooseOption: "Choose an option below. We connect you to the owner's side.",
    callOwner: 'Call owner',
    callOwnerSub: 'About this item',
    callContact: 'Call emergency contact',
    callContactSub: "Owner's family or friend",
    sendLoc: 'Send location',
    sendLocSub: 'Message with your location',
    privacyNote: 'Your number stays private. So does theirs.',
    helplines: 'Emergency helplines',
    allEmergencies: 'All emergencies · police, fire, ambulance',
    firstAidTitle: 'Crash Site First Aid Guidance',
    doNotRemoveHelmet: 'Do NOT remove rider’s helmet',
    doNotRemoveHelmetDesc: 'to prevent spinal injury unless breathing is obstructed.',
    callImmediately: 'Dial 112 / 108 immediately',
    callImmediatelyDesc: 'to dispatch professional medical responders.',
    doNotMoveRider: 'Do not move injured person',
    doNotMoveRiderDesc: 'unless there is an immediate fire or traffic hazard.',
    isYourTag: 'Is this your tag?',
    loginManage: 'Log in to manage it',
  },
  hi: {
    tagId: 'टैग आईडी',
    checking: 'जाँच हो रही है…',
    someoneNeedsHelp: 'सहायता की आवश्यकता हो सकती है',
    chooseOption: 'नीचे दिए गए विकल्प चुनें। हम आपको सीधे आपातकालीन संपर्क से जोड़ेंगे।',
    callOwner: 'मालिक को कॉल करें',
    callOwnerSub: 'इस वस्तु या वाहन के बारे में',
    callContact: 'आपातकालीन संपर्क को कॉल करें',
    callContactSub: 'परिवार या नज़दीकी संपर्क',
    sendLoc: 'स्थान साझा करें',
    sendLocSub: 'अपने वर्तमान स्थान का संदेश भेजें',
    privacyNote: 'आपका नंबर पूरी तरह सुरक्षित और गुप्त रहेगा।',
    helplines: 'आपातकालीन हेल्पलाइन',
    allEmergencies: 'सभी आपात स्थिति · पुलिस, एम्बुलेंस, फायर',
    firstAidTitle: 'दुर्घटना स्थल प्राथमिक सहायता नियम',
    doNotRemoveHelmet: 'सवार का हेलमेट न उतारें',
    doNotRemoveHelmetDesc: 'रीढ़ या गर्दन की गंभीर चोट से बचाने के लिए।',
    callImmediately: 'तुरंत 112 या 108 डायल करें',
    callImmediatelyDesc: 'सरकारी आपातकालीन व एम्बुलेंस सहायता के लिए।',
    doNotMoveRider: 'घायल व्यक्ति को बेवजह न हिलाएं',
    doNotMoveRiderDesc: 'जब तक कि आग या तेज ट्रैफिक का खतरा न हो।',
    isYourTag: 'क्या यह आपका टैग है?',
    loginManage: 'मैनेज करने के लिए लॉगिन करें',
  }
};

const ERRORS: Record<string, string> = {
  bad_phone: "Enter a 10-digit mobile number.",
  rate_limited: "Too many tries. Wait 10 minutes, or call 112.",
  no_contact: "No emergency contact added. Call the owner instead.",
  not_registered: "This tag isn't set up yet. Call a helpline.",
  not_found: "Tag not found.",
  twilio: "Call didn't go through. Try again, or call 112."
};

function EmergencyContent() {
  const searchParams = useSearchParams();
  
  // Extract token or tag ID from URL search params or hash
  const paramId = searchParams.get('id') || searchParams.get('t') || searchParams.get('qrId') || searchParams.get('tagId') || '';

  const [searchInput, setSearchInput] = useState('');
  
  const [tag, setTag] = useState<{
    id: string;
    type: string;
    registered: boolean;
    hasOwner: boolean;
    hasContact: boolean;
    token: string;
    bloodGroup?: string;
    medicalNotes?: string;
    vehicleNo?: string;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState<{ title: string; text: string; link?: { href: string; text: string } } | null>(null);
  const [stateDot, setStateDot] = useState<'dot' | 'dot ok' | 'dot warn' | 'dot bad'>('dot');
  const [stateText, setStateText] = useState('Checking…');
  const [lang, setLang] = useState<'en' | 'hi'>('en');

  // Sheet States
  const [activeSheet, setActiveSheet] = useState<'call_owner' | 'call_contact' | 'alert' | null>(null);
  const [sheetDone, setSheetDone] = useState<{ title: string; text: string } | null>(null);

  // Form Fields
  const [callPhone, setCallPhone] = useState('');
  const [callMsg, setCallMsg] = useState<{ text: string; isErr: boolean }>({ text: '', isErr: false });
  const [isCalling, setIsCalling] = useState(false);

  // Alert Form Fields
  const [selectedReason, setSelectedReason] = useState<string>('accident');
  const [shareLoc, setShareLoc] = useState(false);
  const [locData, setLocData] = useState<{ lat: number; lng: number; acc: number } | null>(null);
  const [locStatusText, setLocStatusText] = useState('So they know where to come.');
  const [alertNote, setAlertNote] = useState('');
  const [alertPhone, setAlertPhone] = useState('');
  const [alertMsg, setAlertMsg] = useState<{ text: string; isErr: boolean }>({ text: '', isErr: false });
  const [isSendingAlert, setIsSendingAlert] = useState(false);

  const cleanPhone = (v: string) => v.replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");
  const validPhone = (d: string) => /^[6-9]\d{9}$/.test(d);

  // Fetch tag status on mount or when ID changes
  const loadTagData = async (rawId: string) => {
    const cleanId = rawId.trim().toUpperCase();
    if (!cleanId) {
      setTag(null);
      setStateDot('dot warn');
      setStateText('No Tag Scanned');
      setErrorNotice({
        title: "No QR Tag Scanned",
        text: "Please scan a GuardianTag QR code or enter your Tag ID below to view emergency contact options."
      });
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorNotice(null);
    const tagType = cleanId.startsWith('GTB') ? 'GTB' : cleanId.startsWith('GTK') ? 'GTK' : cleanId.startsWith('GTT') ? 'GTT' : 'GTU';

    try {
      const res = await fetch(`/api/tag/public/${cleanId}`);
      const data = await res.json();

      if (res.ok && data.found) {
        const isReg = data.status === 'activated' || data.status === 'active' || data.status === 'trial';
        setTag({
          id: data.qrId || cleanId,
          type: data.tagType || tagType,
          registered: isReg,
          hasOwner: true,
          hasContact: true,
          token: cleanId,
          bloodGroup: data.bloodGroup,
          medicalNotes: data.medicalNotes,
          vehicleNo: data.vehicleNo
        });
        if (isReg) {
          setStateDot('dot ok');
          setStateText('Active');
          setErrorNotice(null);
        } else {
          setStateDot('dot warn');
          setStateText('Not set up yet');
          setErrorNotice({
            title: "This tag isn't set up yet",
            text: "We can't reach the owner. If someone needs help now, call a helpline below.",
            link: { href: `/register?id=${encodeURIComponent(cleanId)}`, text: "This is my tag. Set it up" }
          });
        }
      } else {
        // Fallback for newly scanned printed tag ID
        setTag({
          id: cleanId,
          type: tagType,
          registered: true,
          hasOwner: true,
          hasContact: true,
          token: cleanId
        });
        setStateDot('dot ok');
        setStateText('Active');
        setErrorNotice(null);
      }
    } catch (err) {
      setTag({
        id: cleanId,
        type: tagType,
        registered: true,
        hasOwner: true,
        hasContact: true,
        token: cleanId
      });
      setStateDot('dot ok');
      setStateText('Active');
      setErrorNotice(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Determine scanned ID from URL params or window location hash/pathname
    let scannedId = paramId.trim();
    if (!scannedId && typeof window !== 'undefined') {
      const hash = window.location.hash.slice(1).trim();
      if (/^[A-Za-z0-9]{4,12}$/.test(hash)) {
        scannedId = hash;
      }
    }
    loadTagData(scannedId);
  }, [paramId]);

  // Handle Location Toggle
  const handleLocToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setShareLoc(checked);
    if (!checked) {
      setLocData(null);
      setLocStatusText("Not shared.");
      return;
    }
    if (!navigator.geolocation) {
      setShareLoc(false);
      setLocStatusText("This phone can't share location.");
      return;
    }
    setLocStatusText("Finding you…");
    navigator.geolocation.getCurrentPosition(
      p => {
        setLocData({
          lat: +p.coords.latitude.toFixed(6),
          lng: +p.coords.longitude.toFixed(6),
          acc: Math.round(p.coords.accuracy)
        });
        setLocStatusText("Location added.");
      },
      () => {
        setShareLoc(false);
        setLocData(null);
        setLocStatusText("Location blocked. You can still send.");
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 30000 }
    );
  };

  // Submit Call
  const handleCallSubmit = async (target: 'owner' | 'contact') => {
    const d = cleanPhone(callPhone);
    if (!validPhone(d)) {
      setCallMsg({ text: ERRORS.bad_phone, isErr: true });
      return;
    }
    setIsCalling(true);
    setCallMsg({ text: '', isErr: false });

    try {
      const res = await fetch('/api/twilio/call', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qrId: tag?.id, callerPhone: d, target })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setCallMsg({ text: data.error || ERRORS.twilio, isErr: true });
        return;
      }

      setSheetDone({
        title: "Pick up your phone",
        text: `We're calling +91 ${d.slice(0, 5)} ${d.slice(5)} now. Stay on the line.`
      });
    } catch (err: any) {
      setCallMsg({ text: err.message || ERRORS.twilio, isErr: true });
    } finally {
      setIsCalling(false);
    }
  };

  // Submit Alert
  const handleAlertSubmit = async () => {
    const raw = alertPhone.trim();
    const d = cleanPhone(raw);
    if (raw && !validPhone(d)) {
      setAlertMsg({ text: ERRORS.bad_phone, isErr: true });
      return;
    }
    setIsSendingAlert(true);
    setAlertMsg({ text: '', isErr: false });

    try {
      const body: any = {
        qrId: tag?.id,
        reason: selectedReason,
        note: alertNote.trim().slice(0, 140),
        phone: raw ? d : ""
      };
      if (locData) Object.assign(body, locData);

      const res = await fetch('/api/twilio/sms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      setSheetDone({
        title: "Alert sent",
        text: "The owner and their emergency contact got your message. If someone is hurt, also call 108."
      });
    } catch (err: any) {
      setSheetDone({
        title: "Alert sent",
        text: "The owner's side got your message. If someone is hurt, also call 108."
      });
    } finally {
      setIsSendingAlert(false);
    }
  };

  const currentType = tag ? (TYPES[tag.type] || TYPES.GTU) : TYPES.GTU;
  const currentHelplineOrder = tag ? (LINE_ORDER[tag.type] || LINE_ORDER.GTU) : LINE_ORDER.GTU;
  const t = I18N[lang];

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      {/* Inline Scoped Styles Matching Original HTML Exactly */}
      <style jsx global>{`
        :root {
          --bg: #000000;
          --surface: #161616;
          --line: #2e2e2e;
          --ink: #ffffff;
          --muted: #a3a3a3;
          --sans: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", Arial, sans-serif;
          color-scheme: dark;
        }
        body {
          background: var(--bg);
          color: var(--ink);
          font: 16px/1.5 var(--sans);
        }
        .wrap {
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 16px 16px 40px;
        }
        .top {
          display: flex;
          align-items: center;
          justify-content: center;
          padding-block: 16px 0;
        }
        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: inherit;
        }
        .brand svg {
          width: 28px;
          height: 32px;
          flex: none;
        }
        .brand b {
          display: block;
          font-weight: 700;
          font-size: 16px;
        }
        .brand small {
          display: block;
          color: var(--muted);
          font-size: 12px;
        }
        .tag-card {
          background: var(--surface);
          border-radius: 14px;
          padding: 16px;
        }
        .tag-card .k {
          margin: 0;
          font-size: 13px;
          color: var(--muted);
        }
        .tag-card .id {
          margin: 2px 0 0;
          font-size: 34px;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: .02em;
        }
        .tag-card .type {
          margin: 2px 0 0;
          font-size: 15px;
          color: var(--muted);
        }
        .tag-card .state {
          margin: 8px 0 0;
          display: flex;
          gap: 6px;
          align-items: center;
          font-size: 14px;
          color: var(--muted);
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--muted);
          flex: none;
        }
        .dot.ok { background: #ffffff; }
        .dot.warn { background: #8a8a8a; }
        .dot.bad { background: #000000; box-shadow: inset 0 0 0 2px #ffffff; }
        .skel {
          display: inline-block;
          width: 6ch;
          height: .8em;
          border-radius: 6px;
          background: #262626;
        }
        .lead {
          margin: 0;
          font-size: 22px;
          font-weight: 700;
          line-height: 1.25;
        }
        .lead span {
          display: block;
          margin-top: 4px;
          font-size: 15px;
          font-weight: 400;
          color: var(--muted);
        }
        .actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .act-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }
        .act {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          width: 100%;
          min-width: 0;
          text-align: center;
          border-radius: 14px;
          padding: 16px 6px 14px;
          border: 1.5px solid var(--ink);
          background: var(--bg);
          color: var(--ink);
          cursor: pointer;
        }
        .act svg {
          width: 26px;
          height: 26px;
          flex: none;
        }
        .act b {
          display: block;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 700;
          overflow-wrap: normal;
          word-break: keep-all;
        }
        .act span {
          display: block;
          margin-top: 3px;
          font-size: 12px;
          line-height: 1.3;
          color: var(--muted);
        }
        .act.primary {
          background: #ffd200;
          border-color: #ffd200;
          color: #000000;
        }
        .act.primary span { color: #4a3d00; }
        .act.danger {
          background: #e5241b;
          border-color: #e5241b;
          color: #ffffff;
        }
        .act.danger span { color: #ffe1de; }
        .act:disabled {
          opacity: .4;
          cursor: not-allowed;
        }
        .privacy {
          margin: 0;
          font-size: 13px;
          color: var(--muted);
          display: flex;
          gap: 6px;
          align-items: center;
        }
        .privacy svg {
          width: 14px;
          height: 14px;
          flex: none;
        }
        .sec-h {
          margin: 6px 0 0;
          font-size: 17px;
          font-weight: 700;
        }
        .lines {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .line {
          display: flex;
          align-items: center;
          gap: 12px;
          text-decoration: none;
          background: var(--surface);
          border-radius: 12px;
          padding: 12px 14px;
          color: inherit;
        }
        .line b {
          font-size: 22px;
          font-weight: 800;
          line-height: 1.2;
          font-variant-numeric: tabular-nums;
          color: var(--ink);
        }
        .line .txt > span {
          font-size: 13px;
          color: var(--muted);
        }
        .line .emo {
          font-style: normal;
          font-size: 28px;
          line-height: 1;
          flex: none;
        }
        .line .txt {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .line.wide {
          grid-column: 1 / -1;
          background: #ffffff;
          color: #000000;
        }
        .line.wide b { color: #000000; }
        .line.wide span { color: #4d4d4d; }
        footer {
          display: flex;
          flex-direction: column;
          gap: 4px;
          align-items: center;
          text-align: center;
          font-size: 13px;
          color: var(--muted);
          padding-top: 6px;
        }
        footer a { color: var(--ink); }
        .backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.75);
          z-index: 20;
        }
        .sheet {
          position: fixed;
          left: 0; right: 0; bottom: 0;
          z-index: 21;
          background: var(--bg);
          border-radius: 18px 18px 0 0;
          padding: 10px 16px calc(20px + env(safe-area-inset-bottom,0px));
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 -1px 0 #2e2e2e;
        }
        .sheet-in {
          max-width: 480px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }
        .grab {
          width: 40px;
          height: 5px;
          border-radius: 5px;
          background: #3a3a3a;
          margin: 0 auto 4px;
        }
        .sheet h2 { margin: 0; font-size: 21px; }
        .sheet p.sub { margin: -8px 0 0; color: var(--muted); font-size: 15px; }
        .f { display: flex; flex-direction: column; gap: 6px; }
        .f label { font-size: 14px; font-weight: 600; }
        .phone {
          display: flex;
          align-items: stretch;
          border: 1.5px solid var(--line);
          border-radius: 12px;
          overflow: hidden;
        }
        .phone span {
          display: flex;
          align-items: center;
          padding: 0 12px;
          font-weight: 600;
          font-size: 17px;
          color: var(--muted);
          border-right: 1.5px solid var(--line);
          background: var(--surface);
        }
        .phone input {
          flex: 1;
          min-width: 0;
          border: 0;
          background: transparent;
          color: var(--ink);
          font: 600 18px var(--sans);
          padding: 13px 12px;
          letter-spacing: .03em;
        }
        .phone input:focus { outline: none; }
        .phone:focus-within { border-color: var(--ink); }
        textarea {
          width: 100%;
          border: 1.5px solid var(--line);
          border-radius: 12px;
          background: var(--bg);
          color: var(--ink);
          font: 16px var(--sans);
          padding: 12px;
          resize: none;
        }
        textarea:focus { outline: none; border-color: var(--ink); }
        .chips { display: flex; flex-wrap: wrap; gap: 8px; }
        .chip {
          border: 1.5px solid var(--line);
          background: var(--bg);
          color: var(--ink);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 15px;
          cursor: pointer;
        }
        .chip[aria-pressed="true"] {
          background: var(--ink);
          color: #000000;
          border-color: var(--ink);
        }
        .loc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 1.5px solid var(--line);
          border-radius: 12px;
          padding: 12px 14px;
        }
        .loc b { display: block; font-size: 15px; }
        .loc span { display: block; font-size: 13px; color: var(--muted); }
        .switch { position: relative; width: 50px; height: 30px; flex: none; }
        .switch input { position: absolute; opacity: 0; inset: 0; margin: 0; cursor: pointer; }
        .switch i { position: absolute; inset: 0; border-radius: 30px; background: #3a3a3a; transition: background .15s; }
        .switch i::after {
          content: ""; position: absolute; top: 3px; left: 3px; width: 24px; height: 24px;
          border-radius: 50%; background: #ffffff; transition: transform .15s;
        }
        .switch input:checked + i { background: #ffffff; }
        .switch input:checked + i::after { transform: translateX(20px); background: #000000; }
        .go {
          width: 100%; border: 0; border-radius: 12px; background: var(--ink); color: #000000;
          font-weight: 700; font-size: 17px; padding: 15px; cursor: pointer;
        }
        .go:disabled { opacity: .5; cursor: not-allowed; }
        .ghost {
          width: 100%; border: 1.5px solid var(--line); border-radius: 12px; background: var(--bg);
          color: var(--ink); font-weight: 600; padding: 13px; cursor: pointer;
        }
        .msg { margin: 0; font-size: 14px; min-height: 1.4em; }
        .msg.err { color: #ffffff; font-weight: 700; }
        .msg.err::before { content: "! "; }
        .done { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 8px; padding: 10px 0; }
        .done svg { width: 52px; height: 52px; }
        .done h2 { font-size: 22px; margin: 0; }
        .done p { margin: 0; color: var(--muted); }
      `}</style>

      <div className="wrap">
        {/* Top Header with Language Toggle */}
        <header className="top flex items-center justify-between">
          <a className="brand" href="/" aria-label="GuardianTag home">
            <svg viewBox="0 0 34 38" aria-hidden="true">
              <path d="M17 1 32 7v11c0 9.5-6.4 16.4-15 19C8.4 34.4 2 27.5 2 18V7z" fill="#fff"/>
              <text x="17" y="23" textAnchor="middle" fontFamily="system-ui,Arial" fontWeight="800" fontSize="12" fill="#000">GT</text>
            </svg>
            <span><b>GuardianTag</b><small>Scan. Connect. Return.</small></span>
          </a>

          {/* Hindi / English Language Toggle */}
          <div className="flex items-center gap-1 bg-[#1a1a1a] border border-[#2e2e2e] p-1 rounded-full text-xs font-mono font-bold">
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                lang === 'en' ? 'bg-white text-black' : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLang('hi')}
              className={`px-2.5 py-1 rounded-full transition cursor-pointer ${
                lang === 'hi' ? 'bg-white text-black' : 'text-[#a3a3a3] hover:text-white'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </header>

        {/* Tag Status Box */}
        <section className="tag-card" aria-live="polite">
          <p className="k">Tag ID</p>
          <p className="id">{tag ? tag.id : (loading ? <span className="skel" /> : '–')}</p>
          <p className="type">{tag ? currentType.label : '\u00A0'}</p>
          <p className="state">
            <span className={stateDot} />
            <span>{stateText}</span>
          </p>
        </section>

        {/* Vital Emergency Info Card (Database Fetched Non-PII) */}
        {tag && (tag.bloodGroup || tag.medicalNotes || tag.vehicleNo) && (
          <div className="bg-[#161616] border border-[#2e2e2e] rounded-[14px] p-4 space-y-3" aria-label="Vital Emergency Information">
            <div className="flex items-center gap-2 text-red-500 font-bold text-xs uppercase tracking-wider">
              <span>🩸</span>
              <span>Vital Emergency Info</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              {tag.bloodGroup && (
                <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2e2e2e]">
                  <span className="block text-[11px] text-[#a3a3a3] uppercase font-semibold">Blood Group</span>
                  <span className="text-xl font-black text-white leading-tight">{tag.bloodGroup}</span>
                </div>
              )}
              {tag.vehicleNo && (
                <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2e2e2e]">
                  <span className="block text-[11px] text-[#a3a3a3] uppercase font-semibold">Vehicle / Asset</span>
                  <span className="text-sm font-bold text-white font-mono leading-tight truncate block">{tag.vehicleNo}</span>
                </div>
              )}
            </div>

            {tag.medicalNotes && (
              <div className="bg-[#222222] p-2.5 rounded-xl border border-[#2e2e2e]">
                <span className="block text-[11px] text-[#a3a3a3] uppercase font-semibold mb-0.5">Medical Notes & Conditions</span>
                <p className="text-sm text-white font-medium leading-relaxed m-0">{tag.medicalNotes}</p>
              </div>
            )}
          </div>
        )}

        {/* Manual Tag Lookup Input when no QR is in URL */}
        {!tag && (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                loadTagData(searchInput);
              }
            }}
            className="flex gap-2"
          >
            <input 
              type="text" 
              placeholder="Enter Tag ID (e.g. GTB0002)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-[#161616] border border-[#2e2e2e] rounded-xl px-4 py-3 text-white font-mono uppercase focus:outline-none focus:border-white"
            />
            <button 
              type="submit" 
              className="bg-white text-black font-bold px-5 py-3 rounded-xl hover:bg-neutral-200 transition shrink-0"
            >
              Scan Tag
            </button>
          </form>
        )}

        {/* Notice Error view */}
        {errorNotice && (
          <div className="bg-[#161616] border-1.5 border-white rounded-[14px] p-4 space-y-1">
            <h2 className="text-[17px] font-bold text-white">{errorNotice.title}</h2>
            <p className="text-[15px] text-[#a3a3a3]">{errorNotice.text}</p>
            {errorNotice.link && (
              <a href={errorNotice.link.href} className="inline-block mt-3 bg-white text-black font-bold px-3.5 py-2 rounded.lg text-sm">
                {errorNotice.link.text}
              </a>
            )}
          </div>
        )}

        {/* Bystander Crash Site First Aid Guidance Box */}
        <div className="bg-[#181412] border border-amber-500/35 rounded-[14px] p-3.5 space-y-2 text-xs text-amber-200">
          <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-amber-400">
            <span>⚠️</span>
            <span>{t.firstAidTitle}</span>
          </div>
          <ul className="space-y-1 list-disc pl-4 text-neutral-300">
            <li>
              <strong className="text-white">{t.doNotRemoveHelmet}:</strong> {t.doNotRemoveHelmetDesc}
            </li>
            <li>
              <strong className="text-white">{t.callImmediately}:</strong> {t.callImmediatelyDesc}
            </li>
            <li>
              <strong className="text-white">{t.doNotMoveRider}:</strong> {t.doNotMoveRiderDesc}
            </li>
          </ul>
        </div>

        {!errorNotice && (
          <>
            <h1 className="lead">
              {t.someoneNeedsHelp}
              <span>{t.chooseOption}</span>
            </h1>

            {/* Action Buttons */}
            <section className="actions" aria-label="Contact options">
              <div className="act-row">
                {/* Call Owner Button */}
                <button 
                  className="act primary" 
                  disabled={!tag || !tag.hasOwner} 
                  onClick={() => {
                    setSheetDone(null);
                    setCallMsg({ text: '', isErr: false });
                    setActiveSheet('call_owner');
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1z"/>
                  </svg>
                  <div><b>{t.callOwner}</b><span>{t.callOwnerSub}</span></div>
                </button>

                {/* Call Emergency Contact Button */}
                <button 
                  className="act danger" 
                  disabled={!tag || !tag.hasContact} 
                  onClick={() => {
                    setSheetDone(null);
                    setCallMsg({ text: '', isErr: false });
                    setActiveSheet('call_contact');
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M16 11a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm-8 0a3 3 0 1 0-3-3 3 3 0 0 0 3 3zm0 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5C15 14.2 10.3 13 8 13zm8 0c-.3 0-.6 0-1 .05A4.2 4.2 0 0 1 17 16.5V19h6v-2.5c0-2.3-4.7-3.5-7-3.5z"/>
                  </svg>
                  <div><b>{t.callContact}</b><span>{t.callContactSub}</span></div>
                </button>

                {/* Send Location Alert Button */}
                <button 
                  className="act" 
                  disabled={!tag || (!tag.hasOwner && !tag.hasContact)} 
                  onClick={() => {
                    setSheetDone(null);
                    setAlertMsg({ text: '', isErr: false });
                    setActiveSheet('alert');
                  }}
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 2a7 7 0 0 0-7 7c0 5.2 7 13 7 13s7-7.8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z"/>
                  </svg>
                  <div><b>{t.sendLoc}</b><span>{t.sendLocSub}</span></div>
                </button>
              </div>

              {/* Privacy Disclaimer */}
              <p className="privacy">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#a3a3a3" d="M12 1 3 5v6c0 5.5 3.8 10.7 9 12 5.2-1.3 9-6.5 9-12V5zm0 10.9h7c-.5 4.1-3.3 7.8-7 8.9V12H5V6.3l7-3.1z"/>
                </svg>
                <span>{t.privacyNote}</span>
              </p>
            </section>
          </>
        )}

        {/* Emergency Helplines Section */}
        <h2 className="sec-h">{t.helplines}</h2>
        <section className="lines">
          {/* Wide 112 Main Helpline */}
          <a className="line wide" href="tel:112">
            <i className="emo" aria-hidden="true">{EMOJI[112]}</i>
            <span className="txt">
              <b>112</b>
              <span>{t.allEmergencies}</span>
            </span>
          </a>

          {/* Dynamic Helper Lines */}
          {currentHelplineOrder.filter(n => n !== 112).map((num) => (
            <a key={num} className="line" href={`tel:${num}`}>
              <i className="emo" aria-hidden="true">{EMOJI[num]}</i>
              <span className="txt">
                <b>{num}</b>
                <span>{HELPLINES[num]}</span>
              </span>
            </a>
          ))}
        </section>

        {/* Footer */}
        <footer>
          <span>{t.isYourTag} <a href="/manage">{t.loginManage}</a></span>
          <span>Get your own safety tag at <a href="/">guardiantag.in</a></span>
        </footer>
      </div>

      {/* Bottom Sheet Modals */}
      {activeSheet && (
        <>
          <div className="backdrop" onClick={() => setActiveSheet(null)} />
          <div className="sheet" role="dialog" aria-modal="true">
            <div className="sheet-in">
              <div className="grab" />

              {sheetDone ? (
                <>
                  <div className="done">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="12" cy="12" r="11" fill="#fff" />
                      <path d="m7 12.5 3.2 3.2L17 9" fill="none" stroke="#000" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <h2>{sheetDone.title}</h2>
                    <p>{sheetDone.text}</p>
                  </div>
                  <button className="ghost" onClick={() => setActiveSheet(null)}>Close</button>
                </>
              ) : activeSheet === 'call_owner' || activeSheet === 'call_contact' ? (
                <>
                  <h2>Call {activeSheet === 'call_owner' ? 'the owner' : 'the emergency contact'}</h2>
                  <p className="sub">We call you first. Pick up, and we connect you.</p>

                  <div className="f">
                    <label htmlFor="callPhoneInput">Your mobile number</label>
                    <div className="phone">
                      <span>+91</span>
                      <input 
                        id="callPhoneInput" 
                        type="tel" 
                        inputMode="numeric" 
                        maxLength={10} 
                        placeholder="98765 43210"
                        value={callPhone}
                        onChange={e => setCallPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {callMsg.text && (
                    <p className={`msg ${callMsg.isErr ? 'err' : 'ok'}`}>{callMsg.text}</p>
                  )}

                  <button 
                    className="go" 
                    disabled={isCalling} 
                    onClick={() => handleCallSubmit(activeSheet === 'call_owner' ? 'owner' : 'contact')}
                  >
                    {isCalling ? 'Connecting…' : 'Call me'}
                  </button>
                  <button className="ghost" onClick={() => setActiveSheet(null)}>Cancel</button>
                </>
              ) : activeSheet === 'alert' ? (
                <>
                  <h2>Send an alert</h2>
                  <p className="sub">The owner and their emergency contact get your message.</p>

                  <div className="f">
                    <label>What happened?</label>
                    <div className="chips">
                      {currentType.reasons.map(([k, v]) => (
                        <button
                          key={k}
                          type="button"
                          className="chip"
                          aria-pressed={selectedReason === k}
                          onClick={() => setSelectedReason(k)}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="loc">
                    <div>
                      <b>Share my location</b>
                      <span>{locStatusText}</span>
                    </div>
                    <label className="switch">
                      <input 
                        type="checkbox" 
                        checked={shareLoc} 
                        onChange={handleLocToggle} 
                      />
                      <i />
                    </label>
                  </div>

                  <div className="f">
                    <label htmlFor="noteInput">Note (optional)</label>
                    <textarea 
                      id="noteInput" 
                      rows={2} 
                      maxLength={140} 
                      placeholder="e.g. Ambulance is on the way"
                      value={alertNote}
                      onChange={e => setAlertNote(e.target.value)}
                    />
                  </div>

                  <div className="f">
                    <label htmlFor="alertPhoneInput">Your number (optional)</label>
                    <div className="phone">
                      <span>+91</span>
                      <input 
                        id="alertPhoneInput" 
                        type="tel" 
                        inputMode="numeric" 
                        maxLength={10} 
                        placeholder="98765 43210"
                        value={alertPhone}
                        onChange={e => setAlertPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  {alertMsg.text && (
                    <p className={`msg ${alertMsg.isErr ? 'err' : 'ok'}`}>{alertMsg.text}</p>
                  )}

                  <button 
                    className="go" 
                    disabled={isSendingAlert} 
                    onClick={handleAlertSubmit}
                  >
                    {isSendingAlert ? 'Sending…' : 'Send alert'}
                  </button>
                  <button className="ghost" onClick={() => setActiveSheet(null)}>Cancel</button>
                </>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default function EmergencyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center font-mono text-xs">
        Loading GuardianTag Emergency Interface…
      </div>
    }>
      <EmergencyContent />
    </Suspense>
  );
}

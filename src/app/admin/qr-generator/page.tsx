'use client';

import React, { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AdminGatekeeper from '@/components/AdminGatekeeper';
import JSZip from 'jszip';
import qrcode from 'qrcode-generator';

interface BatchItem {
  id: string;
  token: string;
  prefix: string;
  format: string;
  url: string;
}

interface TemplateRecord {
  img: HTMLImageElement;
  src: string;
  w: number;
  h: number;
  box: { x: number; y: number; w: number; h: number };
  on: boolean;
}

const PREVIEW_LIMIT = 200;
const PREVIEW_DPI = 220;
const EXPORT_DPI = 300;

const FORMATS: Record<string, { name: string; w: number; h: number; r: number; z: number; bike: boolean }> = {
  card: { name: 'PVC card', w: 85.6, h: 54, r: 3.2, z: 1.25, bike: true },
  keychain: { name: 'Keychain', w: 30, h: 45, r: 4, z: 2.2, bike: true },
  small: { name: 'Small sticker', w: 30, h: 30, r: 2, z: 2.2, bike: true },
  large: { name: 'Large sticker', w: 75, h: 75, r: 4, z: 1.35, bike: true },
  standard: { name: 'Standard tag', w: 50, h: 62, r: 3, z: 1.6, bike: false },
};

const niceName = (f: (typeof FORMATS)[keyof typeof FORMATS]) => (f.name === 'PVC card' ? 'PVC card' : f.name.toLowerCase());
const TYPE_LABEL: Record<string, string> = {
  GTB: 'Biker safety tag',
  GTK: 'Kids safety tag',
  GTT: 'Traveller safety tag',
  GTU: 'Safety tag',
};

const STACK: Record<string, { pad: number; hole: boolean; head: number; gap: number; id: number; foot: number }> = {
  keychain: { pad: 2.2, hole: true, head: 2.6, gap: 0.8, id: 3.2, foot: 0 },
  small: { pad: 1.8, hole: false, head: 0, gap: 0, id: 3.0, foot: 0 },
  large: { pad: 4, hole: false, head: 5.2, gap: 1.5, id: 5.4, foot: 2.6 },
  standard: { pad: 3, hole: false, head: 3.6, gap: 1, id: 4.2, foot: 2.2 },
};

const F_BRAND = 'Archivo, "Helvetica Neue", Arial, sans-serif';
const F_MONO = '"JetBrains Mono", "IBM Plex Mono", Menlo, Consolas, monospace';
const F_BODY = '"Source Sans 3", "Segoe UI", Arial, sans-serif';

/* Drawing Helpers */
function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function text(
  ctx: CanvasRenderingContext2D,
  str: string,
  x: number,
  y: number,
  sizeMm: number,
  weight: string | number,
  family: string,
  align: CanvasTextAlign,
  maxW?: number
) {
  let size = sizeMm;
  ctx.font = `${weight} ${size}px ${family}`;
  if (maxW) {
    const w = ctx.measureText(str).width;
    if (w > maxW) {
      size = (size * maxW) / w;
      ctx.font = `${weight} ${size}px ${family}`;
    }
  }
  ctx.textAlign = align;
  ctx.textBaseline = 'middle';
  ctx.fillText(str, x, y);
  return size;
}

function drawQR(ctx: CanvasRenderingContext2D, str: string, x: number, y: number, s: number) {
  const qr = qrcode(0, 'H');
  qr.addData(str);
  qr.make();
  const count = qr.getModuleCount();
  const quiet = 2;
  const m = s / (count + quiet * 2);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x, y, s, s);
  ctx.fillStyle = '#000';
  for (let r = 0; r < count; r++) {
    for (let c = 0; c < count; c++) {
      if (qr.isDark(r, c)) {
        ctx.fillRect(x + (c + quiet) * m, y + (r + quiet) * m, m + 0.02, m + 0.02);
      }
    }
  }
  // Center GT badge
  const box = count * m * 0.24;
  const bx = x + (s - box) / 2;
  const by = y + (s - box) / 2;
  ctx.fillStyle = '#fff';
  roundRect(ctx, bx, by, box, box, box * 0.18);
  ctx.fill();
  ctx.fillStyle = '#000';
  text(ctx, 'GT', x + s / 2, y + s / 2 + box * 0.03, box * 0.52, 800, 'Archivo, "Arial Black", Arial, sans-serif', 'center');
}

function sosChip(ctx: CanvasRenderingContext2D, xRight: number, yMid: number, h: number) {
  ctx.font = `800 ${h * 0.62}px Archivo, Arial, sans-serif`;
  const w = ctx.measureText('SOS').width + h * 0.7;
  ctx.fillStyle = '#000';
  roundRect(ctx, xRight - w, yMid - h / 2, w, h, h * 0.22);
  ctx.fill();
  ctx.fillStyle = '#fff';
  text(ctx, 'SOS', xRight - w / 2, yMid + h * 0.03, h * 0.62, 800, 'Archivo, Arial, sans-serif', 'center');
  ctx.fillStyle = '#000';
  return w;
}

function layoutCard(ctx: CanvasRenderingContext2D, item: BatchItem, f: (typeof FORMATS)['card'], showId: boolean) {
  const p = 4;
  const q = f.h - p * 2;
  drawQR(ctx, item.url, p, p, q);
  const x0 = p + q + 3.5;
  const colW = f.w - x0 - p;
  ctx.fillStyle = '#000';
  text(ctx, 'GuardianTag', x0, p + 3.2, 5, 800, F_BRAND, 'left', colW);
  text(ctx, TYPE_LABEL[item.prefix].toUpperCase(), x0, p + 8.2, 2.1, 700, F_BODY, 'left', colW);
  ctx.save();
  const chipW = sosChip(ctx, x0 + colW, p + 14.6, 4.4);
  ctx.restore();
  text(ctx, 'Emergency? Scan the code', x0, p + 14.6, 2, 600, F_BODY, 'left', colW - chipW - 1.5);
  ctx.fillRect(x0, p + 19.5, colW, 0.3);
  if (showId) {
    text(ctx, 'TAG ID', x0, f.h - p - 13, 2, 600, F_MONO, 'left');
    text(ctx, item.id, x0, f.h - p - 8, 5.6, 600, F_MONO, 'left', colW);
  }
  text(ctx, 'guardiantag.in', x0, f.h - p - 1.6, 2.2, 600, F_BODY, 'left', colW);
}

function layoutStacked(
  ctx: CanvasRenderingContext2D,
  item: BatchItem,
  f: (typeof FORMATS)[keyof typeof FORMATS],
  o: (typeof STACK)[keyof typeof STACK],
  showId: boolean
) {
  const p = o.pad;
  let y = p;
  ctx.fillStyle = '#000';
  if (o.hole) {
    const r = 2.2;
    const cy = p + r;
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(f.w / 2, cy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    ctx.lineWidth = 0.35;
    ctx.strokeStyle = '#000';
    ctx.beginPath();
    ctx.arc(f.w / 2, cy, r + 0.6, 0, Math.PI * 2);
    ctx.stroke();
    y = cy + r + 1.6;
  }
  if (o.head) {
    const mid = y + o.head * 0.55;
    const chipW = sosChip(ctx, f.w - p, mid, o.head * 1.25);
    text(ctx, 'GuardianTag', p, mid, o.head, 800, F_BRAND, 'left', f.w - p * 2 - chipW - 1);
    y += o.head * 1.25 + o.gap;
  }
  const idH = showId ? o.id * 1.3 : 0;
  const footH = o.foot ? o.foot * 1.5 : 0;
  const bottom = idH + footH + p;
  const s = Math.min(f.w - p * 2, f.h - y - bottom);
  drawQR(ctx, item.url, (f.w - s) / 2, y, s);
  y += s;
  ctx.fillStyle = '#000';
  if (showId) {
    text(ctx, item.id, f.w / 2, y + idH / 2 + 0.2, o.id, 600, F_MONO, 'center', f.w - p * 2);
    y += idH;
  }
  if (o.foot) {
    text(ctx, 'SCAN IN EMERGENCY', f.w / 2, y + footH / 2, o.foot, 700, F_BODY, 'center', f.w - p * 2);
  }
}

function renderLabel(item: BatchItem, key: string, dpi: number, showId: boolean): HTMLCanvasElement {
  const f = FORMATS[key];
  const k = dpi / 25.4;
  const c = document.createElement('canvas');
  c.width = Math.round(f.w * k);
  c.height = Math.round(f.h * k);
  const ctx = c.getContext('2d')!;
  ctx.scale(k, k);
  ctx.fillStyle = '#fff';
  roundRect(ctx, 0, 0, f.w, f.h, f.r);
  ctx.fill();
  if (key === 'card') layoutCard(ctx, item, f, showId);
  else layoutStacked(ctx, item, f, STACK[key], showId);
  return c;
}

/* Template Auto-Detection */
function detectBoxData(d: Uint8ClampedArray, w: number, h: number) {
  const white = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], a = d[i * 4 + 3];
    white[i] = a > 200 && r > 225 && g > 225 && b > 225 ? 1 : 0;
  }
  const seen = new Uint8Array(w * h);
  const stack = new Int32Array(w * h);
  let best: { x: number; y: number; w: number; h: number; area: number } | null = null;
  for (let start = 0; start < w * h; start++) {
    if (!white[start] || seen[start]) continue;
    let sp = 0;
    stack[sp++] = start;
    seen[start] = 1;
    let minx = w, miny = h, maxx = 0, maxy = 0, count = 0, edge = false;
    while (sp) {
      const p = stack[--sp];
      const x = p % w;
      const y = (p / w) | 0;
      count++;
      if (x < minx) minx = x;
      if (x > maxx) maxx = x;
      if (y < miny) miny = y;
      if (y > maxy) maxy = y;
      if (x === 0 || y === 0 || x === w - 1 || y === h - 1) edge = true;
      if (x > 0 && white[p - 1] && !seen[p - 1]) { seen[p - 1] = 1; stack[sp++] = p - 1; }
      if (x < w - 1 && white[p + 1] && !seen[p + 1]) { seen[p + 1] = 1; stack[sp++] = p + 1; }
      if (y > 0 && white[p - w] && !seen[p - w]) { seen[p - w] = 1; stack[sp++] = p - w; }
      if (y < h - 1 && white[p + w] && !seen[p + w]) { seen[p + w] = 1; stack[sp++] = p + w; }
    }
    if (edge) continue;
    const bw = maxx - minx + 1;
    const bh = maxy - miny + 1;
    const area = bw * bh;
    const aspect = bw / bh;
    if (area < 0.004 * w * h || aspect < 0.6 || aspect > 1.6 || count / area < 0.6) continue;
    if (!best || area > best.area) best = { x: minx, y: miny, w: bw, h: bh, area };
  }
  if (!best) return null;
  const rowFrac = (y: number, x0: number, x1: number) => {
    let c = 0;
    for (let x = x0; x <= x1; x++) c += white[y * w + x];
    return c / (x1 - x0 + 1);
  };
  const colFrac = (x: number, y0: number, y1: number) => {
    let c = 0;
    for (let y = y0; y <= y1; y++) c += white[y * w + x];
    return c / (y1 - y0 + 1);
  };
  let x = best.x, y = best.y, x2 = best.x + best.w - 1, y2 = best.y + best.h - 1;
  const look = Math.max(3, Math.round(Math.min(best.w, best.h) * 0.12));
  let grew = true;
  while (grew) {
    grew = false;
    for (let k = 1; k <= look && y - k >= 0; k++) if (rowFrac(y - k, x, x2) > 0.5) { y -= k; grew = true; break; }
    for (let k = 1; k <= look && y2 + k < h; k++) if (rowFrac(y2 + k, x, x2) > 0.5) { y2 += k; grew = true; break; }
    for (let k = 1; k <= look && x - k >= 0; k++) if (colFrac(x - k, y, y2) > 0.5) { x -= k; grew = true; break; }
    for (let k = 1; k <= look && x2 + k < w; k++) if (colFrac(x2 + k, y, y2) > 0.5) { x2 += k; grew = true; break; }
  }
  return { x, y, w: x2 - x + 1, h: y2 - y + 1 };
}

function detectBox(img: HTMLImageElement) {
  const s = Math.min(1, 900 / img.width);
  const w = Math.round(img.width * s);
  const h = Math.round(img.height * s);
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  const b = detectBoxData(ctx.getImageData(0, 0, w, h).data, w, h);
  if (!b) return null;
  return { x: Math.round(b.x / s), y: Math.round(b.y / s), w: Math.round(b.w / s), h: Math.round(b.h / s) };
}

export default function AdminQrGeneratorPage() {
  const [tagType, setTagType] = useState<string>('GTB');
  const [format, setFormat] = useState<string>('card');
  const [useTpl, setUseTpl] = useState<boolean>(false);
  const [tplMsg, setTplMsg] = useState<string>('No template loaded yet.');
  const [boxInputs, setBoxInputs] = useState<{ bx: number; by: number; bw: number; bh: number }>({ bx: 0, by: 0, bw: 1, bh: 1 });

  const [fromNo, setFromNo] = useState<number>(1);
  const [toNo, setToNo] = useState<number>(12);
  const [urlPattern, setUrlPattern] = useState<string>('http://localhost:3000/tag/{id}');
  const [showId, setShowId] = useState<boolean>(true);

  const [err, setErr] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  const [batch, setBatch] = useState<BatchItem[]>([]);

  // Per-product template storage map
  const [tpls, setTpls] = useState<Record<string, TemplateRecord>>({});
  
  // Terminal states
  const [clock, setClock] = useState<string>('--:--:--');
  const [consoleLogs, setConsoleLogs] = useState<Array<{ id: number; text: string; type: string; isProgress?: boolean }>>([]);
  const [bootText, setBootText] = useState<string>('');
  
  const rainRef = useRef<HTMLCanvasElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const logCounter = useRef<number>(0);

  const activeFormat = tagType === 'GTB' ? format : 'standard';

  const pad = (n: number) => String(n).padStart(4, '0');
  const makeId = (prefix: string, n: number) => prefix + pad(n);
  const randomToken = (len = 16) => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    const buf = new Uint32Array(len);
    if (typeof window !== 'undefined') crypto.getRandomValues(buf);
    let out = '';
    for (const v of buf) out += chars[v % chars.length];
    return out;
  };

  const stamp = () => new Date().toLocaleTimeString('en-GB', { hour12: false });

  const appendLog = (textStr: string, type: string = 'res', isProgress: boolean = false) => {
    logCounter.current += 1;
    const newLog = { id: logCounter.current, text: `[${stamp()}] ${textStr}`, type, isProgress };
    setConsoleLogs((prev) => {
      let updated = [...prev];
      if (isProgress && updated.length > 0 && updated[updated.length - 1].isProgress) {
        updated[updated.length - 1] = newLog;
      } else {
        updated.push(newLog);
      }
      if (updated.length > 200) updated = updated.slice(updated.length - 200);
      return updated;
    });
  };

  const logCmd = (cmd: string) => {
    appendLog(`root@gt:~$ ${cmd}`, 'cmd');
  };

  // Matrix Rain Effect
  useEffect(() => {
    const c = rainRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;

    const chars = 'GTBKU0123456789ABCDEF<>/{}#$%@!=+*';
    const fs = 16;
    let cols = 0;
    let drops: number[] = [];

    const size = () => {
      c.width = window.innerWidth;
      c.height = window.innerHeight;
      cols = Math.ceil(c.width / fs);
      drops = Array.from({ length: cols }, () => Math.random() * -c.height / fs);
    };

    size();
    window.addEventListener('resize', size);

    const interval = setInterval(() => {
      ctx.fillStyle = 'rgba(3,6,3,0.14)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = `${fs}px VT323, monospace`;
      for (let i = 0; i < cols; i++) {
        const ch = chars[(Math.random() * chars.length) | 0];
        const y = drops[i] * fs;
        ctx.fillStyle = Math.random() > 0.975 ? '#c6ffd6' : '#39ff7a';
        ctx.fillText(ch, i * fs, y);
        if (y > c.height && Math.random() > 0.975) drops[i] = 0;
        drops[i] += 1;
      }
    }, 55);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', size);
    };
  }, []);

  // Clock Ticker & Boot Log
  useEffect(() => {
    const timer = setInterval(() => {
      setClock(stamp());
    }, 1000);

    const bootLines = [
      '[ OK ] qrcode engine ........ loaded (ECC level H)',
      '[ OK ] token rng ............ crypto.getRandomValues',
      '[ OK ] products ............. card · keychain · small · large',
      '[ OK ] templates in cache ... loaded',
      '[ >> ] id format ............ GTB0001 → GTB9999',
      '[ !! ] save the CSV after every batch. tokens are random.',
      '[ OK ] ready. awaiting input',
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let textAccum = '';

    const bootInterval = setInterval(() => {
      if (lineIdx >= bootLines.length) {
        clearInterval(bootInterval);
        return;
      }
      const currentLine = bootLines[lineIdx];
      charIdx += 4;
      if (charIdx >= currentLine.length) {
        textAccum += currentLine + '\n';
        lineIdx += 1;
        charIdx = 0;
      } else {
        setBootText(textAccum + currentLine.slice(0, charIdx));
        return;
      }
      setBootText(textAccum);
    }, 50);

    appendLog('session started. pick a product, set --from / --to, hit Generate.', 'info');

    return () => {
      clearInterval(timer);
      clearInterval(bootInterval);
    };
  }, []);

  // Auto-scroll console
  useEffect(() => {
    if (consoleRef.current) {
      consoleRef.current.scrollTop = consoleRef.current.scrollHeight;
    }
  }, [consoleLogs]);

  const readRange = (): { error: string; from?: undefined; to?: undefined } | { error: null; from: number; to: number } => {
    if (!Number.isInteger(fromNo) || fromNo < 1) return { error: 'Start number must be 1 or more.' };
    if (!Number.isInteger(toNo) || toNo < fromNo) return { error: 'End number must be the same as or bigger than start number.' };
    if (toNo - fromNo + 1 > 5000) return { error: 'Max 5000 tags per batch.' };
    return { error: null, from: fromNo, to: toNo };
  };

  const rangeText = () => {
    const r = readRange();
    const f = FORMATS[activeFormat];
    if (r.error || r.from === undefined || r.to === undefined) return '–';
    return `${makeId(tagType, r.from)} → ${makeId(tagType, r.to)} · ${r.to - r.from + 1} ${niceName(f)}s`;
  };

  const syncTemplateUI = (targetFormat: string = activeFormat, currentTpls: Record<string, TemplateRecord> = tpls) => {
    const t = currentTpls[targetFormat];
    const f = FORMATS[targetFormat];
    const lower = niceName(f);
    setUseTpl(!!(t && t.on));
    if (t) {
      setBoxInputs({ bx: t.box.x, by: t.box.y, bw: t.box.w, bh: t.box.h });
      setTplMsg(`Template ${t.w} × ${t.h} px. QR box at ${t.box.x}, ${t.box.y} (${t.box.w} × ${t.box.h} px).`);
    } else {
      setBoxInputs({ bx: 0, by: 0, bw: 1, bh: 1 });
      setTplMsg(`No ${lower} template loaded yet. Leave a white square in your design where the QR should go.`);
    }
  };

  const saveTemplateStorage = (key: string, record: TemplateRecord) => {
    try {
      localStorage.setItem('gt_tpl_' + key, JSON.stringify({ src: record.src, box: record.box, on: record.on }));
    } catch {}
  };

  const setTemplate = (key: string, img: HTMLImageElement, src: string, box: { x: number; y: number; w: number; h: number }, on: boolean = true) => {
    const newRecord: TemplateRecord = { img, src, w: img.width, h: img.height, box, on };
    setTpls((prev) => {
      const updated = { ...prev, [key]: newRecord };
      saveTemplateStorage(key, newRecord);
      if (key === activeFormat) syncTemplateUI(key, updated);
      return updated;
    });
  };

  const loadTemplateFile = async (file: File) => {
    const key = activeFormat;
    try {
      setTplMsg('Reading template…');
      const r = new FileReader();
      const src: string = await new Promise((res, rej) => {
        r.onload = () => res(r.result as string);
        r.onerror = rej;
        r.readAsDataURL(file);
      });
      let img = new Image();
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = src;
      });

      let box = detectBox(img);
      if (key === 'card' && box && img.height > img.width * 1.2) {
        const half = Math.round(img.height / 2);
        const top = box.y >= half ? half : 0;
        const c = document.createElement('canvas');
        c.width = img.width;
        c.height = img.height - half;
        c.getContext('2d')!.drawImage(img, 0, top, img.width, c.height, 0, 0, img.width, c.height);
        const croppedSrc = c.toDataURL('image/png');
        img = new Image();
        await new Promise((r) => {
          img.onload = r;
          img.src = croppedSrc;
        });
        box = detectBox(img);
      }
      if (!box) {
        const s = Math.round(Math.min(img.width, img.height) * 0.55);
        setTemplate(key, img, src, { x: Math.round((img.width - s) / 2), y: Math.round((img.height - s) / 2), w: s, h: s });
        setTplMsg("Couldn't find a white QR box. Enter X, Y, W, H manually.");
        appendLog(`tpl: Couldn't find a white QR box for ${key}. Use manual X,Y,W,H.`, 'warn');
      } else {
        setTemplate(key, img, src, box);
        appendLog(`tpl: Loaded template for ${key} (${img.width}x${img.height}px)`, 'info');
      }
      generate();
    } catch (e: any) {
      setTplMsg("Couldn't read that file. " + (e.message || 'Try a PNG export of the design.'));
      appendLog(`tpl error: ${e.message || 'File read error'}`, 'warn');
    }
  };

  const renderTemplate = (item: BatchItem, tRecord: TemplateRecord, scale: number, printId: boolean) => {
    const c = document.createElement('canvas');
    c.width = Math.round(tRecord.w * scale);
    c.height = Math.round(tRecord.h * scale);
    const ctx = c.getContext('2d')!;
    ctx.drawImage(tRecord.img, 0, 0, c.width, c.height);
    ctx.scale(scale, scale);
    const b = tRecord.box;
    ctx.fillStyle = '#fff';
    ctx.fillRect(b.x, b.y, b.w, b.h);
    const idH = printId ? b.h * 0.13 : 0;
    const s = Math.min(b.w, b.h - idH);
    drawQR(ctx, item.url, b.x + (b.w - s) / 2, b.y, s);
    if (printId) {
      ctx.fillStyle = '#000';
      text(ctx, item.id, b.x + b.w / 2, b.y + s + idH * 0.45, idH * 0.8, 600, F_MONO, 'center', b.w * 0.9);
    }
    return c;
  };

  const renderAny = (item: BatchItem, key: string, forExport: boolean, printId: boolean) => {
    const t = tpls[key];
    if (t && t.on) {
      const previewScale = Math.min(1, 900 / t.w);
      return renderTemplate(item, t, forExport ? 1 : previewScale, printId);
    }
    return renderLabel(item, key, forExport ? EXPORT_DPI : PREVIEW_DPI, printId);
  };

  const generate = () => {
    const r = readRange();
    if (r.error || r.from === undefined || r.to === undefined) {
      setErr(r.error || 'Invalid range');
      if (r.error) appendLog(`!! ${r.error}`, 'warn');
      return;
    }
    setErr(null);
    const pattern = urlPattern.trim();
    if (!pattern) {
      setErr('Add a QR link pattern first.');
      appendLog('!! Add a QR link pattern first.', 'warn');
      return;
    }

    const key = activeFormat;
    const f = FORMATS[key];
    const isUsingTpl = !!(tpls[key] && tpls[key].on);

    logCmd(`generate --type ${tagType} --product ${key} --from ${r.from} --to ${r.to}${isUsingTpl ? ' --template' : ''}`);

    const newBatch: BatchItem[] = [];
    for (let n = r.from; n <= r.to; n++) {
      const id = makeId(tagType, n);
      const token = randomToken();
      newBatch.push({ id, token, prefix: tagType, format: key, url: pattern.replaceAll('{id}', id).replaceAll('{token}', token) });
    }
    setBatch(newBatch);

    if (sheetRef.current) {
      sheetRef.current.innerHTML = '';
      newBatch.slice(0, PREVIEW_LIMIT).forEach((item) => {
        const c = renderAny(item, key, false, showId);
        c.className = 'label';
        c.style.setProperty('--w', String(f.w));
        c.style.setProperty('--z', String(f.z));
        c.setAttribute('role', 'img');
        c.setAttribute('aria-label', `${f.name} ${item.id}`);
        sheetRef.current?.appendChild(c);
      });
      if (newBatch.length > PREVIEW_LIMIT) {
        const m = document.createElement('div');
        m.className = 'more';
        m.textContent = `Showing first ${PREVIEW_LIMIT} of ${newBatch.length}. ZIP and CSV include all of them.`;
        sheetRef.current.appendChild(m);
      }
    }

    const msg = `${newBatch.length} ${niceName(f)}s ready (${f.w} × ${f.h} mm). Save CSV so tokens match your sheet.`;
    setStatusText(msg);
    appendLog(`>> ${msg}`, 'res');
  };

  useEffect(() => {
    syncTemplateUI(activeFormat, tpls);
  }, [tagType, format]);

  // Load saved templates from localStorage on mount
  useEffect(() => {
    Object.keys(FORMATS).forEach((key) => {
      try {
        const saved = JSON.parse(localStorage.getItem('gt_tpl_' + key) || 'null');
        if (saved && saved.src) {
          const img = new Image();
          img.onload = () => {
            setTemplate(key, img, saved.src, saved.box, saved.on !== false);
          };
          img.src = saved.src;
        }
      } catch {}
    });
  }, []);

  const fileBase = () => {
    if (!batch.length) return 'GT_Batch';
    const f = FORMATS[batch[0].format].name.replace(/\s+/g, '-');
    return `${f}_${batch[0].id}-${batch[batch.length - 1].id}`;
  };

  const buildCSV = () => {
    const rows = [['qr_id', 'token', 'url', 'format', 'status']];
    batch.forEach((b) => rows.push([b.id, b.token, b.url, FORMATS[b.format].name, 'unregistered']));
    return rows.map((r) => r.join(',')).join('\n');
  };

  const downloadZip = async () => {
    if (!batch.length) return;
    logCmd(`export --png --zip ${fileBase()}`);
    const zip = new JSZip();
    for (let i = 0; i < batch.length; i++) {
      const c = renderAny(batch[i], batch[i].format, true, showId);
      zip.file(`${batch[i].id}.png`, c.toDataURL('image/png').split(',')[1], { base64: true });
      if (i % 25 === 0) {
        const done = i + 1;
        const total = batch.length;
        const msg = `Packing ${done} of ${total}…`;
        setStatusText(msg);
        appendLog(`packing [${'#'.repeat(Math.round(20 * done / total))}${'.'.repeat(20 - Math.round(20 * done / total))}] ${Math.round(100 * done / total)}%`, 'info', true);
        await new Promise((r) => setTimeout(r, 0));
      }
    }
    zip.file(`${fileBase()}.csv`, buildCSV());
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `GuardianTag_${fileBase()}.zip`;
    a.click();
    const finalMsg = `ZIP saved with ${batch.length} PNGs and CSV metadata.`;
    setStatusText(finalMsg);
    appendLog(`>> ${finalMsg}`, 'res');
  };

  const downloadCSV = () => {
    if (!batch.length) return;
    logCmd(`export --csv ${fileBase()}.csv`);
    const blob = new Blob([buildCSV()], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `GuardianTag_${fileBase()}.csv`;
    a.click();
    setStatusText('CSV saved. Paste it into your tags sheet.');
    appendLog('>> CSV saved. Paste it into your tags sheet.', 'res');
  };

  return (
    <AdminGatekeeper>
      <div className="min-h-screen bg-[#030603] text-[#c6ffd6] font-mono select-none relative">
        {/* Matrix Rain Canvas & CRT Scanline Overlay */}
        <canvas ref={rainRef} id="rain" className="fixed inset-0 w-full h-full z-0 opacity-16 pointer-events-none" />
        <div className="crt fixed inset-0 pointer-events-none z-50" />

        <div className="relative z-10">
          <Navbar />

          <div className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-[1280px] mx-auto w-full">
            
            {/* Header Terminal Pane */}
            <header className="top pane max-w-[1280px] mx-auto mb-5 overflow-hidden rounded-lg bg-[rgba(5,14,8,0.88)] border border-[#17361f]">
              <div className="titlebar flex items-center gap-3 px-3 py-2 border-b border-[#17361f] text-xs text-[#5d8d6a]">
                <span className="dots flex gap-1.5">
                  <i className="w-2.5 h-2.5 rounded-full bg-[#ff4d5e] inline-block" />
                  <i className="w-2.5 h-2.5 rounded-full bg-[#ffb000] inline-block" />
                  <i className="w-2.5 h-2.5 rounded-full bg-[#39ff7a] inline-block" />
                </span>
                <span className="path flex-1 text-center font-mono text-[11px] truncate">
                  root@guardiantag: ~/qr-forge — bash — 80×24
                </span>
                <span className="clock text-[#39ff7a] font-mono">{clock}</span>
              </div>

              <div className="hero grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-5 items-center">
                <div className="lg:col-span-7">
                  <p className="prompt text-xs text-[#5d8d6a] margin-0">
                    <span className="text-[#39ff7a]">root</span>@<span className="text-[#5ff4ff]">guardiantag</span>:~$ ./qr-forge --init
                  </p>
                  <h1
                    className="glitch relative text-5xl sm:text-7xl font-extrabold text-[#39ff7a] tracking-tight leading-none my-1 font-['VT323']"
                    data-text="GUARDIANTAG"
                  >
                    GUARDIANTAG
                  </h1>
                  <p className="sub text-xs sm:text-sm font-bold text-[#c6ffd6] tracking-wider uppercase">
                    QR_FORGE // SECURE TAG GENERATOR <span className="text-[#ffb000]">[GTB · GTK · GTT · GTU]</span>
                    <span className="inline-block w-2.5 h-4 bg-[#39ff7a] ml-1 animate-pulse" />
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <pre className="boot m-0 min-h-[140px] p-3 bg-black/60 border border-[#17361f] rounded text-[11px] leading-relaxed text-[#c6ffd6] font-mono whitespace-pre-wrap overflow-x-auto">
                    {bootText}
                  </pre>
                </div>
              </div>
            </header>

            {/* Layout Grid */}
            <div className="wrap max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              
              {/* Left Control Rail (4 Cols) */}
              <aside className="rail lg:col-span-4 bg-[rgba(5,14,8,0.88)] border border-[#17361f] rounded-lg sticky top-24 font-mono">
                <div className="pane-h flex justify-between items-center px-3 py-2 border-b border-[#17361f] text-xs text-[#5d8d6a] bg-[#39ff7a]/5">
                  <span>~/ <b className="text-[#39ff7a]">config.sh</b></span>
                  <span>-rwx</span>
                </div>

                <div className="rail-body p-4 space-y-4">
                  
                  {/* Tag Type Selector */}
                  <div className="field flex flex-col gap-1.5">
                    <label className="text-xs text-[#39ff7a] font-bold">
                      <span className="text-[#5d8d6a]">$ </span>--type
                    </label>
                    <select
                      value={tagType}
                      onChange={(e) => setTagType(e.target.value)}
                      className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-2 text-sm font-bold focus:outline-none focus:border-[#39ff7a] shadow-[0_0_10px_rgba(57,255,122,0.2)]"
                    >
                      <option value="GTB">GTB · Bikers</option>
                      <option value="GTK">GTK · Kids</option>
                      <option value="GTT">GTT · Travellers</option>
                      <option value="GTU">GTU · Universal</option>
                    </select>
                  </div>

                  {/* Bike Product Selector */}
                  {tagType === 'GTB' && (
                    <div className="field flex flex-col gap-1.5">
                      <label className="text-xs text-[#39ff7a] font-bold">
                        <span className="text-[#5d8d6a]">$ </span>--product
                      </label>
                      <div className="formats grid grid-cols-2 gap-2">
                        {Object.entries(FORMATS)
                          .filter(([, f]) => f.bike)
                          .map(([key, f]) => (
                            <button
                              key={key}
                              type="button"
                              onClick={() => {
                                setFormat(key);
                              }}
                              className={`fmt text-left p-2 border rounded text-xs font-bold uppercase transition cursor-pointer ${
                                format === key
                                  ? 'border-[#39ff7a] text-[#39ff7a] bg-[#39ff7a]/10 shadow-[0_0_12px_rgba(57,255,122,0.2)]'
                                  : 'border-[#17361f] text-[#c6ffd6] bg-black hover:border-[#1c8f45]'
                              }`}
                            >
                              <span>{format === key ? '[x] ' : '[ ] '}{f.name}</span>
                              <small className="block text-[10px] text-[#5d8d6a] font-normal normal-case mt-0.5">
                                {f.w} × {f.h} mm
                              </small>
                            </button>
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Custom Card Template Panel */}
                  <div className="tpl border border-dashed border-[#1c8f45] rounded p-3 bg-[#39ff7a]/5 space-y-2.5">
                    <label className="check flex items-center gap-2 text-xs text-[#c6ffd6] font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useTpl}
                        onChange={(e) => {
                          const t = tpls[activeFormat];
                          if (t) {
                            t.on = e.target.checked;
                            saveTemplateStorage(activeFormat, t);
                            setUseTpl(e.target.checked);
                          } else if (e.target.checked) {
                            setTplMsg('Choose your design file first.');
                          }
                          generate();
                        }}
                        className="accent-[#39ff7a]"
                      />
                      <span>Use my {niceName(FORMATS[activeFormat])} template</span>
                    </label>

                    <div className="field flex flex-col gap-1">
                      <label className="text-[10px] text-[#5d8d6a] font-bold">
                        {activeFormat === 'card' ? 'Back side of card (PNG, JPG)' : `${FORMATS[activeFormat].name} design (PNG, JPG)`}
                      </label>
                      <input
                        type="file"
                        accept="image/png,image/jpeg"
                        onChange={(e) => e.target.files?.[0] && loadTemplateFile(e.target.files[0])}
                        className="text-xs text-[#5d8d6a] file:mr-2 file:py-1 file:px-2 file:rounded file:border file:border-[#1c8f45] file:bg-transparent file:text-[#39ff7a] file:font-bold file:cursor-pointer"
                      />
                    </div>

                    <p className="ok text-[11px] text-[#5ff4ff] font-semibold">&gt; {tplMsg}</p>

                    <div className="box grid grid-cols-4 gap-1.5 pt-1">
                      <div>
                        <label className="text-[9px] text-[#5d8d6a] block">X</label>
                        <input
                          type="number"
                          value={boxInputs.bx}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setBoxInputs((prev) => ({ ...prev, bx: val }));
                            if (tpls[activeFormat]) tpls[activeFormat].box.x = val;
                          }}
                          className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-1 text-center font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5d8d6a] block">Y</label>
                        <input
                          type="number"
                          value={boxInputs.by}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            setBoxInputs((prev) => ({ ...prev, by: val }));
                            if (tpls[activeFormat]) tpls[activeFormat].box.y = val;
                          }}
                          className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-1 text-center font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5d8d6a] block">W</label>
                        <input
                          type="number"
                          value={boxInputs.bw}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setBoxInputs((prev) => ({ ...prev, bw: val }));
                            if (tpls[activeFormat]) tpls[activeFormat].box.w = val;
                          }}
                          className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-1 text-center font-bold text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-[#5d8d6a] block">H</label>
                        <input
                          type="number"
                          value={boxInputs.bh}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1;
                            setBoxInputs((prev) => ({ ...prev, bh: val }));
                            if (tpls[activeFormat]) tpls[activeFormat].box.h = val;
                          }}
                          className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-1 text-center font-bold text-xs"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Range Inputs */}
                  <div className="row grid grid-cols-2 gap-2">
                    <div className="field flex flex-col gap-1">
                      <label className="text-xs text-[#39ff7a] font-bold"><span className="text-[#5d8d6a]">$ </span>--from</label>
                      <input
                        type="number"
                        min="1"
                        value={fromNo}
                        onChange={(e) => setFromNo(parseInt(e.target.value) || 1)}
                        className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-2 text-sm font-bold"
                      />
                    </div>
                    <div className="field flex flex-col gap-1">
                      <label className="text-xs text-[#39ff7a] font-bold"><span className="text-[#5d8d6a]">$ </span>--to</label>
                      <input
                        type="number"
                        min="1"
                        value={toNo}
                        onChange={(e) => setToNo(parseInt(e.target.value) || 1)}
                        className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-2 text-sm font-bold"
                      />
                    </div>
                  </div>

                  {/* Range Text Display */}
                  <div className="range font-mono text-sm font-bold text-[#39ff7a] bg-black border border-[#17361f] rounded p-2.5 text-center">
                    {rangeText()}
                  </div>

                  {/* URL Pattern */}
                  <div className="field flex flex-col gap-1">
                    <label className="text-xs text-[#39ff7a] font-bold"><span className="text-[#5d8d6a]">$ </span>--url</label>
                    <input
                      type="text"
                      value={urlPattern}
                      onChange={(e) => setUrlPattern(e.target.value)}
                      className="bg-black text-[#39ff7a] border border-[#17361f] rounded p-2 text-xs font-bold"
                    />
                    <p className="hint text-[10px] text-[#5d8d6a]">
                      # Use &#123;id&#125; for GTB0001 and &#123;token&#125; for random secure token.
                    </p>
                  </div>

                  {/* Show ID */}
                  <label className="check flex items-center gap-2 text-xs text-[#c6ffd6] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showId}
                      onChange={(e) => setShowId(e.target.checked)}
                      className="accent-[#39ff7a]"
                    />
                    <span>Print the ID on each tag</span>
                  </label>

                  {err && <p className="err text-xs text-[#ffb000] font-bold">!! {err}</p>}

                  {/* Action Buttons */}
                  <div className="btns flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={generate}
                      className="primary w-full py-3 px-3 bg-[#39ff7a] text-[#001a08] border border-[#39ff7a] rounded font-extrabold text-sm uppercase tracking-wider cursor-pointer hover:bg-[#7dffaa] transition shadow-[0_0_20px_rgba(57,255,122,0.4)] text-left flex items-center justify-between"
                    >
                      <span>&gt; Generate tags</span>
                      <span className="animate-pulse">█</span>
                    </button>

                    <button
                      type="button"
                      onClick={downloadZip}
                      disabled={!batch.length}
                      className="w-full py-2.5 px-3 bg-transparent text-[#39ff7a] border border-[#1c8f45] rounded font-bold text-xs text-left cursor-pointer hover:bg-[#39ff7a]/10 disabled:opacity-35 disabled:cursor-not-allowed transition"
                    >
                      $ export --png --zip
                    </button>

                    <button
                      type="button"
                      onClick={downloadCSV}
                      disabled={!batch.length}
                      className="w-full py-2.5 px-3 bg-transparent text-[#39ff7a] border border-[#1c8f45] rounded font-bold text-xs text-left cursor-pointer hover:bg-[#39ff7a]/10 disabled:opacity-35 disabled:cursor-not-allowed transition"
                    >
                      $ export --csv <span className="text-[#5d8d6a]"># for your sheet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => window.print()}
                      disabled={!batch.length}
                      className="w-full py-2.5 px-3 bg-transparent text-[#39ff7a] border border-[#1c8f45] rounded font-bold text-xs text-left cursor-pointer hover:bg-[#39ff7a]/10 disabled:opacity-35 disabled:cursor-not-allowed transition"
                    >
                      $ print --a4
                    </button>
                  </div>

                </div>
              </aside>

              {/* Right Output Column (8 Cols) */}
              <main className="out lg:col-span-8 flex flex-col gap-4 min-w-0">
                
                {/* Console Terminal Log Pane */}
                <section className="pane console-pane bg-[rgba(5,14,8,0.88)] border border-[#17361f] rounded-lg">
                  <div className="pane-h flex justify-between items-center px-3 py-1.5 border-b border-[#17361f] text-xs text-[#5d8d6a] bg-[#39ff7a]/5">
                    <span>~/ <b className="text-[#39ff7a]">console.log</b></span>
                    <span>tail -f</span>
                  </div>
                  <div ref={consoleRef} className="console h-44 overflow-y-auto p-3 text-xs leading-relaxed text-[#c6ffd6] whitespace-pre-wrap font-mono">
                    {consoleLogs.map((log) => (
                      <div key={log.id} className={`${log.type} ${log.isProgress ? 'live' : ''}`}>
                        {log.text}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Live Sheet Render Pane */}
                <section className="pane bg-[rgba(5,14,8,0.88)] border border-[#17361f] rounded-lg">
                  <div className="pane-h flex justify-between items-center px-3 py-1.5 border-b border-[#17361f] text-xs text-[#5d8d6a] bg-[#39ff7a]/5">
                    <span>~/ <b className="text-[#39ff7a]">output</b>/</span>
                    <span className="text-[#c6ffd6]">{batch.length} files · {FORMATS[activeFormat].w}×{FORMATS[activeFormat].h}mm</span>
                  </div>
                  
                  <div
                    ref={sheetRef}
                    className="sheet p-4 flex flex-wrap gap-4 items-start min-w-0 [&>canvas]:max-w-full [&>canvas]:h-auto [&>canvas]:drop-shadow-[0_10px_18px_rgba(0,0,0,0.7)] [&>canvas]:transition-transform [&>canvas:hover]:-translate-y-1"
                  />
                </section>

              </main>

            </div>
          </div>
        </div>

        <Footer />
      </div>
    </AdminGatekeeper>
  );
}

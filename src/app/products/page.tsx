'use client';

import React, { useState, useEffect, Suspense, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import { ShoppingBag, X, Lock, Check, ArrowRight, Shield, Truck, ChevronDown, ChevronUp, Zap, RotateCcw, HelpCircle, CheckCircle2, Tag, Package, PhoneCall, Award, AlertCircle, Eye, Percent } from 'lucide-react';
import confetti from 'canvas-confetti';

export interface ProductCatalogItem {
  id: 'GTB' | 'GTK' | 'GTT' | 'GTU';
  sku?: string;
  sectionNo: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  comparePriceNum?: number;
  category: string;
  vendor?: string;
  material: string;
  rating: string;
  imageUrl?: string;
  description: string;
  features: string[];
  isComingSoon: boolean;
  stock?: number;
}

const DEFAULT_CATALOG: ProductCatalogItem[] = [
  {
    id: 'GTB',
    sku: 'GTB-KIT',
    sectionNo: 'S.01',
    name: 'GTB Biker Kit — Emergency QR Safety Kit',
    subtitle: 'Stickers, key rings, PVC card & pin badge',
    price: '₹499',
    priceNum: 499,
    comparePriceNum: 999,
    category: 'Motorcycle & Helmet Safety',
    vendor: 'GuardianTag Hardware Labs',
    material: 'Waterproof laminated PVC & vinyl stickers',
    rating: 'Waterproof, UV-resistant stickers',
    isComingSoon: false,
    stock: 24,
    description:
      'Engineered specifically for motorcyclists, track racers, and daily commuters. In any roadside incident or accident, bystanders or first responders simply scan the high-contrast QR with any smartphone camera (zero app required) to trigger an instant masked SOS call to your emergency contacts without exposing your personal phone number.',
    features: [
      '4x QR stickers (including small helmet and bike stickers)',
      '2x QR key rings (for your bike keys and house keys)',
      '1x PVC emergency card (for your wallet)',
      '1x Pin badge (for your riding jacket or bag)',
    ],
  },
  {
    id: 'GTK',
    sku: 'GTK-KIT',
    sectionNo: 'S.02',
    name: 'GTK Kids & School Safety Bundle',
    subtitle: '10-Piece Guardian Protection for Backpacks, Shoes & Uniforms',
    price: '₹399',
    priceNum: 399,
    comparePriceNum: 799,
    category: 'Child & Backpack Protection',
    vendor: 'GuardianTag Hardware Labs',
    material: 'Food-Grade Non-Toxic Silicone + Heat-Seal Iron-on Badges',
    rating: 'Machine Washable & Tear-Proof',
    isComingSoon: true,
    stock: 0,
    description:
      'A comprehensive 10-piece safety hardware kit for toddlers, school kids, and young students. Enables teachers, bus drivers, or mall security to scan the badge and instantly reach parents via masked SOS relay if a child is separated in crowded areas.',
    features: [
      '4x Mini Waterproof QR Stickers (Lunch boxes, water bottles, shoes)',
      '1x Soft Silicone Backpack Tag with heavy-duty snap carabiner',
      '1x Clip-on Uniform & Jacket Safety Badge',
      '4x Heat-Seal Iron-On Permanent Fabric Decals for clothing',
    ],
  },
  {
    id: 'GTT',
    sku: 'GTT-KIT',
    sectionNo: 'S.03',
    name: 'GTT Traveller Smart Luggage Tag',
    subtitle: 'Airport Baggage & Global Travel Asset Recovery',
    price: '₹449',
    priceNum: 449,
    comparePriceNum: 899,
    category: 'Airport Baggage & Global Travel',
    vendor: 'GuardianTag Hardware Labs',
    material: 'Anodized Aircraft Aluminum Frame + Braided Steel Cable',
    rating: 'Airport Carousel Tear-Resistant',
    isComingSoon: true,
    stock: 0,
    description:
      'Engineered for international flyers and frequent travellers. The aircraft-grade anodized aluminum frame with braided steel cable withstands high-speed baggage carousels while shielding personal home addresses and phone numbers from airport passersby.',
    features: [
      'Braided stainless steel cable lock with threaded brass barrel',
      'Instant scan location alert sent to your WhatsApp & registered email',
      'Global scanner compatibility — works in 190+ countries with zero app',
      'Anodized scratch-proof matte casing with laser-etched matrix',
    ],
  },
  {
    id: 'GTU',
    sku: 'GTU-KIT',
    sectionNo: 'S.04',
    name: 'GTU Universal Multi-Surface Decals',
    subtitle: 'Vehicles, Laptops, Gadgets & Keychain Asset Protection',
    price: '₹299',
    priceNum: 299,
    comparePriceNum: 599,
    category: 'Multi-Surface Decal Pack',
    vendor: 'GuardianTag Hardware Labs',
    material: 'Prismatic Reflective Vinyl + UV Polymer Overlamination',
    rating: 'All-weather, peel-and-stick',
    isComingSoon: true,
    stock: 0,
    description:
      'High-visibility reflective safety decals designed for car windshields, laptops, photography gear, and everyday carry. If your parked car blocks a driveway or your laptop is left behind, finders can call you anonymously without seeing your private number.',
    features: [
      'Universal application on car windshields, scooters, bicycles & laptops',
      'Peel-and-stick on almost any clean surface',
      'Prismatic micro-reflectors illuminate under headlights at 100 meters',
      'Anonymous two-way voice proxy for urgent parking alerts',
    ],
  },
];

function ProductsContent() {
  const searchParams = useSearchParams();

  // Dynamic Catalog State (Synced with Database Store Products)
  const [catalog, setCatalog] = useState<ProductCatalogItem[]>(DEFAULT_CATALOG);
  const [selectedProductId, setSelectedProductId] = useState<'GTB' | 'GTK' | 'GTT' | 'GTU'>('GTB');

  // Active Gallery Angle: '3D' | 'HELMET' | 'KEYCHAIN' | 'BOX'
  const [galleryAngle, setGalleryAngle] = useState<'3D' | 'HELMET' | 'KEYCHAIN' | 'BOX'>('3D');

  // Quantity Counter
  const [quantity, setQuantity] = useState<number>(1);

  // Hardware Finish Option
  const [finish, setFinish] = useState<'REFLECTIVE' | 'MATTE' | 'GLOSS'>('REFLECTIVE');

  // Custom Laser Etching Toggle & Value
  const [enableCustomEtching, setEnableCustomEtching] = useState(false);
  const [customEtchingText, setCustomEtchingText] = useState('');
  const [customFont, setCustomFont] = useState<'TECH' | 'MONO' | 'BOLD'>('TECH');

  // Slide-Over Shopify Checkout Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Coupon Code & Discount State
  const [couponInput, setCouponInput] = useState('WELCOME10');
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    discountType: string;
    value: number;
    discountAmountRs: number;
  } | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Accordion Toggles
  const [openAccordion, setOpenAccordion] = useState<string | null>('box');

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [whatsappUrl, setWhatsappUrl] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fetch live store products from Neon API
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.products) && data.products.length > 0) {
          setCatalog(data.products);
        }
      })
      .catch(() => {
        // Fallback to static catalog if network/server is unavailable
      });
  }, []);

  // Handle URL Query Params: applied during render whenever searchParams changes
  // (React's recommended alternative to syncing state inside an effect).
  const [appliedParams, setAppliedParams] = useState<typeof searchParams | null>(null);
  if (appliedParams !== searchParams) {
    setAppliedParams(searchParams);
    const modelParam = searchParams.get('model');
    const textParam = searchParams.get('text');
    const checkoutParam = searchParams.get('checkout');

    if (modelParam) {
      const upper = modelParam.toUpperCase() as 'GTB' | 'GTK' | 'GTT' | 'GTU';
      if (['GTB', 'GTK', 'GTT', 'GTU'].includes(upper)) {
        setSelectedProductId(upper);
      }
    }

    if (textParam) {
      setEnableCustomEtching(true);
      setCustomEtchingText(decodeURIComponent(textParam));
    }

    if (checkoutParam === '1' || checkoutParam === 'true') {
      setIsDrawerOpen(true);
    }
  }

  // Selected Product Object
  const currentProduct = useMemo(() => {
    return catalog.find((p) => p.id === selectedProductId) || catalog[0] || DEFAULT_CATALOG[0];
  }, [catalog, selectedProductId]);

  // Pricing Calculations
  const unitPrice = currentProduct.priceNum;
  const comparePrice = currentProduct.comparePriceNum || unitPrice * 2;
  const rawSubtotal = unitPrice * quantity;
  const discountAmount = appliedDiscount ? appliedDiscount.discountAmountRs : 0;
  const finalTotal = Math.max(0, rawSubtotal - discountAmount);

  // Validate Discount Coupon
  const handleApplyCoupon = async (codeToTest?: string) => {
    const code = (codeToTest || couponInput).trim();
    if (!code) {
      setCouponError('Please enter a coupon code.');
      return;
    }

    setIsValidatingCoupon(true);
    setCouponError(null);

    try {
      const res = await fetch('/api/discounts/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          totalPaise: rawSubtotal * 100,
        }),
      });

      const data = await res.json();
      setIsValidatingCoupon(false);

      if (res.ok && data.success && data.discount) {
        setAppliedDiscount(data.discount);
        setCouponError(null);
      } else {
        setAppliedDiscount(null);
        setCouponError(data.error || 'Invalid or expired coupon code.');
      }
    } catch {
      setIsValidatingCoupon(false);
      setCouponError('Failed to validate discount. Please try again.');
    }
  };

  // 1-Tap WhatsApp Order Link Generator
  const generateWhatsAppOrderUrl = () => {
    const etchingNote = enableCustomEtching && customEtchingText ? ` (Custom Etching: "${customEtchingText}")` : '';
    const message = `Hello GuardianTag! 👋%0A%0AI want to order the following:%0A*Product:* ${currentProduct.name}%0A*Quantity:* ${quantity}%0A*Finish:* ${finish}${etchingNote ? '%0A' + etchingNote : ''}%0A*Total Price:* ₹${finalTotal} (Free Pan-India Delivery)%0A%0APlease share payment UPI / confirm dispatch details!`;
    return `https://wa.me/918058800880?text=${message}`;
  };

  // Submit Order via API
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentProduct.isComingSoon) {
      setOrderError('This product is in pre-order development and will launch shortly.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setOrderError('Please provide your name, phone number, and delivery address.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    const laserEtching = enableCustomEtching && customEtchingText.trim()
      ? `${customEtchingText.trim()} [Font: ${customFont}, Finish: ${finish}]`
      : undefined;

    const payload = {
      productModel: currentProduct.id,
      productName: currentProduct.name,
      quantity,
      // The server prices the order from the database; only the coupon code is sent.
      discountCode: appliedDiscount?.code,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim() || `${customerPhone.trim()}@guest.guardiantag.in`,
      address: shippingAddress.trim(),
      pincode: pincode.trim(),
      laserEtchingText: laserEtching,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        const orderRef = data.orderNo || data.orderId;
        setOrderSuccess(orderRef);
        setWhatsappUrl(data.whatsappUrl);

        try {
          confetti({ particleCount: 140, spread: 80, origin: { y: 0.5 } });
        } catch {
          // ignore
        }
      } else {
        setOrderError(data.error || 'Failed to submit order. Please try again.');
      }
    } catch {
      setIsSubmitting(false);
      setOrderError('Connection error. Please try again or use direct WhatsApp order.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-yellow-400 selection:text-black">
      <Navbar />

      {/* SHOPIFY BREADCRUMBS & TOP BANNER */}
      <div className="pt-24 border-b border-white/10 bg-[#080808]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between text-xs text-neutral-400 font-mono gap-3">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-yellow-400 transition">
              Home
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-yellow-400 transition">
              Safety Hardware
            </Link>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-[200px] sm:max-w-xs">
              {currentProduct.name}
            </span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Pan-India Express Dispatch Active
            </span>
            <span className="hidden sm:inline text-neutral-500">•</span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-300">
              <Shield className="w-3.5 h-3.5 text-yellow-400" />
              1-Year All-Weather Guarantee
            </span>
          </div>
        </div>
      </div>

      {/* MAIN SHOPIFY 2-COLUMN PRODUCT DETAIL PAGE (PDP) */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* ========================================================= */}
          {/* LEFT COLUMN: INTERACTIVE MEDIA SHOWCASE & GALLERY         */}
          {/* ========================================================= */}
          <div className="lg:col-span-7 space-y-6 lg:sticky lg:top-28">
            
            {/* Primary Media Card */}
            <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-neutral-900/90 to-black p-6 sm:p-10 flex flex-col items-center justify-center min-h-[440px] sm:min-h-[500px] overflow-hidden shadow-2xl group">
              
              {/* Corner Watermark Section Code */}
              <span className="absolute top-4 right-6 font-mono text-xs font-bold text-neutral-500 uppercase tracking-widest pointer-events-none">
                {currentProduct.sectionNo} {'//'} {currentProduct.id}
              </span>

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                <span className="px-3 py-1 rounded-full bg-yellow-400 text-black font-black text-xs font-mono tracking-wider flex items-center gap-1.5 shadow-lg shadow-yellow-400/20">
                  <Percent className="w-3.5 h-3.5" />
                  50% INTRO OFF
                </span>
                <span className="px-3 py-1 rounded-full bg-neutral-900/90 border border-white/20 text-neutral-200 text-[11px] font-mono font-medium flex items-center gap-1.5 backdrop-blur-md">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  PEEL & STICK
                </span>
              </div>

              {/* Main Media Render depending on galleryAngle */}
              {galleryAngle === '3D' && (
                <div className="w-full flex flex-col items-center justify-center py-6">
                  {currentProduct.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- arbitrary image_url from the DB; next/image would need remotePatterns for every host
                    <img
                      src={currentProduct.imageUrl}
                      alt={currentProduct.name}
                      className="max-h-72 max-w-full object-contain rounded-2xl drop-shadow-[0_20px_40px_rgba(250,204,21,0.15)] group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="scale-90 sm:scale-100 transition-transform">
                      <PhysicalTag3D
                        size="lg"
                        tagType={currentProduct.id}
                        serial={enableCustomEtching && customEtchingText ? customEtchingText.slice(0, 12).toUpperCase() : `${currentProduct.id}880`}
                      />
                    </div>
                  )}

                  {/* 3D Interactive Tag Hint */}
                  <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-neutral-400">
                    <RotateCcw className="w-3 h-3 text-yellow-400 animate-spin" style={{ animationDuration: '6s' }} />
                    <span>Interactive 3D Preview • Drag or Hover to Tilt</span>
                  </div>
                </div>
              )}

              {galleryAngle === 'HELMET' && (
                <div className="w-full flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-yellow-400/40 bg-yellow-400/5 flex flex-col items-center justify-center p-6 relative">
                    <div className="w-28 h-28 rounded-2xl bg-neutral-900 border border-white/20 flex flex-col items-center justify-center shadow-xl p-3">
                      <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs font-mono mb-2">GT</div>
                      <span className="text-[10px] font-mono text-white font-bold">HELMET STICKER</span>
                      <span className="text-[9px] font-mono text-neutral-400">PEEL &amp; STICK</span>
                    </div>
                    <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-yellow-400 text-black font-mono font-black text-[10px]">
                      STICKS ON ANY HELMET
                    </div>
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-sm font-bold text-white font-mono">Helmet sticker</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      A small QR sticker for the back of your helmet, where responders look first. Peel it off and stick it on a clean, dry surface.
                    </p>
                  </div>
                </div>
              )}

              {galleryAngle === 'KEYCHAIN' && (
                <div className="w-full flex flex-col items-center justify-center py-8 text-center space-y-4">
                  <div className="w-48 h-48 rounded-full border-2 border-dashed border-emerald-400/40 bg-emerald-400/5 flex flex-col items-center justify-center p-6 relative">
                    <div className="w-28 h-28 rounded-2xl bg-neutral-900 border border-white/20 flex flex-col items-center justify-center shadow-xl p-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-400 text-black flex items-center justify-center font-black text-xs font-mono mb-2">KEY</div>
                      <span className="text-[10px] font-mono text-white font-bold">KEY RING</span>
                      <span className="text-[9px] font-mono text-emerald-400">QR TAG</span>
                    </div>
                    <div className="absolute -bottom-3 px-3 py-1 rounded-full bg-emerald-400 text-black font-mono font-black text-[10px]">
                      2 IN EVERY KIT
                    </div>
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-sm font-bold text-white font-mono">QR key rings</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      Two key rings, one for your bike keys and one for your house keys, so your emergency QR is with you even off the bike.
                    </p>
                  </div>
                </div>
              )}

              {galleryAngle === 'BOX' && (
                <div className="w-full flex flex-col items-center justify-center py-6 text-center space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-lg">
                    <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 text-center space-y-1">
                      <div className="text-yellow-400 font-mono text-xs font-black">×4</div>
                      <div className="text-[11px] font-bold text-white">Stickers</div>
                      <div className="text-[9px] text-neutral-400">Helmet, bike &amp; more</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 text-center space-y-1">
                      <div className="text-yellow-400 font-mono text-xs font-black">×2</div>
                      <div className="text-[11px] font-bold text-white">Key rings</div>
                      <div className="text-[9px] text-neutral-400">Bike &amp; house keys</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 text-center space-y-1">
                      <div className="text-yellow-400 font-mono text-xs font-black">×1</div>
                      <div className="text-[11px] font-bold text-white">PVC card</div>
                      <div className="text-[9px] text-neutral-400">Wallet</div>
                    </div>
                    <div className="p-3 rounded-2xl bg-neutral-950 border border-white/10 text-center space-y-1">
                      <div className="text-yellow-400 font-mono text-xs font-black">×1</div>
                      <div className="text-[11px] font-bold text-white">Pin badge</div>
                      <div className="text-[9px] text-neutral-400">Jacket / bag</div>
                    </div>
                  </div>
                  <div className="max-w-md">
                    <h4 className="text-sm font-bold text-white font-mono">What&apos;s in the box</h4>
                    <p className="text-xs text-neutral-400 mt-1">
                      The stickers, key rings and card all link to the same emergency profile, which you set up once.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Gallery Thumbnail Switcher Strip */}
            <div className="grid grid-cols-4 gap-3">
              {[
                { id: '3D', label: '3D Hardware', icon: Eye, sub: 'Interactive' },
                { id: 'HELMET', label: 'Helmet sticker', icon: Shield, sub: 'Peel & stick' },
                { id: 'KEYCHAIN', label: 'Key rings', icon: Tag, sub: '2 in the kit' },
                { id: 'BOX', label: 'Biker Kit', icon: Package, sub: "What's inside" },
              ].map((item) => {
                const IconComp = item.icon;
                const isActive = galleryAngle === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setGalleryAngle(item.id as typeof galleryAngle)}
                    className={`p-3 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10'
                        : 'border-white/10 bg-neutral-950 hover:border-white/25 hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <IconComp className={`w-4 h-4 ${isActive ? 'text-yellow-400' : 'text-neutral-400'}`} />
                      <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-yellow-400' : 'text-neutral-500'}`}>
                        {item.sub}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-white font-mono truncate">{item.label}</div>
                  </button>
                );
              })}
            </div>

            {/* Hardware Trust Pillars (Shopify style below media) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/10 flex flex-col gap-1.5">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span className="text-xs font-bold text-white font-mono">Zero-App Scan</span>
                <span className="text-[10px] text-neutral-400">Works on all iPhone & Android cameras</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/10 flex flex-col gap-1.5">
                <Lock className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-white font-mono">100% Privacy</span>
                <span className="text-[10px] text-neutral-400">Masked relay never exposes your phone #</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/10 flex flex-col gap-1.5">
                <Truck className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white font-mono">Free Express</span>
                <span className="text-[10px] text-neutral-400">Dispatches in 24 hours across India</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-white/10 flex flex-col gap-1.5">
                <Award className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white font-mono">1-Year Warranty</span>
                <span className="text-[10px] text-neutral-400">Free replacement if peeled or damaged</span>
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SHOPIFY STICKY BUY MODULE                   */}
          {/* ========================================================= */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Header: Vendor, Title & Rating */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold tracking-widest text-neutral-400 uppercase">
                  {currentProduct.vendor || 'GUARDIANTAG OFFICIAL LABS'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono font-bold text-[10px]">
                  {currentProduct.isComingSoon ? 'LAUNCHING SHORTLY' : 'IN STOCK • READY TO SHIP'}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                {currentProduct.name}
              </h1>
            </div>

            {/* SHOPIFY SIGNATURE PRICE BLOCK */}
            <div className="p-5 rounded-2xl border border-white/15 bg-neutral-950/90 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-yellow-400 font-mono">
                  {currentProduct.price}
                </span>
                <del className="text-base sm:text-lg text-neutral-500 line-through font-mono">
                  ₹{comparePrice}
                </del>
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 font-mono font-black text-xs">
                  SAVE ₹{comparePrice - unitPrice} (50% OFF)
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-mono">
                Taxes included. Zero subscription fees. Free Pan-India express delivery.
              </p>
            </div>

            {/* MODEL / HARDWARE VARIANT SELECTOR */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-white uppercase">Hardware Model</span>
                <span className="text-neutral-400 font-mono text-[11px]">Selected: [{currentProduct.id}]</span>
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                {catalog.map((p) => {
                  const isSelected = p.id === selectedProductId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setSelectedProductId(p.id);
                        setOrderSuccess(null);
                        setOrderError(null);
                      }}
                      className={`p-3 rounded-2xl border text-left transition cursor-pointer relative ${
                        isSelected
                          ? 'border-yellow-400 bg-yellow-400/10 shadow-lg shadow-yellow-400/10'
                          : 'border-white/10 bg-neutral-950 hover:border-white/25 hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono font-black text-xs text-white">{p.id}</span>
                        {p.isComingSoon ? (
                          <span className="text-[9px] font-mono text-amber-400 font-bold bg-amber-400/10 px-1.5 py-0.5 rounded">
                            SOON
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-bold text-neutral-200 truncate">{p.name.split('—')[0]}</div>
                      <div className="text-[11px] text-yellow-400 font-mono font-bold mt-1">{p.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* HARDWARE FINISH SELECTOR */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-mono font-bold text-white uppercase">Finish / Visibility</span>
                <span className="text-yellow-400 font-mono text-[11px]">
                  {finish === 'REFLECTIVE' ? 'Reflective Neon Glow' : finish === 'MATTE' ? 'Stealth Matte Carbon' : 'High-Gloss Armor'}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'REFLECTIVE', label: 'Reflective Neon', sub: 'High Visibility' },
                  { id: 'MATTE', label: 'Matte Carbon', sub: 'Stealth Black' },
                  { id: 'GLOSS', label: 'Gloss Armor', sub: 'UV Clear Coat' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setFinish(opt.id as typeof finish)}
                    className={`py-2 px-3 rounded-xl border text-center transition cursor-pointer ${
                      finish === opt.id
                        ? 'border-yellow-400 bg-white/10 text-white font-bold'
                        : 'border-white/10 bg-neutral-950 text-neutral-400 hover:border-white/20 hover:text-white'
                    }`}
                  >
                    <div className="text-xs font-mono">{opt.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOM LASER ETCHING (THE CUSTOMIZER) */}
            <div className="p-4 rounded-2xl border border-white/15 bg-neutral-950 space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={enableCustomEtching}
                    onChange={(e) => setEnableCustomEtching(e.target.checked)}
                    className="w-4 h-4 rounded border-neutral-700 text-yellow-400 focus:ring-yellow-400 focus:ring-offset-black accent-yellow-400 cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-white">
                    Add Free Custom Laser Etching
                  </span>
                </label>
                <span className="text-[10px] font-mono font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full border border-emerald-400/20">
                  FREE PROMO
                </span>
              </div>

              {enableCustomEtching && (
                <div className="space-y-3 pt-2 border-t border-white/10 animate-in fade-in duration-200">
                  <div>
                    <div className="flex justify-between text-[11px] font-mono text-neutral-400 mb-1">
                      <span>Rider Name / Blood Group / Bike Reg #</span>
                      <span>{customEtchingText.length}/35</span>
                    </div>
                    <input
                      type="text"
                      maxLength={35}
                      value={customEtchingText}
                      onChange={(e) => setCustomEtchingText(e.target.value)}
                      placeholder="e.g. FAHIM / B+ POSITIVE / KA-01-EQ-9999"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-yellow-400 transition"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-neutral-400">Font:</span>
                    {(['TECH', 'MONO', 'BOLD'] as const).map((f) => (
                      <button
                        key={f}
                        type="button"
                        onClick={() => setCustomFont(f)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition ${
                          customFont === f
                            ? 'bg-yellow-400 text-black border-yellow-400 font-black'
                            : 'bg-white/5 text-neutral-400 border-white/10 hover:text-white'
                        }`}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* QUANTITY & STOCK STATUS */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="font-bold text-white uppercase">Quantity</span>
                <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  Only {currentProduct.stock || 18} units remaining at ₹499
                </span>
              </div>

              <div className="flex items-center gap-3">
                {/* Quantity Box */}
                <div className="flex items-center border border-white/20 rounded-2xl bg-neutral-950 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 font-mono text-base transition cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-extrabold text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white hover:bg-white/10 font-mono text-base transition cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal Display */}
                <div className="flex-1 px-4 py-2.5 rounded-2xl bg-neutral-950 border border-white/10 flex items-center justify-between">
                  <span className="text-xs text-neutral-400 font-mono">Order Subtotal:</span>
                  <span className="text-base font-bold font-mono text-white">₹{rawSubtotal}</span>
                </div>
              </div>
            </div>

            {/* SHOPIFY CALL TO ACTION BUTTONS */}
            <div className="space-y-2.5 pt-2">
              {/* Primary: Buy It Now (Opens Drawer) */}
              <button
                type="button"
                onClick={() => {
                  setOrderSuccess(null);
                  setIsDrawerOpen(true);
                }}
                disabled={currentProduct.isComingSoon}
                className={`w-full py-4 px-6 rounded-2xl font-mono font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all duration-200 cursor-pointer ${
                  currentProduct.isComingSoon
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-white/10'
                    : 'bg-yellow-400 hover:bg-yellow-300 text-black shadow-yellow-400/25 hover:scale-[1.01]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{currentProduct.isComingSoon ? 'Coming Soon — Register Interest' : 'Buy It Now • Instant Checkout'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* Secondary: Instant WhatsApp Order */}
              <a
                href={generateWhatsAppOrderUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 text-[#25D366] font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <PhoneCall className="w-4 h-4" />
                <span>⚡ Order via WhatsApp in 30 Seconds</span>
              </a>
            </div>

            {/* Payment Trust Badges */}
            <div className="pt-2 border-t border-white/10 text-center space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 block">
                Guaranteed Safe &amp; Encrypted Checkout
              </span>
              <div className="flex items-center justify-center gap-3 text-neutral-400 text-[11px] font-mono">
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">UPI / QR</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">GPay</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">PhonePe</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Paytm</span>
                <span className="px-2 py-1 rounded bg-white/5 border border-white/10">Cards</span>
              </div>
            </div>

            {/* SHOPIFY ACCORDIONS: DETAILS & POLICIES */}
            <div className="space-y-2 pt-2">
              
              {/* Accordion 1: What's in the Box */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'box' ? null : 'box')}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-mono font-bold text-white">What&apos;s in the kit</span>
                  </div>
                  {openAccordion === 'box' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openAccordion === 'box' && (
                  <div className="p-4 pt-0 text-xs text-neutral-300 font-sans space-y-2 border-t border-white/5 mt-1">
                    <ul className="space-y-1.5 pt-2 font-mono text-[11px]">
                      {currentProduct.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-yellow-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Paramedic & Bystander Scan Flow */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'scan' ? null : 'scan')}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white">How Emergency Scanning Works</span>
                  </div>
                  {openAccordion === 'scan' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openAccordion === 'scan' && (
                  <div className="p-4 pt-0 text-xs text-neutral-300 font-sans space-y-2.5 border-t border-white/5 mt-1">
                    <p className="pt-2 text-neutral-400 leading-relaxed font-sans text-xs">
                      1. In an accident, any bystander or doctor scans the helmet QR with any smartphone camera (no special app or account needed).
                    </p>
                    <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                      2. Emergency profile displays your blood group, emergency contacts, medical allergies, and bike insurance notes.
                    </p>
                    <p className="text-neutral-400 leading-relaxed font-sans text-xs">
                      3. Tapping &quot;Call Emergency Contact&quot; dials through our encrypted cloud voice proxy—your personal phone number remains completely masked and confidential.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Shipping & Delivery Timelines */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Truck className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-white">Pan-India Express Shipping &amp; Tracking</span>
                  </div>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openAccordion === 'shipping' && (
                  <div className="p-4 pt-0 text-xs text-neutral-300 font-sans space-y-2 border-t border-white/5 mt-1">
                    <p className="pt-2 text-neutral-400 leading-relaxed text-xs">
                      • Dispatched within 24 hours via Bluedart, Delhivery, or Express Air.
                    </p>
                    <p className="text-neutral-400 leading-relaxed text-xs">
                      • Metro Deliveries: 2-3 business days. Rest of India: 3-5 business days.
                    </p>
                    <p className="text-neutral-400 leading-relaxed text-xs">
                      • Live tracking link delivered to your WhatsApp number as soon as the courier scans your package.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 4: 1-Year All-Weather Guarantee */}
              <div className="rounded-2xl border border-white/10 bg-neutral-950 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'warranty' ? null : 'warranty')}
                  className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition"
                >
                  <div className="flex items-center gap-2.5">
                    <Shield className="w-4 h-4 text-yellow-400" />
                    <span className="text-xs font-mono font-bold text-white">1-Year All-Weather Guarantee</span>
                  </div>
                  {openAccordion === 'warranty' ? <ChevronUp className="w-4 h-4 text-neutral-400" /> : <ChevronDown className="w-4 h-4 text-neutral-400" />}
                </button>
                {openAccordion === 'warranty' && (
                  <div className="p-4 pt-0 text-xs text-neutral-300 font-sans space-y-2 border-t border-white/5 mt-1">
                    <p className="pt-2 text-neutral-400 leading-relaxed text-xs">
                      We engineer hardware for Indian roads. If your tag fades from UV exposure, peels off in heavy rain, or is damaged during normal motorcycle riding within 365 days of purchase, send us a photo and we will courier a brand new replacement free of charge.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BELOW THE FOLD: SPECS COMPARISON TABLE                    */}
        {/* ========================================================= */}
        <section className="mt-20 pt-14 border-t border-white/10">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-bold text-yellow-400 uppercase">
              HARDWARE SPECIFICATIONS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why GuardianTag Outperforms Paper Stickers
            </h2>
            <p className="text-neutral-400 text-xs sm:text-sm">
              Standard paper and laminated stickers peel under rain and fade in sunlight. GuardianTag is built like motorcycle armor.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono border-collapse border border-white/15 rounded-2xl overflow-hidden bg-neutral-950">
              <thead>
                <tr className="border-b border-white/15 bg-white/5">
                  <th className="p-4 text-neutral-400 font-bold uppercase">Specification</th>
                  <th className="p-4 text-yellow-400 font-bold uppercase bg-yellow-400/10">
                    GuardianTag GTB Kit (₹499)
                  </th>
                  <th className="p-4 text-neutral-500 font-bold uppercase">Generic Paper QR Stickers</th>
                  <th className="p-4 text-neutral-500 font-bold uppercase">Medical ID Bracelets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-neutral-300">
                <tr>
                  <td className="p-4 font-bold text-white">Weather Resistance</td>
                  <td className="p-4 font-bold text-emerald-400 bg-yellow-400/5">IP68 100% Waterproof &amp; UV Shield</td>
                  <td className="p-4 text-neutral-400">Fades in 2 weeks of rain/sun</td>
                  <td className="p-4 text-neutral-400">Waterproof but easily forgotten at home</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Mounting</td>
                  <td className="p-4 font-bold text-emerald-400 bg-yellow-400/5">Peel-and-stick, sticks anywhere</td>
                  <td className="p-4 text-neutral-400">Standard paper glue (Peels off)</td>
                  <td className="p-4 text-neutral-400">N/A (Wearable strap)</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Privacy Protection</td>
                  <td className="p-4 font-bold text-emerald-400 bg-yellow-400/5">Masked Twilio Cloud Call Relay</td>
                  <td className="p-4 text-red-400">Exposes your raw mobile number to all</td>
                  <td className="p-4 text-neutral-400">Phone number printed in plain text</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Emergency Data Updates</td>
                  <td className="p-4 font-bold text-emerald-400 bg-yellow-400/5">Instant portal login anytime</td>
                  <td className="p-4 text-neutral-400">Cannot edit once printed</td>
                  <td className="p-4 text-neutral-400">Requires purchasing a new band</td>
                </tr>
                <tr>
                  <td className="p-4 font-bold text-white">Recurring Subscription</td>
                  <td className="p-4 font-bold text-emerald-400 bg-yellow-400/5">₹0 Forever (Zero Subscriptions)</td>
                  <td className="p-4 text-neutral-400">Free but unsafe</td>
                  <td className="p-4 text-neutral-400">₹999 - ₹2499 upfront</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* ========================================================= */}
        {/* BELOW THE FOLD: FREQUENTLY ASKED QUESTIONS               */}
        {/* ========================================================= */}
        <section className="mt-20 pt-14 border-t border-white/10 max-w-3xl mx-auto">
          <div className="text-center space-y-3 mb-10">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs font-mono font-bold text-yellow-400 uppercase">
              HAVE QUESTIONS?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Do I need to pay any monthly or annual subscription fee?',
                a: 'No! GuardianTag is a one-time purchase of ₹499. There are zero monthly charges, zero yearly renewal fees, and zero hidden server costs.',
              },
              {
                q: 'What happens when someone scans my helmet QR code?',
                a: 'Any smartphone camera instantly opens your verified GuardianTag profile. It displays your emergency contacts, blood group, allergies, and bike registration. The scanner can press "Call Emergency Contact" which connects via a masked relay without ever revealing your personal phone number.',
              },
              {
                q: 'Will high pressure water washing or rain peel the tag off?',
                a: 'The stickers are laminated and waterproof, made for rain and regular washing. For the best hold, stick them on a clean, dry surface and avoid washing that spot for the first day.',
              },
              {
                q: 'Can I change my emergency contact number later if I change phones?',
                a: 'Yes, absolutely. You can log into your GuardianTag Owner Portal at any time using your registered phone number or QR ID to update your emergency contacts, medical information, or vehicle details instantly.',
              },
            ].map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl border border-white/10 bg-neutral-950 space-y-2">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-yellow-400 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <p className="text-xs text-neutral-400 font-sans leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* ========================================================= */}
      {/* SHOPIFY SLIDE-OVER QUICK CHECKOUT DRAWER                  */}
      {/* ========================================================= */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[10000] flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          {/* Slide-over Content Drawer */}
          <div className="relative w-full max-w-md bg-neutral-950 border-l border-white/15 h-full overflow-y-auto flex flex-col p-6 shadow-2xl z-10 font-mono">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-yellow-400" />
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  Express Checkout
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 text-neutral-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* ORDER SUCCESS SCREEN */}
            {orderSuccess ? (
              <div className="py-12 text-center space-y-6 flex-1 flex flex-col items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-400/20 border-2 border-emerald-400 text-emerald-400 flex items-center justify-center">
                  <Check className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-400 font-mono font-bold text-xs">
                    ORDER CONFIRMED #{orderSuccess}
                  </span>
                  <h3 className="text-xl font-bold text-white">Thank You for Your Order!</h3>
                  <p className="text-xs text-neutral-400 max-w-xs font-sans">
                    Your GuardianTag kit is being prepped for dispatch. Our fulfillment team has sent the tracking confirmation to your WhatsApp number.
                  </p>
                </div>

                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#25D366] text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition hover:bg-[#20ba59]"
                  >
                    <PhoneCall className="w-4 h-4" />
                    <span>Open WhatsApp Dispatch Receipt</span>
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setIsDrawerOpen(false);
                    setOrderSuccess(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-6 flex-1 pt-4">
                
                {/* Product Summary in Drawer */}
                <div className="p-3.5 rounded-2xl bg-neutral-900 border border-white/10 flex gap-3.5 items-center">
                  <div className="w-14 h-14 rounded-xl bg-black border border-white/10 flex items-center justify-center shrink-0">
                    <span className="font-mono font-black text-yellow-400 text-sm">
                      {currentProduct.id}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-white truncate">{currentProduct.name}</div>
                    <div className="text-[11px] text-neutral-400">
                      Finish: {finish} • Qty: {quantity}
                    </div>
                    {enableCustomEtching && customEtchingText && (
                      <div className="text-[10px] text-yellow-400 truncate">
                        Etch: &quot;{customEtchingText}&quot;
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-white">₹{rawSubtotal}</div>
                    <del className="text-[10px] text-neutral-500">₹{comparePrice * quantity}</del>
                  </div>
                </div>

                {/* COUPON CODE INPUT */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-neutral-300 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Discount Code / Voucher</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. WELCOME10"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      className="flex-1 px-3.5 py-2 rounded-xl bg-black border border-white/20 text-white font-mono text-xs uppercase focus:outline-none focus:border-yellow-400"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon()}
                      disabled={isValidatingCoupon}
                      className="px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition cursor-pointer"
                    >
                      {isValidatingCoupon ? 'Checking...' : 'Apply'}
                    </button>
                  </div>

                  {couponError && (
                    <div className="text-[11px] text-red-400 flex items-center gap-1 font-mono">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{couponError}</span>
                    </div>
                  )}

                  {appliedDiscount && (
                    <div className="text-[11px] text-emerald-400 flex items-center justify-between font-mono bg-emerald-400/10 px-2.5 py-1.5 rounded-lg border border-emerald-400/20">
                      <span>✓ Applied {appliedDiscount.code} (-₹{appliedDiscount.discountAmountRs})</span>
                      <button
                        type="button"
                        onClick={() => setAppliedDiscount(null)}
                        className="text-neutral-400 hover:text-white"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* CHECKOUT SHIPPING FORM */}
                <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">
                      WhatsApp Mobile Number * <span className="text-neutral-500 font-normal">(for tracking)</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">
                      Email Address <span className="text-neutral-500 font-normal">(optional)</span>
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. rahul@gmail.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">Delivery Address *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat No, Street, Landmark, City, State"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-neutral-300">Pincode *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 560001"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black border border-white/20 text-white font-mono text-xs focus:outline-none focus:border-yellow-400"
                    />
                  </div>

                  {orderError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-mono">
                      {orderError}
                    </div>
                  )}

                  {/* PRICE SUMMARY BREAKDOWN */}
                  <div className="pt-3 border-t border-white/10 space-y-1.5 text-xs font-mono">
                    <div className="flex justify-between text-neutral-400">
                      <span>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}):</span>
                      <span>₹{rawSubtotal}</span>
                    </div>

                    {appliedDiscount && (
                      <div className="flex justify-between text-emerald-400 font-bold">
                        <span>Discount ({appliedDiscount.code}):</span>
                        <span>-₹{discountAmount}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-neutral-400">
                      <span>Pan-India Express Shipping:</span>
                      <span className="text-emerald-400 font-bold uppercase">FREE</span>
                    </div>

                    <div className="flex justify-between text-white font-black text-sm pt-2 border-t border-white/10">
                      <span>Total Due:</span>
                      <span className="text-yellow-400">₹{finalTotal}</span>
                    </div>
                  </div>

                  {/* SUBMIT BUTTON */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-yellow-400/20"
                  >
                    {isSubmitting ? (
                      <span>Placing Order...</span>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Place Order • ₹{finalTotal} (Free Delivery)</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-center text-neutral-500 font-mono">
                    🔒 256-bit SSL Encrypted • Instant WhatsApp Confirmation
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs">
          Loading GuardianTag Hardware...
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Button from '@/components/ui/Button';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import { ShoppingBag, X, Lock, Check, ArrowRight, Sliders, Sparkles, Shield, Info, Truck, Clock } from 'lucide-react';
import { createOrder } from '@/lib/orderService';
import confetti from 'canvas-confetti';

export interface ProductCatalogItem {
  id: 'GTB' | 'GTK' | 'GTT' | 'GTU';
  sectionNo: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  category: string;
  material: string;
  rating: string;
  description: string;
  features: string[];
  isComingSoon: boolean;
}

const PRODUCTS_CATALOG: ProductCatalogItem[] = [
  {
    id: 'GTB',
    sectionNo: 'S.01',
    name: 'GTB Biker Tag',
    subtitle: '4-Piece Motorcycle Emergency Safety Kit',
    price: '₹499',
    priceNum: 499,
    category: 'Motorcycle & Helmet Safety',
    material: 'Impact PVC + 3M High-Tack Adhesive',
    rating: 'IP68 Waterproof & UV Resistant (Up to 120km/h wind force)',
    isComingSoon: false,
    description:
      'Complete 4-piece motorcycle emergency safety kit engineered specifically for riders. Includes 1 High-Impact PVC Helmet Tag, 1 Emergency Key Chain Tag, Waterproof Small Helmet/Visor Stickers, and All-Weather Large Bike Frame/Windshield Stickers. Enables any bystander or paramedic in an accident to scan the QR code to trigger instant masked emergency call dispatch.',
    features: [
      '1. High-Impact PVC Helmet Tag (Curved flex fit for full-face & modular helmets)',
      '2. Emergency Key Chain Tag (Heavy-duty keyring loop for bike keys or jacket)',
      '3. Small QR Stickers (Reflective waterproof stickers for visors & small gear)',
      '4. Large QR Stickers (All-weather 3M adhesive stickers for bike frames & windshields)',
    ],
  },
  {
    id: 'GTK',
    sectionNo: 'S.02',
    name: 'GTK Kids Safety Bundle',
    subtitle: 'Complete 10-Piece Kids Safety Kit',
    price: '₹399',
    priceNum: 399,
    category: 'Child & Backpack Protection',
    material: 'Food-Grade Silicone + Heat-Seal Fabric Patches',
    rating: '100% Non-Toxic & Machine Washable',
    isComingSoon: true,
    description:
      'A comprehensive 10-piece safety hardware kit for children, toddlers, and students. Includes waterproof stickers, bag key tags, uniform safety badges, and heat-seal iron-on clothing stickers. Scannable by anyone to reach parents instantly in crowded places or school outings.',
    features: [
      'INCLUDES: 4 Small Waterproof QR Stickers (Bottles & Shoes)',
      'INCLUDES: 1 Heavy-Duty Bag Key Tag with Carabiner Loop',
      'INCLUDES: 1 Safety Badge for Uniforms & Jackets',
      'INCLUDES: 4 Heat-Seal Iron-On Stickers for Clothing',
    ],
  },
  {
    id: 'GTT',
    sectionNo: 'S.03',
    name: 'GTT Traveller Tag',
    subtitle: 'Luggage & Global Travel Bag Recovery',
    price: '₹449',
    priceNum: 449,
    category: 'Airport Baggage & Global Travel',
    material: 'Anodized Aluminum Frame + Steel Cable',
    rating: 'Airport Conveyor Belt Tear-Resistant',
    isComingSoon: true,
    description:
      'Heavy-duty anodized aluminum tag with a high-strength braided steel locking cable built for international travelers and airport carousels. Prevents accidental tearing while keeping private contact details hidden from airport passersby.',
    features: [
      'Steel wire lock prevents accidental tearing at airport carousels',
      'Scannable globally by airport staff and lost & found handlers',
      'Hides home address & telephone from public view',
      'Instant email & SMS timestamped location alert on scan',
    ],
  },
  {
    id: 'GTU',
    sectionNo: 'S.04',
    name: 'GTU Universal Decal',
    subtitle: 'Vehicles, Laptops, Keychains & Daily Assets',
    price: '₹299',
    priceNum: 299,
    category: 'Multi-Surface Decal Pack',
    material: 'Reflective Vinyl + Weather Shield Overlamination',
    rating: 'All-Weather 3M Adhesive',
    isComingSoon: true,
    features: [
      'Universal application on car windshields, scooters & laptops',
      'High-contrast safety warning pattern deters theft & misplacement',
      'Peel-resistant adhesive leaves zero sticky residue on removal',
      'Masked emergency call relay for parking & emergency situations',
    ],
    description:
      'All-weather reflective safety decal designed for car windshields, laptops, camera gear, and keychains. Enables instant masked contact relay when your vehicle is parked or when daily assets are misplaced.',
  },
];

export default function ProductsPage() {
  // Modal State for Active Product Detail & Customizer
  const [selectedProduct, setSelectedProduct] = useState<ProductCatalogItem | null>(null);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CUSTOMIZE' | 'CHECKOUT'>('OVERVIEW');

  // Customizer State ("the custom thing")
  const [customText, setCustomText] = useState('');
  const [customFont, setCustomFont] = useState<'MONO' | 'SANS' | 'TECH'>('MONO');
  const [emergencyPhoneNote, setEmergencyPhoneNote] = useState('');
  const [selectedFinish, setSelectedFinish] = useState<'MATTE' | 'GLOSS' | 'REFLECTIVE'>('REFLECTIVE');

  // Checkout Form State
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  const handleOpenProduct = (product: ProductCatalogItem, tab: 'OVERVIEW' | 'CUSTOMIZE' | 'CHECKOUT' = 'OVERVIEW') => {
    setSelectedProduct(product);
    setActiveTab(tab);
    setOrderSuccess(null);
    setOrderError(null);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    if (selectedProduct.isComingSoon) {
      setOrderError('This product is coming soon and will be available for launch shortly.');
      return;
    }

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      setOrderError('Please complete all required shipping fields.');
      return;
    }

    setIsSubmitting(true);
    setOrderError(null);

    const orderData = {
      productModel: selectedProduct.id,
      productName: `${selectedProduct.name} (${selectedProduct.id})`,
      quantity: 1,
      totalAmount: selectedProduct.priceNum,
      paymentMethod: 'ONLINE / UPI',
      paymentStatus: 'PAID' as const,
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      customerEmail: customerEmail.trim(),
      address: shippingAddress.trim(),
      pincode: '560001',
      laserEtchingText: customText ? `${customText} [${customFont}, ${selectedFinish}]` : undefined,
    };

    try {
      const created = createOrder(orderData);
      setIsSubmitting(false);

      if (created && created.orderId) {
        setOrderSuccess(created.orderId);
        try {
          confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
      } else {
        setOrderError('Failed to place order.');
      }
    } catch {
      setIsSubmitting(false);
      setOrderError('Failed to place order. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Header */}
      <section className="pt-32 sm:pt-36 pb-16 bg-black border-b border-white/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-mono font-bold text-white uppercase">
            <Sparkles className="w-4 h-4 text-white" />
            <span>GUARDIANTAG PHYSICAL HARDWARE LINEUP</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white">
            Safety Hardware Catalog
          </h1>

          <p className="text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto font-normal">
            GTB Biker Tag is our active launch product available for immediate order. Kids, Traveller &amp; Universal decals are coming soon.
          </p>
        </div>
      </section>

      {/* Minimalist Grid: 3D Image & Product Name ONLY */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {PRODUCTS_CATALOG.map((product) => (
            <div
              key={product.id}
              onClick={() => handleOpenProduct(product, 'OVERVIEW')}
              className="hardware-card p-8 rounded-3xl border border-white/20 bg-black/90 cursor-pointer flex flex-col items-center justify-center text-center space-y-6 group hover:border-white hover:bg-white/5 transition-all duration-300 shadow-2xl relative overflow-hidden"
            >
              {/* Coming Soon or Available Now Badge */}
              <div className="absolute top-4 left-4 z-10">
                {product.isComingSoon ? (
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-mono font-extrabold flex items-center gap-1 shadow-lg">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>COMING SOON</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-mono font-extrabold flex items-center gap-1 shadow-lg">
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>AVAILABLE NOW</span>
                  </span>
                )}
              </div>

              {/* Product Watermark */}
              <span className="absolute top-2 right-4 font-bebas text-6xl text-white/5 font-extrabold pointer-events-none">
                {product.sectionNo}
              </span>

              {/* 3D Tag Image */}
              <div className="py-2 flex justify-center group-hover:scale-110 transition duration-300 transform">
                <PhysicalTag3D size="lg" tagType={product.id} serial={`${product.id}-SPECIMEN`} />
              </div>

              {/* Product Name & Price */}
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight font-mono group-hover:text-neutral-200 transition">
                  {product.name}
                </h3>
                <span className="text-xs font-mono text-neutral-400 mt-1 block">
                  {product.price} • {product.isComingSoon ? 'Launching Shortly' : 'In Stock'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* DETAILED PRODUCT & INTERACTIVE CUSTOMIZER MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="hardware-card p-6 sm:p-8 rounded-3xl border-2 border-white/30 max-w-4xl w-full space-y-6 text-left shadow-2xl relative max-h-[92vh] overflow-y-auto font-mono">
            
            {/* Modal Header Bar */}
            <div className="flex items-start justify-between border-b border-white/15 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-black font-extrabold text-[10px]">
                    [{selectedProduct.sectionNo}]
                  </span>
                  {selectedProduct.isComingSoon ? (
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-[10px] font-bold">
                      COMING SOON
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold">
                      AVAILABLE NOW
                    </span>
                  )}
                  <span className="text-xs text-neutral-400 font-bold uppercase">
                    {selectedProduct.category}
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-neutral-400">{selectedProduct.subtitle}</p>
              </div>

              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-white/15 pb-3 overflow-x-auto">
              {[
                { id: 'OVERVIEW', label: '📖 Specs & Features', icon: Info },
                { id: 'CUSTOMIZE', label: '🎨 Custom Laser Etching', icon: Sliders },
                { id: 'CHECKOUT', label: selectedProduct.isComingSoon ? '⏳ Launch Info' : '🛒 Direct Checkout', icon: ShoppingBag },
              ].map((tab) => {
                const IconComp = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-white text-black shadow-lg'
                        : 'bg-white/5 text-neutral-400 hover:bg-white/15 hover:text-white border border-white/10'
                    }`}
                  >
                    <IconComp className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* TAB 1: OVERVIEW & SPECS */}
            {activeTab === 'OVERVIEW' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
                <div className="lg:col-span-5 bg-black/80 p-6 rounded-2xl border border-white/15 flex flex-col items-center justify-center text-center space-y-4">
                  <PhysicalTag3D size="lg" tagType={selectedProduct.id} serial={`${selectedProduct.id}-SAMPLE`} />
                  <div className="space-y-1">
                    <span className="text-2xl font-extrabold text-white">{selectedProduct.price}</span>
                    <span className="text-[10px] text-neutral-400 block uppercase font-bold">
                      {selectedProduct.isComingSoon ? 'Coming Soon' : 'Free Express India Delivery'}
                    </span>
                  </div>
                </div>

                <div className="lg:col-span-7 space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">PRODUCT DESCRIPTION</h3>
                    <p className="text-xs text-neutral-200 leading-relaxed font-sans">{selectedProduct.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">HARDWARE SPECIFICATIONS</h3>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1.5">
                      <div className="flex justify-between"><span className="text-neutral-400">Material:</span><span className="text-white font-bold">{selectedProduct.material}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Durability Rating:</span><span className="text-white font-bold">{selectedProduct.rating}</span></div>
                      <div className="flex justify-between"><span className="text-neutral-400">Privacy Security:</span><span className="text-white font-bold">100% Number Masking Active</span></div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">KEY SAFETY FEATURES</h3>
                    <ul className="space-y-1.5 text-xs text-neutral-300">
                      {selectedProduct.features.map((feat, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex gap-3">
                    {selectedProduct.isComingSoon ? (
                      <button
                        disabled
                        className="w-full py-3.5 rounded-xl bg-neutral-800 text-neutral-400 font-extrabold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-white/10"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Coming Soon — Launching Shortly</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('CHECKOUT')}
                        className="w-full py-3.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-200 transition shadow-xl"
                      >
                        <ShoppingBag className="w-4 h-4 text-black" />
                        <span>Order Now ({selectedProduct.price})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: INTERACTIVE CUSTOM LASER ETCHING PREVIEW */}
            {activeTab === 'CUSTOMIZE' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-in fade-in">
                <div className="lg:col-span-6 bg-black p-6 rounded-2xl border border-white/20 text-center space-y-6">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase block">
                    LIVE 3D LASER ETCHING PREVIEW
                  </span>

                  <div className="py-4 flex justify-center">
                    <PhysicalTag3D size="lg" tagType={selectedProduct.id} serial={customText ? customText.toUpperCase() : `${selectedProduct.id}-0001`} />
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-xs text-neutral-300">
                    <span>Etched Line: <strong className="text-white font-mono">{customText || 'GUARDIANTAG'}</strong></span>
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">CUSTOM LASER TEXT / RIDER NAME</label>
                    <input
                      type="text"
                      maxLength={18}
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value.toUpperCase())}
                      placeholder="e.g. AJAY KUMAR / O+"
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white font-mono text-xs focus:outline-none focus:border-white uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-400 mb-1">OPTICAL FINISH</label>
                    <div className="grid grid-cols-3 gap-2">
                      {(['MATTE', 'GLOSS', 'REFLECTIVE'] as const).map((finish) => (
                        <button
                          key={finish}
                          type="button"
                          onClick={() => setSelectedFinish(finish)}
                          className={`py-2 text-[10px] font-bold rounded-xl border transition ${
                            selectedFinish === finish ? 'bg-white text-black border-white' : 'bg-black text-white border-white/20'
                          }`}
                        >
                          {finish}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3">
                    {selectedProduct.isComingSoon ? (
                      <button
                        disabled
                        className="w-full py-3.5 rounded-xl bg-neutral-800 text-neutral-400 font-extrabold text-xs flex items-center justify-center gap-2 cursor-not-allowed border border-white/10"
                      >
                        <Clock className="w-4 h-4" />
                        <span>Coming Soon — Pre-order Launch Date</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setActiveTab('CHECKOUT')}
                        className="w-full py-3.5 rounded-xl bg-white text-black font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer hover:bg-neutral-200 transition shadow-xl"
                      >
                        <ShoppingBag className="w-4 h-4 text-black" />
                        <span>Proceed with Custom Etching</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: DIRECT CHECKOUT */}
            {activeTab === 'CHECKOUT' && (
              <div className="space-y-6 animate-in fade-in">
                {selectedProduct.isComingSoon ? (
                  <div className="p-8 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-center space-y-4 font-mono">
                    <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-500/50 flex items-center justify-center mx-auto text-amber-400">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-white">{selectedProduct.name} is Coming Soon!</h3>
                      <p className="text-xs text-neutral-300 max-w-md mx-auto">
                        GTB Biker Tag is our active launch product available right now. {selectedProduct.name} will be available for launch shortly.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const bikerTag = PRODUCTS_CATALOG.find((p) => p.id === 'GTB');
                        if (bikerTag) setSelectedProduct(bikerTag);
                      }}
                      className="px-5 py-2.5 rounded-xl bg-white text-black font-extrabold text-xs uppercase shadow-lg hover:bg-neutral-200 transition cursor-pointer"
                    >
                      Switch to GTB Biker Tag (Available Now)
                    </button>
                  </div>
                ) : orderSuccess ? (
                  <div className="p-8 rounded-2xl bg-white text-black text-center space-y-4 animate-in fade-in">
                    <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mx-auto shadow-2xl">
                      <Check className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-2xl font-extrabold">Order Placed Successfully!</h3>
                      <p className="text-xs text-neutral-600">
                        Order Reference ID: <strong className="text-black font-mono">{orderSuccess}</strong>
                      </p>
                      <p className="text-xs text-neutral-700 max-w-md mx-auto pt-2">
                        Your custom etched GTB Biker Tag will be dispatched within 24 hours. A confirmation receipt has been saved to your account.
                      </p>
                    </div>
                    <Button onClick={() => setSelectedProduct(null)} variant="primary">
                      Done
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    {orderError && (
                      <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-mono">
                        {orderError}
                      </div>
                    )}

                    <div className="p-4 rounded-2xl bg-white/5 border border-white/15 flex justify-between items-center text-xs">
                      <div>
                        <span className="font-bold text-white block">{selectedProduct.name}</span>
                        <span className="text-[10px] text-neutral-400">
                          {customText ? `Custom Etching: "${customText}"` : 'Standard Factory Laser Etching'}
                        </span>
                      </div>
                      <span className="text-lg font-extrabold text-white">{selectedProduct.price}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">FULL NAME *</label>
                        <input
                          type="text"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g. Ajay Kumar"
                          className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">MOBILE NUMBER *</label>
                        <input
                          type="tel"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                          placeholder="e.g. +91 98765 43210"
                          className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">EMAIL ADDRESS *</label>
                        <input
                          type="email"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          placeholder="e.g. ajay@example.com"
                          className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-neutral-400 font-bold mb-1">SHIPPING ADDRESS *</label>
                        <input
                          type="text"
                          value={shippingAddress}
                          onChange={(e) => setShippingAddress(e.target.value)}
                          placeholder="e.g. #42, MG Road, Bengaluru 560001"
                          className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-white"
                          required
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        fullWidth
                        disabled={isSubmitting}
                        icon={<Check className="w-4 h-4" />}
                      >
                        {isSubmitting ? 'Dispatching Order...' : `Confirm Order (${selectedProduct.price})`}
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            )}

          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

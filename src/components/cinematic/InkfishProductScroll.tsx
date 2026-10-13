'use client';

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import Link from 'next/link';
import PhysicalTag3D from '@/components/cinematic/PhysicalTag3D';
import { ShoppingBag, Check, ChevronRight, Sliders } from 'lucide-react';

export interface ProductItem {
  id: 'GTB' | 'GTK' | 'GTT' | 'GTU';
  sectionNo: string;
  name: string;
  subtitle: string;
  price: string;
  priceNum: number;
  category: string;
  material: string;
  rating: string;
  features: string[];
}

export const PRODUCTS_DATA: ProductItem[] = [
  {
    id: 'GTB',
    sectionNo: 'S.01',
    name: 'GTB Biker Tag',
    subtitle: 'Helmet & Motorcycle Emergency Safety',
    price: '₹499',
    priceNum: 499,
    category: 'Motorcycle & Helmet Safety',
    material: 'Impact Polycarbonate + 3M High-Tack Bond',
    rating: 'IP68 Waterproof & UV Resistant',
    features: [
      'Curved surface flex design for full-face & modular helmets',
      'Reflective optical QR core visible in night headlights',
      'Impact resistant up to 120km/h wind force & rain',
      'Direct 1-tap accident bystander emergency call dispatch',
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
    rating: '100% Non-Toxic & Washable',
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
    rating: 'Airport Baggage Handling Resistant',
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
    features: [
      'Universal application on car windshields, scooters & laptops',
      'High-contrast safety warning pattern deters theft & misplacement',
      'Peel-resistant adhesive leaves zero sticky residue on removal',
      'Masked emergency call relay for parking & emergency situations',
    ],
  },
];

interface InkfishProductScrollProps {
  onBuyProduct?: (product: ProductItem) => void;
}

export default function InkfishProductScroll({ onBuyProduct }: InkfishProductScrollProps) {
  const targetRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [displayPct, setDisplayPct] = useState(0);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start start', 'end end'],
  });

  // Transform vertical scroll progress into horizontal translateX percentage
  const x = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);
  const rotate3D = useTransform(scrollYProgress, [0, 1], [0, 720]);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    const nextIndex = Math.min(3, Math.floor(latest * 4));
    setActiveIndex(nextIndex);
    setDisplayPct(Math.round(latest * 100));
  });

  const jumpToSlide = (index: number) => {
    if (!targetRef.current) return;
    const elementTop = targetRef.current.offsetTop;
    const totalHeight = targetRef.current.offsetHeight - window.innerHeight;
    const scrollToY = elementTop + (index / 3) * totalHeight;
    window.scrollTo({ top: scrollToY, behavior: 'smooth' });
  };

  return (
    <div className="bg-black text-white selection:bg-white selection:text-black">
      
      {/* UNIFIED RESPONSIVE SCROLL SHOWCASE FOR DESKTOP & MOBILE */}
      <section ref={targetRef} className="relative h-[400vh]">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between py-4 md:py-6">
          
          {/* MOBILE & TABLET NAVIGATION TABS (Top Quick Selector) */}
          <div className="z-30 px-4 md:px-8 pt-2 flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {PRODUCTS_DATA.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() => jumpToSlide(idx)}
                  className={`px-3 py-1 rounded-full font-mono text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    activeIndex === idx
                      ? 'bg-white text-black shadow-lg scale-105'
                      : 'bg-white/10 text-neutral-400 hover:bg-white/20 hover:text-white border border-white/10'
                  }`}
                >
                  <span className="opacity-70">[{p.sectionNo}]</span>
                  <span>{p.id}</span>
                </button>
              ))}
            </div>

            <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-neutral-400">
              <span className="text-white font-bold">{PRODUCTS_DATA[activeIndex].name}</span>
            </div>
          </div>

          {/* HORIZONTAL PANNING TRACK */}
          <div className="relative flex-1 flex items-center overflow-hidden">
            <motion.div
              style={{ x }}
              className="flex w-[400vw] h-full items-center"
            >
              {PRODUCTS_DATA.map((product) => (
                <div
                  key={product.id}
                  className="w-[100vw] h-full flex-shrink-0 flex items-center justify-center px-3 sm:px-6 lg:px-12 py-2"
                >
                  <div className="max-w-6xl w-full max-h-[82vh] md:max-h-none overflow-y-auto md:overflow-visible grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center hardware-card p-5 sm:p-8 lg:p-12 rounded-3xl md:rounded-[40px] border-2 border-white/25 bg-black/90 backdrop-blur-xl relative shadow-2xl">
                    
                    {/* WATERMARK */}
                    <span className="absolute top-2 right-4 sm:top-4 sm:right-8 font-bebas text-5xl sm:text-8xl lg:text-9xl text-white/5 font-extrabold select-none pointer-events-none">
                      {product.sectionNo}
                    </span>

                    {/* 3D HARDWARE SPECIMEN */}
                    <motion.div
                      style={{ rotateY: rotate3D }}
                      className="md:col-span-5 flex flex-col items-center justify-center space-y-3 md:space-y-6 text-center md:border-r md:border-white/15 md:pr-8 py-2"
                    >
                      <div className="block md:hidden">
                        <PhysicalTag3D size="sm" tagType={product.id} serial={`${product.id}-SPECIMEN`} />
                      </div>
                      <div className="hidden md:block">
                        <PhysicalTag3D size="xl" tagType={product.id} serial={`${product.id}-SPECIMEN`} />
                      </div>
                      
                      <div className="flex items-center gap-2 font-mono text-xs">
                        <span className="text-xl sm:text-2xl font-extrabold text-white">{product.price}</span>
                        <span className="text-neutral-400 text-[10px] sm:text-xs">/ Free Shipping India</span>
                      </div>
                    </motion.div>

                    {/* EDITORIAL DETAILS */}
                    <div className="md:col-span-7 space-y-3 sm:space-y-6 font-mono text-left">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                          <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white text-black font-extrabold text-[10px] sm:text-xs">
                            [{product.sectionNo}]
                          </span>
                          <span className="text-[10px] sm:text-xs text-neutral-400 font-bold uppercase tracking-wider">
                            {product.category}
                          </span>
                        </div>

                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                          {product.name}
                        </h2>
                        <p className="text-xs sm:text-sm font-semibold text-neutral-300 mt-1">
                          {product.subtitle}
                        </p>
                      </div>

                      <div className="space-y-1.5 sm:space-y-2 pt-2 border-t border-white/15">
                        <span className="text-[9px] sm:text-[10px] text-neutral-400 font-bold uppercase tracking-widest block">
                          HARDWARE SPECIFICATIONS:
                        </span>
                        <ul className="space-y-1.5 text-[11px] sm:text-xs text-neutral-300">
                          {product.features.map((feat, fIdx) => (
                            <li key={fIdx} className="flex items-start gap-2">
                              <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* ACTION BUTTONS */}
                      <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-4">
                        <button
                          type="button"
                          onClick={() => onBuyProduct ? onBuyProduct(product) : null}
                          className="px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-white hover:bg-neutral-200 text-black font-extrabold text-xs uppercase flex items-center justify-center gap-2 shadow-xl transition transform hover:scale-105 cursor-pointer"
                        >
                          <ShoppingBag className="w-4 h-4 text-black" />
                          <span>Buy Now ({product.price})</span>
                        </button>

                        <Link
                          href={`/customize?model=${product.id}`}
                          className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/20 flex items-center justify-center gap-2 transition"
                        >
                          <Sliders className="w-4 h-4" />
                          <span>Custom Laser Etch</span>
                        </Link>
                      </div>

                    </div>

                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* BOTTOM SCROLL PROGRESS BAR */}
          <div className="px-4 md:px-8 z-30 font-mono text-xs border-t border-white/10 pt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-neutral-400 text-[10px] sm:text-xs">
              <span className="hidden xs:inline">SCROLL DOWN TO EXPLORE PRODUCTS</span>
              <span className="xs:hidden">SCROLL DOWN</span>
              <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse text-white" />
            </div>

            <div className="flex items-center gap-3">
              <div className="w-28 sm:w-48 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <motion.div
                  style={{ scaleX: scrollYProgress, transformOrigin: 'left' }}
                  className="h-full bg-white shadow-[0_0_15px_#FFFFFF]"
                />
              </div>
              <span className="font-extrabold text-white text-[10px] sm:text-xs min-w-[35px] sm:min-w-[45px] text-right">
                [{displayPct}%]
              </span>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}

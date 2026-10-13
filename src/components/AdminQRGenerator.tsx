'use client';

import React, { useState, useEffect } from 'react';
import { QrCode, Plus, CheckCircle2, Database } from 'lucide-react';
import { QrTag, TagType } from '@/lib/types';
import { getAllTags, provisionNewTags } from '@/lib/tagService';

export default function AdminQRGenerator() {
  const [tags, setTags] = useState<QrTag[]>([]);
  const [selectedType, setSelectedType] = useState<TagType>('GTB');
  const [quantity, setQuantity] = useState(5);
  const [provisionMessage, setProvisionMessage] = useState<string | null>(null);

  useEffect(() => {
    setTags(getAllTags());
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    const newlyCreated = provisionNewTags(selectedType, Number(quantity));
    setTags(getAllTags());
    setProvisionMessage(`Successfully provisioned ${newlyCreated.length} new ${selectedType} tags! Range: ${newlyCreated[0]?.qrId} to ${newlyCreated[newlyCreated.length - 1]?.qrId}. Synced to Supabase.`);
    setTimeout(() => setProvisionMessage(null), 4000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="bg-black text-white px-2.5 py-0.5 rounded-full text-[10px] font-black">Active &amp; Registered</span>;
      case 'unregistered':
        return <span className="bg-neutral-100 text-black border border-neutral-300 px-2.5 py-0.5 rounded-full text-[10px] font-black">Unregistered</span>;
      default:
        return <span className="bg-neutral-200 text-neutral-600 px-2.5 py-0.5 rounded-full text-[10px] font-black">Disabled</span>;
    }
  };

  return (
    <section id="admin" className="py-20 bg-white text-black border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-black text-white text-xs font-black uppercase mb-2">
              <Database className="w-3.5 h-3.5 text-[#FF5500]" />
              Medusa Admin Custom Extension Widget
            </div>
            <h2 className="text-3xl font-black text-black">
              QR Tag Generator &amp; Inventory Provisioning
            </h2>
            <p className="text-xs sm:text-sm text-neutral-800 font-bold mt-1">
              Store Manager Dashboard extension — batch produce GTB, GTK, GTT, and GTU tags with sequential IDs.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-neutral-100 border border-neutral-300 px-3 py-1.5 rounded-xl font-mono text-black font-bold">
              Total Tags: <strong>{tags.length}</strong>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Batch Provisioning Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border-2 border-black shadow-xs space-y-5">
            <h3 className="text-lg font-black text-black flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#FF5500]" />
              Batch Provision New Tag Batch
            </h3>

            <form onSubmit={handleGenerate} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-black mb-1">Tag Category</label>
                <select
                  value={selectedType}
                  onChange={e => setSelectedType(e.target.value as TagType)}
                  className="w-full bg-neutral-50 border border-neutral-300 text-black rounded-xl p-3 text-xs font-bold focus:border-black focus:outline-none"
                >
                  <option value="GTB">GTB — Bikers (Helmet &amp; Motorcycle)</option>
                  <option value="GTK">GTK — Kids (Backpack &amp; Shoes)</option>
                  <option value="GTT">GTT — Travellers (Luggage &amp; Bags)</option>
                  <option value="GTU">GTU — Universal (Vehicle Decals &amp; Keys)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-black mb-1">Quantity to Generate</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="w-full bg-neutral-50 border border-neutral-300 text-black rounded-xl p-3 text-xs font-bold focus:border-black focus:outline-none"
                />
              </div>

              {provisionMessage && (
                <div className="bg-neutral-100 border border-neutral-300 text-black p-3 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF5500]" />
                  <span>{provisionMessage}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#FF5500] hover:bg-[#E04B00] text-white font-black text-xs shadow-xs transition flex items-center justify-center gap-2"
              >
                <QrCode className="w-4 h-4" />
                <span>Generate Batch &amp; Print Ready Sequential IDs</span>
              </button>
            </form>
          </div>

          {/* Provisioned Tag Inventory Table */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border-2 border-black shadow-xs">
            <h3 className="text-lg font-black text-black mb-4 flex items-center justify-between">
              <span>Live Tag Database</span>
              <span className="text-xs font-mono text-neutral-600 font-bold">Medusa &lt;&gt; Supabase Table</span>
            </h3>

            <div className="overflow-x-auto max-h-[340px] overflow-y-auto pr-1">
              <table className="w-full text-left text-xs text-black font-semibold">
                <thead className="bg-neutral-100 text-black font-black sticky top-0 border-b border-neutral-300">
                  <tr>
                    <th className="p-3">QR ID</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Created</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {tags.map(t => (
                    <tr key={t.id} className="hover:bg-neutral-50 transition">
                      <td className="p-3 font-mono font-black text-[#FF5500]">{t.qrId}</td>
                      <td className="p-3 font-black text-black">{t.tagType}</td>
                      <td className="p-3">{getStatusBadge(t.status)}</td>
                      <td className="p-3 text-neutral-700 font-mono font-bold">{new Date(t.createdAt || Date.now()).toLocaleDateString()}</td>
                      <td className="p-3 text-right">
                        <a
                          href={`/tag/${t.qrId}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-black text-black hover:text-[#FF5500] underline"
                        >
                          View Scan Page
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

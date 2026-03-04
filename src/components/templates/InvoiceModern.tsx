import React from 'react';
import { formatCurrency } from '@/lib/utils';

export function InvoiceModern({ data }: any) {
    const { company, client, document, items, totals, color } = data;
    return (
        <div className="bg-white text-sm" style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
            {/* Full-width dark hero header */}
            <div className="p-10 pb-8" style={{ backgroundColor: color.primary }}>
                <div className="flex justify-between items-start">
                    <div>
                        {company.logo
                            ? <img src={company.logo} alt={company.name} className="h-14 object-contain mb-4 brightness-0 invert" />
                            : <h1 className="text-3xl font-black text-white tracking-tight mb-1">{company.name}</h1>}
                        <p className="text-white/60 text-xs">RNC: {company.rnc}</p>
                        <p className="text-white/60 text-xs">{company.address}</p>
                        <p className="text-white/60 text-xs">{company.phone} · {company.email}</p>
                    </div>
                    <div className="text-right">
                        <div className="inline-block bg-white/10 backdrop-blur px-6 py-4 rounded-2xl">
                            <p className="text-white/50 text-[10px] uppercase tracking-widest font-bold mb-1">NCF</p>
                            <p className="text-white text-xl font-black font-mono">{document.number}</p>
                            <p className="text-white/60 text-xs mt-2">{document.date}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-10 pt-8 space-y-8">
                {/* Client strip */}
                <div className="flex gap-8 justify-between">
                    <div className="flex-1 bg-gray-50 rounded-2xl p-6">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Facturar a</p>
                        <p className="font-bold text-lg text-gray-900">{client.name}</p>
                        <p className="text-xs text-gray-500">RNC: {client.rnc}</p>
                        {client.address && <p className="text-xs text-gray-500 mt-1">{client.address}</p>}
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6 min-w-[200px]">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Detalles</p>
                        {document.ncf && <p className="flex justify-between text-xs mb-1"><span className="text-gray-400">NCF</span><span className="font-mono font-bold">{document.ncf}</span></p>}
                        <p className="flex justify-between text-xs mb-1"><span className="text-gray-400">Emisión</span><span className="font-bold">{document.date}</span></p>
                        {document.dueDate && <p className="flex justify-between text-xs"><span className="text-gray-400">Vence</span><span className="font-bold">{document.dueDate}</span></p>}
                        {document.seller && <p className="flex justify-between text-xs mt-1"><span className="text-gray-400">Vendedor</span><span className="font-bold">{document.seller}</span></p>}
                    </div>
                </div>

                {/* Items */}
                <div>
                    <div className="rounded-2xl overflow-hidden border border-gray-100">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest font-bold text-white" style={{ backgroundColor: color.primary }}>
                                    <th className="py-3 px-5">Descripción</th>
                                    <th className="py-3 px-5 text-center">Cant.</th>
                                    <th className="py-3 px-5 text-right">Precio</th>
                                    <th className="py-3 px-5 text-center">ITBIS</th>
                                    <th className="py-3 px-5 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item: any, i: number) => (
                                    <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/60"}>
                                        <td className="py-3 px-5">
                                            <p className="font-semibold text-gray-800">{item.name || item.description}</p>
                                            {item.code && <p className="text-xs font-mono text-gray-400">{item.code}</p>}
                                        </td>
                                        <td className="py-3 px-5 text-center text-gray-600">{item.qty}</td>
                                        <td className="py-3 px-5 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                        <td className="py-3 px-5 text-center text-gray-400 text-xs">{item.itbis}%</td>
                                        <td className="py-3 px-5 text-right font-bold text-gray-800">{formatCurrency((item.price * item.qty) * (1 + (item.itbis || 0) / 100))}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                    <div className="w-64 space-y-2">
                        <div className="flex justify-between text-gray-500 text-sm"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                        {totals.discount > 0 && <div className="flex justify-between text-red-500 text-sm"><span>Descuento</span><span>-{formatCurrency(totals.discount)}</span></div>}
                        <div className="flex justify-between text-gray-500 text-sm"><span>ITBIS</span><span>{formatCurrency(totals.itbis || totals.tax)}</span></div>
                        <div className="flex justify-between items-center text-white text-lg font-black px-5 py-4 rounded-2xl" style={{ backgroundColor: color.primary }}>
                            <span>Total</span>
                            <span>{formatCurrency(totals.total)}</span>
                        </div>
                    </div>
                </div>

                {data.notes && <p className="text-xs text-gray-400 border-t pt-4">{data.notes}</p>}
            </div>
        </div>
    );
}

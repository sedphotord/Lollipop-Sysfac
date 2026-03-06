import React from 'react';
import { formatCurrency } from '@/lib/utils';

export function InvoiceElegant({ data }: any) {
    const { company, client, document, items, totals, color } = data;
    const ncfLabel = document.number?.startsWith('E') ? 'e-CF' : 'NCF';
    return (
        <div className="bg-gray-50 text-sm" style={{ fontFamily: 'Inter, sans-serif', minHeight: '100vh' }}>
            {/* Subtle pattern header */}
            <div className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-10 py-8">
                    <div className="flex justify-between items-center">
                        <div>
                            {company.logo
                                ? <img src={company.logo} alt={company.name} className="h-12 object-contain" />
                                : <h1 className="text-2xl font-bold" style={{ color: color.primary }}>{company.name}</h1>}
                        </div>
                        <div className="text-right">
                            <div className="inline-flex items-center gap-3 border rounded-xl px-5 py-3" style={{ borderColor: color.primary }}>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{ncfLabel}</p>
                                    <p className="text-base font-black text-gray-900 font-mono">{document.number}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-10 py-8 space-y-6">
                {/* Info bar */}
                <div className="grid grid-cols-4 gap-4">
                    {[
                        { label: 'Emisión', value: document.date },
                        { label: 'Vencimiento', value: document.dueDate || '—' },
                        { label: 'Tipo', value: document.type || 'Crédito Fiscal' },
                        { label: 'Condición', value: document.terms || 'Contado' },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-xs">
                            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">{label}</p>
                            <p className="font-semibold text-gray-800 text-xs truncate">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Client */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3">Facturado a</p>
                    <p className="font-bold text-xl text-gray-900">{client.name}</p>
                    <p className="text-xs text-gray-500 mt-1">RNC: {client.rnc}</p>
                    {client.address && <p className="text-xs text-gray-400 mt-1">{client.address}</p>}
                </div>

                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr className="text-[10px] uppercase tracking-widest font-bold border-b border-gray-100">
                                <th className="py-4 px-6 text-gray-400">Descripción</th>
                                <th className="py-4 px-6 text-center text-gray-400">Cant.</th>
                                <th className="py-4 px-6 text-right text-gray-400">Precio</th>
                                <th className="py-4 px-6 text-center text-gray-400">ITBIS</th>
                                <th className="py-4 px-6 text-right text-gray-400">Total</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map((item: any, i: number) => (
                                <tr key={i} className="hover:bg-gray-50/50">
                                    <td className="py-4 px-6">
                                        <p className="font-semibold text-gray-800">{item.name || item.description}</p>
                                        {item.code && <p className="text-gray-400 font-mono text-[10px]">{item.code}</p>}
                                    </td>
                                    <td className="py-4 px-6 text-center text-gray-500">{item.qty}</td>
                                    <td className="py-4 px-6 text-right text-gray-500">{formatCurrency(item.price)}</td>
                                    <td className="py-4 px-6 text-center text-gray-400">{item.itbis}%</td>
                                    <td className="py-4 px-6 text-right font-bold text-gray-800">{formatCurrency((item.price * item.qty) * (1 + (item.itbis || 0) / 100))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals inside the card */}
                    <div className="border-t border-gray-100 px-6 py-4 flex justify-end">
                        <div className="space-y-1.5 w-56 text-xs">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                            {totals.discount > 0 && <div className="flex justify-between text-red-400"><span>Descuento</span><span>-{formatCurrency(totals.discount)}</span></div>}
                            <div className="flex justify-between text-gray-500"><span>ITBIS</span><span>{formatCurrency(totals.itbis || totals.tax)}</span></div>
                            <div className="flex justify-between text-base font-black pt-2 border-t border-gray-200" style={{ color: color.primary }}>
                                <span>Total</span>
                                <span>{formatCurrency(totals.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-300 text-[10px] uppercase tracking-widest">{company.name} · Gracias por confiar en nosotros</p>
            </div>
        </div>
    );
}

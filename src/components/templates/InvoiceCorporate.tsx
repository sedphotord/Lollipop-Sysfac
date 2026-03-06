import React from 'react';
import { formatCurrency } from '@/lib/utils';

export function InvoiceCorporate({ data }: any) {
    const { company, client, document, items, totals, color } = data;
    const ncfLabel = document.number?.startsWith('E') ? 'e-CF' : 'NCF';
    return (
        <div className="bg-white text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            {/* Left sidebar accent + header */}
            <div className="flex min-h-screen">
                {/* Left accent bar */}
                <div className="w-2 shrink-0" style={{ backgroundColor: color.primary }} />

                <div className="flex-1 p-10 space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-6 border-b-2" style={{ borderColor: color.primary }}>
                        <div>
                            {company.logo
                                ? <img src={company.logo} alt={company.name} className="h-14 object-contain mb-3" />
                                : <h1 className="text-2xl font-black text-gray-900 tracking-tight mb-1" style={{ color: color.primary }}>{company.name}</h1>}
                            <p className="text-gray-500 text-xs">RNC: {company.rnc}</p>
                            <p className="text-gray-500 text-xs">{company.address}</p>
                            <p className="text-gray-500 text-xs">{company.phone} · {company.email}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-4xl font-black tracking-tighter mb-1" style={{ color: color.primary }}>FACTURA</p>
                            <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">{ncfLabel}: {document.number}</p>
                            <div className="mt-3 space-y-0.5">
                                <p className="text-xs text-gray-500">Emisión: <span className="font-bold text-gray-700">{document.date}</span></p>
                                {document.dueDate && <p className="text-xs text-gray-500">Vence: <span className="font-bold text-gray-700">{document.dueDate}</span></p>}
                                {document.ncf && <p className="text-xs text-gray-400 font-mono">{document.ncf}</p>}
                            </div>
                        </div>
                    </div>

                    {/* Client */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: color.primary, borderColor: color.primary }}>Facturado a</p>
                            <p className="font-bold text-base text-gray-900">{client.name}</p>
                            <p className="text-xs text-gray-500">RNC: {client.rnc}</p>
                            {client.address && <p className="text-xs text-gray-500 mt-1">{client.address}</p>}
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest mb-2 pb-1 border-b" style={{ color: color.primary, borderColor: color.primary }}>Términos</p>
                            {document.terms && <p className="text-xs text-gray-700">{document.terms}</p>}
                            {document.seller && <p className="text-xs text-gray-500 mt-1">Vendedor: <span className="font-bold text-gray-700">{document.seller}</span></p>}
                        </div>
                    </div>

                    {/* Items table */}
                    <table className="w-full text-left text-xs">
                        <thead>
                            <tr style={{ backgroundColor: color.primary }} className="text-white uppercase tracking-widest font-bold">
                                <th className="py-3 px-4">Ítem</th>
                                <th className="py-3 px-4 text-center">Cant.</th>
                                <th className="py-3 px-4 text-right">Precio Unit.</th>
                                <th className="py-3 px-4 text-center">ITBIS %</th>
                                <th className="py-3 px-4 text-right">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item: any, i: number) => (
                                <tr key={i} className="border-b border-gray-100">
                                    <td className="py-3 px-4">
                                        <p className="font-semibold text-gray-800">{item.name || item.description}</p>
                                        {item.code && <p className="text-gray-400 font-mono text-[10px] mt-0.5">{item.code}</p>}
                                    </td>
                                    <td className="py-3 px-4 text-center text-gray-600">{item.qty}</td>
                                    <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(item.price)}</td>
                                    <td className="py-3 px-4 text-center text-gray-400">{item.itbis}%</td>
                                    <td className="py-3 px-4 text-right font-bold text-gray-800">{formatCurrency((item.price * item.qty) * (1 + (item.itbis || 0) / 100))}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Totals */}
                    <div className="flex justify-end">
                        <div className="w-64 space-y-1.5 text-xs">
                            <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                            {totals.discount > 0 && <div className="flex justify-between text-red-500"><span>Descuento</span><span>-{formatCurrency(totals.discount)}</span></div>}
                            <div className="flex justify-between text-gray-500"><span>ITBIS</span><span>{formatCurrency(totals.itbis || totals.tax)}</span></div>
                            <div className="flex justify-between font-black text-base px-4 py-3 text-white rounded-xl mt-2" style={{ backgroundColor: color.primary }}>
                                <span>TOTAL RD$</span><span>{formatCurrency(totals.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="text-center text-gray-300 text-[10px] pt-6 border-t">
                        Documento generado por Lollipop Commercial · {company.email}
                    </div>
                </div>
            </div>
        </div>
    );
}

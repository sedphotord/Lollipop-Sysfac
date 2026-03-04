import React from 'react';
import { formatCurrency } from '@/lib/utils';
// Note: recovered basic template
export function InvoiceStandard({ data }: any) {
    const { company, client, document, items, totals, color } = data;
    return (
        <div className="bg-white p-8 max-w-4xl mx-auto rounded-xl shadow-sm text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="flex justify-between items-start mb-8 border-b pb-6" style={{ borderColor: color.primary }}>
                <div>
                    {company.logo ? (
                        <img src={company.logo} alt={company.name} className="h-16 object-contain mb-4" />
                    ) : (
                        <h1 className="text-3xl font-bold mb-2" style={{ color: color.primary }}>{company.name}</h1>
                    )}
                    <p className="text-gray-600 font-medium">RNC: {company.rnc}</p>
                    <p className="text-gray-600 text-xs">{company.address}</p>
                    <p className="text-gray-600 text-xs">{company.phone} | {company.email}</p>
                </div>
                <div className="text-right">
                    <h2 className="text-2xl font-black uppercase tracking-widest text-gray-800 mb-2">FACTURA</h2>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <p className="flex justify-between gap-8 mb-1"><span className="text-gray-500">NCF:</span> <span className="font-mono font-bold">{document.number}</span></p>
                        <p className="flex justify-between gap-8 mb-1"><span className="text-gray-500">Fecha:</span> <span className="font-bold">{document.date}</span></p>
                        {document.ncf && <p className="flex justify-between gap-8 mb-1"><span className="text-gray-500">NCF:</span> <span className="font-bold text-xs">{document.ncf}</span></p>}
                        {document.dueDate && <p className="flex justify-between gap-8"><span className="text-gray-500">Vence:</span> <span className="font-bold text-xs">{document.dueDate}</span></p>}
                    </div>
                </div>
            </div>

            <div className="mb-8 grid grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Facturar a</h3>
                    <p className="font-bold text-lg text-gray-800 mb-1">{client.name}</p>
                    <p className="flex justify-between text-sm mb-1"><span className="text-gray-500">RNC/Cédula:</span> <span className="font-medium">{client.rnc}</span></p>
                    {client.address && <p className="flex justify-between text-sm mb-1"><span className="text-gray-500">Dirección:</span> <span className="font-medium text-right max-w-[200px] truncate">{client.address}</span></p>}
                    {client.phone && <p className="flex justify-between text-sm"><span className="text-gray-500">Teléfono:</span> <span className="font-medium">{client.phone}</span></p>}
                </div>
                {document.seller && (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 flex flex-col justify-center">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Vendedor Asignado</h3>
                        <p className="font-bold text-gray-800">{document.seller}</p>
                    </div>
                )}
            </div>

            <div className="mb-8 rounded-2xl overflow-hidden border border-gray-200">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr style={{ backgroundColor: color.primary }} className="text-white text-xs uppercase tracking-widest">
                            <th className="py-4 px-6 font-bold">Descripción</th>
                            <th className="py-4 px-6 font-bold text-center">Cant.</th>
                            <th className="py-4 px-6 font-bold text-right">Precio</th>
                            <th className="py-4 px-6 font-bold text-center">ITBIS</th>
                            <th className="py-4 px-6 font-bold text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {items.map((item: any, index: number) => (
                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                <td className="py-4 px-6">
                                    <p className="font-bold text-gray-800">{item.name}</p>
                                    {(item.description || item.code) && (
                                        <p className="text-xs text-gray-500 mt-1 max-w-[300px] truncate">
                                            {item.code && <span className="font-mono bg-gray-100 px-1 py-0.5 rounded mr-2">{item.code}</span>}
                                            {item.description}
                                        </p>
                                    )}
                                </td>
                                <td className="py-4 px-6 text-center font-medium">{item.qty}</td>
                                <td className="py-4 px-6 text-right font-medium">{formatCurrency(item.price)}</td>
                                <td className="py-4 px-6 text-center text-gray-500 text-xs">{item.itbis}%</td>
                                <td className="py-4 px-6 text-right font-bold">{formatCurrency((item.price * item.qty) * (1 + item.itbis / 100))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mb-12">
                <div className="w-72 bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex justify-between text-gray-600 font-medium">
                        <span>Subtotal</span>
                        <span>{formatCurrency(totals.subtotal)}</span>
                    </div>
                    {totals.discount > 0 && (
                        <div className="flex justify-between text-red-500 font-medium">
                            <span>Descuento</span>
                            <span>-{formatCurrency(totals.discount)}</span>
                        </div>
                    )}
                    <div className="flex justify-between text-gray-600 font-medium">
                        <span>ITBIS</span>
                        <span>{formatCurrency(totals.itbis)}</span>
                    </div>
                    <div className="h-px bg-gray-200 my-2"></div>
                    <div className="flex justify-between text-xl font-black" style={{ color: color.primary }}>
                        <span>Total</span>
                        <span>{formatCurrency(totals.total)}</span>
                    </div>
                </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
                <p>Gracias por hacer negocios con nosotros.</p>
                <p className="mt-1">Factura generada por Lollipop Commercial</p>
            </div>
        </div>
    );
}

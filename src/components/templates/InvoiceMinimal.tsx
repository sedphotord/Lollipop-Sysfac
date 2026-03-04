import React from 'react';
import { formatCurrency } from '@/lib/utils';

export function InvoiceMinimal({ data }: any) {
    const { company, client, document, items, totals, color } = data;
    return (
        <div className="bg-white text-gray-800 p-12 max-w-3xl mx-auto" style={{ fontFamily: '"Georgia", serif', minHeight: '100vh' }}>
            {/* Ultra-clean header */}
            <div className="mb-12">
                <div className="flex justify-between items-start">
                    <div>
                        {company.logo
                            ? <img src={company.logo} alt={company.name} className="h-12 object-contain mb-3" />
                            : <p className="text-lg font-bold text-gray-900 mb-1">{company.name}</p>}
                        <p className="text-gray-400 text-xs">{company.rnc}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Factura</p>
                        <p className="text-2xl font-bold text-gray-900">{document.number}</p>
                    </div>
                </div>
                <div className="mt-6 h-px bg-gray-200" />
            </div>

            {/* Minimal metadata */}
            <div className="grid grid-cols-3 gap-8 mb-10 text-xs text-gray-600">
                <div>
                    <p className="uppercase tracking-widest text-gray-400 text-[10px] mb-1">Fecha</p>
                    <p className="font-semibold">{document.date}</p>
                </div>
                {document.dueDate && <div>
                    <p className="uppercase tracking-widest text-gray-400 text-[10px] mb-1">Vencimiento</p>
                    <p className="font-semibold">{document.dueDate}</p>
                </div>}
                {document.ncf && <div>
                    <p className="uppercase tracking-widest text-gray-400 text-[10px] mb-1">NCF</p>
                    <p className="font-semibold font-mono">{document.ncf}</p>
                </div>}
            </div>

            {/* Client */}
            <div className="mb-10">
                <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-2">Facturado a</p>
                <p className="text-base font-bold">{client.name}</p>
                <p className="text-xs text-gray-500">RNC: {client.rnc}</p>
                {client.address && <p className="text-xs text-gray-400 mt-0.5">{client.address}</p>}
            </div>

            {/* Items — borderless, pure typography */}
            <div className="mb-8">
                <div className="grid grid-cols-12 text-[10px] uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-2 mb-4">
                    <span className="col-span-6">Descripción</span>
                    <span className="col-span-2 text-center">Cant.</span>
                    <span className="col-span-2 text-right">Precio</span>
                    <span className="col-span-2 text-right">Total</span>
                </div>
                {items.map((item: any, i: number) => (
                    <div key={i} className="grid grid-cols-12 py-3 border-b border-gray-100 text-sm">
                        <span className="col-span-6 font-medium">{item.name || item.description}</span>
                        <span className="col-span-2 text-center text-gray-500">{item.qty}</span>
                        <span className="col-span-2 text-right text-gray-500">{formatCurrency(item.price)}</span>
                        <span className="col-span-2 text-right font-semibold">{formatCurrency(item.price * item.qty)}</span>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="flex justify-end">
                <div className="w-56 space-y-2 text-xs">
                    <div className="flex justify-between text-gray-500"><span>Subtotal</span><span>{formatCurrency(totals.subtotal)}</span></div>
                    {totals.discount > 0 && <div className="flex justify-between text-gray-400"><span>Descuento</span><span>-{formatCurrency(totals.discount)}</span></div>}
                    <div className="flex justify-between text-gray-500"><span>ITBIS</span><span>{formatCurrency(totals.itbis || totals.tax)}</span></div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-900 pt-3 mt-3">
                        <span>Total</span>
                        <span>{formatCurrency(totals.total)}</span>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-16 pt-6 border-t border-gray-100 text-center">
                <p className="text-gray-300 text-[10px] tracking-widest uppercase">{company.name} · {company.phone} · {company.email}</p>
            </div>
        </div>
    );
}

import React from 'react';
import { formatCurrency } from '@/lib/utils';
// Note: recreated basic TicketPOS
export function TicketPOS({ data }: any) {
    const { company, client, document, items, totals, color } = data;
    const ncfLabel = document.number?.startsWith('E') ? 'e-CF' : 'NCF';
    return (
        <div id="print-ticket" className="bg-white p-4 max-w-[80mm] mx-auto text-[11px] leading-tight" style={{ fontFamily: 'monospace' }}>
            <div className="text-center mb-4">
                {company.logo ? (
                    <img src={company.logo} alt={company.name} className="h-12 w-12 mx-auto object-contain mb-2 grayscale" />
                ) : (
                    <h1 className="text-lg font-bold mb-1">{company.name}</h1>
                )}
                <p>RNC: {company.rnc}</p>
                <p className="whitespace-pre-wrap">{company.address}</p>
                <p>{company.phone}</p>
            </div>
            <div className="border-b border-t border-black py-2 mb-2 border-dashed">
                <p className="flex justify-between"><span>{ncfLabel}:</span> <span className="font-bold">{document.number}</span></p>
                <p className="flex justify-between"><span>FECHA:</span> <span>{document.date}</span></p>
                {document.ncf && <p className="flex justify-between"><span>{ncfLabel}:</span> <span>{document.ncf}</span></p>}
                <p className="flex justify-between"><span>CLIENTE:</span> <span>{client.name}</span></p>
                <p className="flex justify-between"><span>RNC/CED:</span> <span>{client.rnc}</span></p>
                {document.seller && <p className="flex justify-between"><span>CAJERO:</span> <span>{document.seller.substring(0, 15)}</span></p>}
            </div>
            <table className="w-full text-left mb-2">
                <thead>
                    <tr className="border-b border-black border-dashed">
                        <th className="py-1">CANT</th>
                        <th className="py-1">DESC</th>
                        <th className="py-1 text-right">TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: any, idx: number) => (
                        <tr key={idx}>
                            <td className="py-1 align-top">{item.qty}</td>
                            <td className="py-1 align-top pr-1">
                                {item.name.substring(0, 20)}
                            </td>
                            <td className="py-1 text-right align-top">{formatCurrency((item.price * item.qty) * (1 + item.itbis / 100))}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="border-t border-black border-dashed pt-2 mb-4">
                <div className="flex justify-between">
                    <span>SUBTOTAL:</span>
                    <span>{formatCurrency(totals.subtotal)}</span>
                </div>
                {totals.discount > 0 && (
                    <div className="flex justify-between">
                        <span>DESC:</span>
                        <span>-{formatCurrency(totals.discount)}</span>
                    </div>
                )}
                <div className="flex justify-between">
                    <span>ITBIS:</span>
                    <span>{formatCurrency(totals.itbis)}</span>
                </div>
                <div className="flex justify-between text-[14px] font-bold mt-1 pt-1 border-t border-black">
                    <span>TOTAL:</span>
                    <span>{formatCurrency(totals.total)}</span>
                </div>
            </div>
            <div className="text-center text-[10px] mt-4">
                <p>¡Gracias por su compra!</p>
                <p>Generado por Sysfac / Lollipop</p>
            </div>
        </div>
    );
}

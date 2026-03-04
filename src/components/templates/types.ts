import React from 'react';

type NodeOr<T> = T | React.ReactNode;

export interface TemplateData {
    company: {
        name: NodeOr<string>;
        rnc: NodeOr<string>;
        phone: NodeOr<string>;
        email: NodeOr<string>;
        address: NodeOr<string>;
        logo?: string;
        website?: string;
    };
    client: {
        name: NodeOr<string>;
        rnc: NodeOr<string>;
        address?: NodeOr<string>;
        phone?: string;
        email?: string;
    };
    document: {
        type: NodeOr<string>;
        number: NodeOr<string>;
        date: NodeOr<string>;
        dueDate?: NodeOr<string>;
        ncf?: NodeOr<string>;
        ncfVence?: NodeOr<string>;
        terms?: NodeOr<string>;
        seller?: NodeOr<string>;
        notes?: NodeOr<string>;
    };
    items: Array<{
        id: string;
        image?: string;
        description: NodeOr<string>;
        qty: NodeOr<number>;
        price: NodeOr<number>;
        discount: number;
        tax: number;
        total: number;
    }>;
    totals: {
        subtotal: number;
        discount: number;
        tax: number;
        total: number;
    };
    payments?: Array<{
        date: string;
        method: string;
        amount: number;
        reference?: string;
    }>;
    color?: {
        primary: string;
        secondary?: string;
    };
}

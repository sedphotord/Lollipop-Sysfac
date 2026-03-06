export const NCF_PREFIX = {
    B01: "B01", // Crédito Fiscal
    B02: "B02", // Consumo
    B04: "B04", // Notas de Crédito
    B14: "B14", // Gubernamental
    B15: "B15", // Exportación
};

export const ECF_PREFIX = {
    B01: "E31", // Factura de Crédito Fiscal Electrónica
    B02: "E32", // Factura de Consumo Electrónica
    B04: "E34", // Nota de Crédito Electrónica
    B14: "E44", // Gubernamental Electrónica
    B15: "E45", // Exportación Electrónica
};

/**
 * Genera el siguiente NCF para un tipo específico basándose en el historial de facturas.
 * El NCF tradicional es de 11 caracteres: 3 de prefijo + 8 números secuenciales.
 * El e-CF electrónico es de 13 caracteres: 3 de prefijo + 10 números secuenciales.
 */
export function generateNextNCF(tipo: string, existingInvoices: any[], mode: 'tradicional' | 'electronico' = 'tradicional'): string {
    const isElectronic = mode === 'electronico';
    const prefixDict = isElectronic ? ECF_PREFIX : NCF_PREFIX;
    const prefix = prefixDict[tipo as keyof typeof prefixDict] || (isElectronic ? "E31" : "B01");
    const numLength = isElectronic ? 10 : 8;

    // Filtrar facturas que tengan el mismo prefijo en su NCF
    const validNCFs = existingInvoices
        .map(inv => inv.ecf || inv.ncf || "")
        .filter(ncf => typeof ncf === "string" && ncf.startsWith(prefix));

    if (validNCFs.length === 0) {
        // Si no hay facturas de este tipo, empezar con 1
        return `${prefix}${"1".padStart(numLength, '0')}`;
    }

    // Extraer la parte numérica, convertir a entero y buscar el máximo
    let maxNum = 0;
    validNCFs.forEach(ncf => {
        const numStr = ncf.substring(3); // Quitar prefijo (B01 o E31)
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) {
            maxNum = num;
        }
    });

    // Siguiente número
    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(numLength, '0')}`;
}

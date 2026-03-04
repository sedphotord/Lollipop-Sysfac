export const NCF_PREFIX = {
    B01: "B01", // Crédito Fiscal
    B02: "B02", // Consumo
    B04: "B04", // Notas de Crédito
    B14: "B14", // Gubernamental
    B15: "B15", // Exportación
};

/**
 * Genera el siguiente NCF para un tipo específico basándose en el historial de facturas.
 * El NCF es de 11 caracteres: 3 de prefijo + 8 números secuenciales.
 */
export function generateNextNCF(tipo: string, existingInvoices: any[]): string {
    const prefix = NCF_PREFIX[tipo as keyof typeof NCF_PREFIX] || "B01";

    // Filtrar facturas que tengan el mismo prefijo en su NCF
    const validNCFs = existingInvoices
        .map(inv => inv.ecf || inv.ncf || "")
        .filter(ncf => typeof ncf === "string" && ncf.startsWith(prefix));

    if (validNCFs.length === 0) {
        // Si no hay facturas de este tipo, empezar con 1
        return `${prefix}${"1".padStart(8, '0')}`;
    }

    // Extraer la parte numérica, convertir a entero y buscar el máximo
    let maxNum = 0;
    validNCFs.forEach(ncf => {
        const numStr = ncf.substring(3); // Quitar B01
        const num = parseInt(numStr, 10);
        if (!isNaN(num) && num > maxNum) {
            maxNum = num;
        }
    });

    // Siguiente número
    const nextNum = maxNum + 1;
    return `${prefix}${nextNum.toString().padStart(8, '0')}`;
}

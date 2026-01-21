
export const formatPrice = (value: string | number): string => {
    // Convert to string and remove non-numeric characters
    const stringValue = String(value).replace(/\D/g, '');

    if (!stringValue) return '';

    // Convert to number and format as CLP
    const numberValue = parseInt(stringValue, 10);
    return new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        minimumFractionDigits: 0
    }).format(numberValue);
};

export const parsePrice = (value: string): number => {
    // Remove non-numeric characters to get the raw number
    const numericString = value.replace(/\D/g, '');
    return parseInt(numericString, 10) || 0;
};

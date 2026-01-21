export const limpiarRut = (rut: string) => {
    return (rut || "").toString().replace(/[^0-9kK]/g, '').toUpperCase();
};

export const formatearRut = (rut: string) => {
    const r = limpiarRut(rut);
    if (!r) return "";
    let cuerpo = r.slice(0, -1);
    const dv = r.slice(-1);
    let conPuntos = '';

    while (cuerpo.length > 3) {
        conPuntos = '.' + cuerpo.slice(-3) + conPuntos;
        cuerpo = cuerpo.slice(0, -3);
    }
    conPuntos = cuerpo + conPuntos;
    return `${conPuntos}-${dv}`;
};

export const calcularDV = (cuerpo: string) => {
    let suma = 0;
    let mult = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += parseInt(cuerpo[i], 10) * mult;
        mult = mult === 7 ? 2 : mult + 1;
    }

    const res = 11 - (suma % 11);
    return res === 11 ? '0' : (res === 10 ? 'K' : String(res));
};

export const validarRut = (rut: string) => {
    const r = limpiarRut(rut);
    if (r.length < 2) return false;

    const cuerpo = r.slice(0, -1);
    const dv = r.slice(-1);

    return calcularDV(cuerpo) === dv;
};

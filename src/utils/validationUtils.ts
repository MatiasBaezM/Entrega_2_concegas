export const isValidChileanPhone = (phone: string): boolean => {
    // Eliminar espacios, guiones y el prefijo +56 si existe
    const cleanPhone = phone.replace(/[\s\-\+]/g, '').replace(/^56/, '');

    // Verificar que sean exactamente 9 dígitos numéricos
    // En Chile los números (móviles y fijos) tienen 9 dígitos.
    // Los móviles parten con 9.
    // Los fijos parten con un código de área (2 para Stgo, ver otros). 
    // Por simplicidad y consistencia con el placeholder '912345678', validaremos que sean 9 dígitos.
    // Adicionalmente se revisa si son solo números.
    const regex = /^\d{9}$/;

    return regex.test(cleanPhone);
};

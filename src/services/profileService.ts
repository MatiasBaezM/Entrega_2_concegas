import type { UserProfile } from '../types';
import { isValidChileanPhone } from '../utils/validationUtils';

// Clave única para los perfiles de usuario
const STORAGE_KEY = 'concegas_users_v2';

import initialData from '../../public/data/perfiles.json';

// ENTRADA INICIAL: Carga de datos base desde el archivo JSON
// Se castea para asegurar que cumpla con la interfaz UserProfile
const INITIAL_USERS: UserProfile[] = initialData as UserProfile[];

// FUNCIÓN DE ENTRADA: Lee los usuarios del navegador
const getStoredUsers = (): UserProfile[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

// FUNCIÓN DE SALIDA: Sobreescribe los usuarios en el navegador
const setStoredUsers = (users: UserProfile[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

export const profileService = {
    getAll: (): UserProfile[] => {
        const stored = getStoredUsers();
        if (stored.length === 0) {
            setStoredUsers(INITIAL_USERS);
            return INITIAL_USERS;
        }
        return stored;
    },

    getByRut: (rut: string): UserProfile | undefined => {
        const users = profileService.getAll();
        return users.find(u => u.rut === rut);
    },

    create: (user: UserProfile): void => {
        const users = profileService.getAll();
        if (users.some(u => u.rut === user.rut)) {
            throw new Error('El usuario con este RUT ya existe');
        }
        if (!isValidChileanPhone(user.telefono)) {
            throw new Error('El número de teléfono no es válido (debe ser 9 dígitos)');
        }
        users.push(user);
        setStoredUsers(users);
    },

    update: (rut: string, updatedUser: Partial<UserProfile>): void => {
        let users = profileService.getAll();

        if (updatedUser.telefono && !isValidChileanPhone(updatedUser.telefono)) {
            throw new Error('El número de teléfono no es válido (debe ser 9 dígitos)');
        }

        users = users.map(u =>
            u.rut === rut ? { ...u, ...updatedUser } : u
        );
        setStoredUsers(users);
    },

    delete: (rut: string): void => {
        let users = profileService.getAll();
        // Prevent deleting the last admin? (Optional safety)
        users = users.filter(u => u.rut !== rut);
        setStoredUsers(users);
    },

    // PROCESAMIENTO: Verifica si un email y contraseña son válidos
    // Retorna los datos del usuario si coinciden (SALIDA) o undefined si no
    validateCredentials: (email: string, pass: string): UserProfile | undefined => {
        const users = profileService.getAll();
        // Compara el email en minúsculas para evitar errores de tipeo
        return users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.pass === pass);
    }
};

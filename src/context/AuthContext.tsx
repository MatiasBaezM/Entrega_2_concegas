/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, type ReactNode } from 'react';
import type { Role, Address } from '../types';
import { profileService } from '../services/profileService';

// Definición de la estructura de un Usuario en sesión (sin password)
export interface User {
    rut: string;
    name: string;
    role: Role;
    email: string;
    telefono: string;
    addresses?: Address[];
}

// Interfaz que define qué datos y funciones compartirá este contexto
interface AuthContextType {
    user: User | null; // El usuario actual, o null si no hay nadie conectado
    login: (email: string, pass: string) => boolean; // Función para iniciar sesión
    logout: () => void; // Función para cerrar sesión
    isAuthenticated: boolean; // Bandera rápida para saber si está logueado
    isAdmin: boolean; // Bandera rápida para saber si es admin
    isRepartidor: boolean; // Bandera para repartidor
}

// Creamos el contexto
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor del contexto: envuelve la app y da acceso a la autenticación
export function AuthProvider({ children }: { children: ReactNode }) {
    // Inicializar estado leyendo de localStorage si existe
    const [user, setUser] = useState<User | null>(() => {
        const stored = localStorage.getItem('concegas_user');
        return stored ? JSON.parse(stored) : null;
    });

    // Lógica de inicio de sesión
    const login = (email: string, pass: string): boolean => {
        // Usamos el servicio de perfiles para validar credenciales
        const foundUser = profileService.validateCredentials(email, pass);

        if (foundUser) {
            const userData: User = {
                rut: foundUser.rut,
                name: foundUser.name,
                role: foundUser.role,
                email: foundUser.email,
                telefono: foundUser.telefono,
                addresses: foundUser.addresses
            };
            // Si lo encontramos, guardamos sus datos en el estado y localStorage
            setUser(userData);
            localStorage.setItem('concegas_user', JSON.stringify(userData));
            return true; // Login exitoso
        }
        return false; // Login fallido
    };

    // Lógica para cerrar sesión
    const logout = () => {
        setUser(null); // Borramos el usuario del estado
        localStorage.removeItem('concegas_user'); // Borramos de localStorage
        // Opcional: limpiar también la vista guardada del admin
        localStorage.removeItem('admin_current_view');
    };

    return (
        <AuthContext.Provider value={{
            user,
            login,
            logout,
            isAuthenticated: !!user, // Es true si user no es null
            isAdmin: user?.role === 'admin', // Es true si el rol es admin
            isRepartidor: user?.role === 'repartidor' // Es true si el rol es repartidor
        }}>
            {children}
        </AuthContext.Provider>
    );
}

// Hook movido a src/hooks/useAuth.ts

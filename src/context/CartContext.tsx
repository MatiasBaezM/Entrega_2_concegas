/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Estructura de un ítem en el carrito
export interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number; // Cantidad
    image?: string;
}

// Interfaz para definir qué expone el Contexto del Carrito
interface CartContextType {
    cart: CartItem[]; // Lista de productos
    addToCart: (product: Omit<CartItem, 'qty'>) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, delta: number) => void; // Delta puede ser +1 o -1
    clearCart: () => void; // Vaciar carrito
    total: number; // Monto total en dinero
    itemCount: number; // Cantidad total de ítems
}

// Creación del contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Proveedor del carrito: maneja el estado global del carrito
export function CartProvider({ children }: { children: ReactNode }) {
    // Estado del carrito, inicializado desde localStorage para no perder datos al recargar
    const [cart, setCart] = useState<CartItem[]>(() => {
        try {
            const stored = localStorage.getItem("concegas_cart");
            return stored ? JSON.parse(stored) : [];
        } catch {
            return [];
        }
    });

    // Guardar en localStorage cada vez que cambia el carrito
    useEffect(() => {
        localStorage.setItem("concegas_cart", JSON.stringify(cart));
    }, [cart]);

    // Función para agregar producto
    const addToCart = (product: Omit<CartItem, 'qty'>) => {
        setCart((prev) => {
            // Verificamos si ya existe para aumentar cantidad
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                );
            }
            // Si no existe, lo agregamos con cantidad 1
            return [...prev, { ...product, qty: 1 }];
        });
    };

    // Eliminar un producto por ID
    const removeFromCart = (id: string) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    };

    // Actualizar cantidad (+1 o -1)
    const updateQuantity = (id: string, delta: number) => {
        setCart((prev) => {
            return prev.map((item) => {
                if (item.id === id) {
                    const newQty = item.qty + delta;
                    // Evitar cantidades negativas o cero
                    return newQty > 0 ? { ...item, qty: newQty } : item;
                }
                return item;
            });
        });
    };

    // Vaciar todo
    const clearCart = () => setCart([]);

    // Cálculos derivados
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, total, itemCount }}>
            {children}
        </CartContext.Provider>
    );
}

// Hook para acceder al carrito desde cualquier componente
export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}

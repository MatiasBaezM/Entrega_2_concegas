import type { Order } from '../types';

// Clave para guardar los pedidos realizados
const STORAGE_KEY = 'concegas_orders';

// ENTRADA: Recupera pedidos anteriores del navegador
const getStoredOrders = (): Order[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

// SALIDA: Guarda la lista actualizada de pedidos
const setStoredOrders = (orders: Order[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
};

export const orderService = {
    getAll: (): Order[] => {
        return getStoredOrders();
    },

    getById: (id: string): Order | undefined => {
        const orders = orderService.getAll();
        return orders.find(o => o.id === id);
    },

    getByRut: (rut: string): Order[] => {
        const orders = orderService.getAll();
        return orders.filter(o => o.customerRut === rut);
    },

    // PROCESAMIENTO: Crea un nuevo pedido y lo persiste inmediatamente
    create: (order: Order): void => {
        const orders = orderService.getAll();
        if (orders.some(o => o.id === order.id)) {
            throw new Error('El pedido con este ID ya existe');
        }
        orders.push(order);
        setStoredOrders(orders); // Salida persistente
    },

    updateStatus: (id: string, newStatus: Order['status'], assignedTo?: string, failReason?: string): void => {
        let orders = orderService.getAll();
        orders = orders.map(o =>
            o.id === id ? { ...o, status: newStatus, assignedTo: assignedTo || o.assignedTo, failReason: failReason || o.failReason } : o
        );
        setStoredOrders(orders);
    },

    delete: (id: string): void => {
        let orders = orderService.getAll();
        orders = orders.filter(o => o.id !== id);
        setStoredOrders(orders);
    }
};

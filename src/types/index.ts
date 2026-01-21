export interface Product {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    stock?: number;
    isActive?: boolean;
}

export type Role = 'cliente' | 'admin' | 'repartidor';

export interface Address {
    id: string;
    alias: string;
    street: string;
    comuna: string;
    city: string;
    reference?: string;
}

export interface UserProfile {
    rut: string;
    name: string;
    role: Role;
    pass: string;
    email: string;
    telefono: string;
    addresses?: Address[];
}

export interface OrderItem {
    id: string; // Product id
    name: string;
    price: number;
    qty: number;
}

export interface Order {
    id: string;
    date: string; // ISO String
    customerRut: string;
    customerName: string;
    items: OrderItem[];
    total: number;
    status: 'pendiente' | 'despachado' | 'entregado' | 'cancelado' | 'preparacion' | 'enviados' | 'sin entrega' | 'entregados';
    paymentMethod: 'efectivo' | 'transferencia' | 'tarjeta';
    address: string;
    assignedTo?: string;
    failReason?: string;
    comuna?: string;
    reference?: string;
}

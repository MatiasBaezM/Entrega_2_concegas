import type { Product } from '../types';
import initialData from '../../public/data/productos.json';

// Clave para identificar el almacenamiento en el navegador
const STORAGE_KEY = 'concegas_products_v2';

// ENTRADA DE DATOS: Recupera la información desde el disco (localStorage)
const getStoredProducts = (): Product[] => {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Si hay datos guardados, los convierte de texto a objetos utilizables por TypeScript
    if (stored) {
        return JSON.parse(stored);
    }
    return [];
};

// SALIDA DE DATOS: Persiste la información en el navegador
const setStoredProducts = (products: Product[]) => {
    // Convierte el objeto de código a texto plano para poder guardarlo físicamente
    localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};

export const productService = {
    // Obtiene todos los productos. Si el almacenamiento está vacío, usa los datos del JSON inicial.
    getAll: (): Product[] => {
        const stored = getStoredProducts();
        if (stored.length === 0) {
            setStoredProducts(initialData);
            return initialData;
        }
        return stored;
    },

    getById: (id: string): Product | undefined => {
        const products = productService.getAll();
        return products.find(p => p.id === id);
    },

    // PROCESAMIENTO: Agrega un nuevo producto a la lista existente
    create: (product: Product): void => {
        const products = productService.getAll();
        // Validación: No permitir IDs duplicados
        if (products.some(p => p.id === product.id)) {
            throw new Error('El producto con este ID ya existe');
        }
        products.push(product);
        // Persistencia (Salida)
        setStoredProducts(products);
    },

    // Actualiza los datos de un producto existente (nombre, precio, stock, visibilidad, etc.)
    update: (id: string, updatedProduct: Partial<Product>): void => {
        let products = productService.getAll();
        products = products.map(p =>
            p.id === id ? { ...p, ...updatedProduct } : p
        );
        setStoredProducts(products);
    },

    delete: (id: string): void => {
        let products = productService.getAll();
        products = products.filter(p => p.id !== id);
        setStoredProducts(products);
    }
};

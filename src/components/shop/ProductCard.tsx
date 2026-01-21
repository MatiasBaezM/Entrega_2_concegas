import { Card, Button } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useState } from 'react';

interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    description: string;
    image: string;
    stock?: number;
    isActive?: boolean;
}

function ProductCard({ id, name, price, description, image, stock, isActive }: ProductCardProps) {
    const { addToCart } = useCart();
    const [added, setAdded] = useState(false);

    // Función para formatear precio a peso chileno
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    // Lógica para determinar si el producto se puede comprar:
    // 1. Debe tener stock mayor a 0.
    // 2. El administrador NO debe haberlo ocultado (isActive no debe ser false).
    const hasStock = (stock !== undefined && stock > 0) && (isActive !== false);

    const handleAdd = () => {
        if (!hasStock) return;
        addToCart({ id, name, price, image });
        setAdded(true);
        setTimeout(() => setAdded(false), 1000);
    };

    return (
        // Aplicamos opacidad si no hay stock o si el administrador ocultó el producto
        <Card className={`m-1 shadow h-100 ${!hasStock ? 'opacity-50' : ''}`}>
            {image ? (
                <Card.Img
                    variant="top"
                    src={image}
                    alt={name}
                    // Ponemos la imagen en blanco y negro si no hay disponibilidad
                    className={!hasStock ? 'grayscale' : ''}
                />
            ) : (
                // Si el producto no tiene foto, mostramos este recuadro decorativo
                <div
                    className={`d-flex align-items-center justify-content-center bg-light text-muted border-bottom ${!hasStock ? 'opacity-50' : ''}`}
                    style={{ height: '200px', width: '100%' }}
                >
                    <span>Sin Imagen</span>
                </div>
            )}
            <Card.Body>
                <Card.Title as="h4">{name}</Card.Title>
                <Card.Title as="h5">{formatPrice(price)}</Card.Title>
                <Card.Text>
                    {description}
                    {!hasStock && <span className="d-block text-danger fw-bold mt-2">Sin Stock</span>}
                </Card.Text>
                <Button
                    variant={added ? "success" : (hasStock ? "primary" : "secondary")}
                    className="btn-agregar"
                    onClick={handleAdd}
                    disabled={!hasStock}
                >
                    {added ? "Agregado ✅" : (hasStock ? "Agregar" : "Sin Stock")}
                </Button>
            </Card.Body>
        </Card>
    );
}

export default ProductCard;

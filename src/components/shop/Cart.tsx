import { useState, useEffect } from 'react';
import { Container, Table, Button, Card, Row, Col, Form, Alert, Modal } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';
import { orderService } from '../../services/orderService';
import { profileService } from '../../services/profileService';
import type { Order, Address } from '../../types';
import OrderProcessing from './OrderProcessing';
import OrderSuccess from './OrderSuccess';

import LoginModal from '../auth/LoginModal';
import RegisterModal from '../auth/RegisterModal';
import RecoverPasswordModal from '../auth/RecoverPasswordModal';

function Cart() {
    const { cart, removeFromCart, updateQuantity, clearCart, total } = useCart();
    const { user, isAuthenticated } = useAuth();

    const [showAddressModal, setShowAddressModal] = useState(false);

    // Auth Modals state
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showRecoverModal, setShowRecoverModal] = useState(false);

    const [paymentMethod, setPaymentMethod] = useState('');
    const [selectedAddress, setSelectedAddress] = useState('');
    const [comunaForOrder, setComunaForOrder] = useState('Concepción'); // Estado para guardar la comuna de la dirección seleccionada
    const [checkoutState, setCheckoutState] = useState<'idle' | 'processing' | 'success'>('idle');

    // Estado local de direcciones (se inicia con las del usuario)
    const [addresses, setAddresses] = useState<Address[]>([]);

    // Estados para el formulario de nueva dirección
    const [newAddress, setNewAddress] = useState({
        alias: '',
        street: '',
        comuna: '',
        city: '',
        reference: ''
    });

    useEffect(() => {
        if (user && user.addresses) {
            setAddresses(user.addresses);
        }
    }, [user]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        setSelectedAddress(val);
        // Buscar la comuna asociada a esta dirección
        // El value del option será simplificado, mejor usamos el ID o un string compuesto unico
        // Para mantener compatibilidad con lo anterior, asumimos que el value "es" la dirección texto

        // Buscamos si coincide con alguna guardada
        const found = addresses.find(a => {
            const str = `${a.alias ? a.alias + ': ' : ''}${a.street}, ${a.comuna}`;
            return str === val;
        });

        if (found) {
            setComunaForOrder(found.comuna);
        } else {
            // Fallback si es una hardcoded
            setComunaForOrder('Concepción');
        }
    };

    const handleSaveAddress = () => {
        if (!user) return;
        if (!newAddress.street || !newAddress.comuna || !newAddress.city) {
            alert('Por favor complete Dirección, Comuna y Ciudad');
            return;
        }

        const addr: Address = {
            id: `addr-${Date.now()}`,
            alias: newAddress.alias,
            street: newAddress.street,
            comuna: newAddress.comuna,
            city: newAddress.city,
            reference: newAddress.reference
        };

        const updatedAddresses = [...addresses, addr];
        setAddresses(updatedAddresses);

        // Guardar en perfil
        profileService.update(user.rut, { addresses: updatedAddresses });

        // Actualizar sesión actual (localStorage) para que persista al recargar
        // ya que AuthContext lee de aquí
        const sessionUser = localStorage.getItem('concegas_user');
        if (sessionUser) {
            const parsed = JSON.parse(sessionUser);
            parsed.addresses = updatedAddresses;
            localStorage.setItem('concegas_user', JSON.stringify(parsed));
        }

        // Seleccionar la nueva dirección
        const addrString = `${addr.alias ? addr.alias + ': ' : ''}${addr.street}, ${addr.comuna}`;
        setSelectedAddress(addrString);
        setComunaForOrder(addr.comuna);

        // Limpiar y cerrar
        setNewAddress({ alias: '', street: '', comuna: '', city: '', reference: '' });
        setShowAddressModal(false);
    };

    const handleOrder = () => {
        if (!isAuthenticated || !user) {
            // En vez de alert, mostramos el modal de login
            setShowLoginModal(true);
            return;
        }

        if (!selectedAddress) {
            alert('Por favor selecciona una dirección de envío');
            return;
        }

        if (!paymentMethod) {
            alert('Por favor selecciona un método de pago');
            return;
        }

        setCheckoutState('processing');

        // Buscar referencia si existe para la dirección seleccionada
        const foundAddress = addresses.find(a => {
            const str = `${a.alias ? a.alias + ': ' : ''}${a.street}, ${a.comuna}`;
            return str === selectedAddress;
        });

        // Map payment method
        let pm: Order['paymentMethod'] = 'efectivo';
        if (paymentMethod === 'transfer') pm = 'transferencia';
        if (paymentMethod === 'card') pm = 'tarjeta';

        // Create Order Object
        const newOrder: Order = {
            id: `ord-${Date.now()}`,
            date: new Date().toISOString(),
            customerRut: user.rut,
            customerName: user.name,
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                qty: item.qty
            })),
            total: total,
            status: 'pendiente',
            paymentMethod: pm,
            address: selectedAddress,
            comuna: comunaForOrder,
            reference: foundAddress?.reference
        };

        // Simular proceso de pago (3 segundos)
        setTimeout(() => {
            try {
                // Save order to localStorage via service
                orderService.create(newOrder);
                setCheckoutState('success');
                clearCart();
            } catch (error) {
                console.error(error);
                alert('Hubo un error al procesar el pedido');
                setCheckoutState('idle');
            }
        }, 3000);
    };

    if (checkoutState === 'processing') {
        return <OrderProcessing />;
    }

    if (checkoutState === 'success') {
        return <OrderSuccess onContinue={() => {
            setCheckoutState('idle');
            window.location.href = '/';
        }} />;
    }

    if (cart.length === 0) {
        return (
            <Container className="my-5 text-center">
                <h2 className="mb-4 text-dark">Tu Carrito</h2>
                <div className="alert alert-secondary">
                    Tu carrito está vacío.
                </div>
                <Button variant="secondary" href="/">Seguir comprando</Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-dark">Tu Carrito</h2>

            <div className="table-responsive">
                <Table hover className="align-middle">
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th style={{ width: '150px' }}>Cantidad</th>
                            <th>Precio</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.map((item) => (
                            <tr key={item.id}>
                                <td>
                                    {item.image &&
                                        <img src={item.image} alt={item.name} width="50" style={{ marginRight: '10px' }} />
                                    }
                                    {item.name}
                                </td>
                                <td>
                                    <div className="d-flex align-items-center">
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, -1)}
                                        >
                                            -
                                        </Button>
                                        <span className="mx-2">{item.qty}</span>
                                        <Button
                                            variant="outline-secondary"
                                            size="sm"
                                            onClick={() => updateQuantity(item.id, 1)}
                                        >
                                            +
                                        </Button>
                                    </div>
                                </td>
                                <td>{formatPrice(item.price)}</td>
                                <td>{formatPrice(item.price * item.qty)}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => removeFromCart(item.id)}>
                                        Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th colSpan={3} className="text-end">Total</th>
                            <th>{formatPrice(total)}</th>
                            <th></th>
                        </tr>
                    </tfoot>
                </Table>
            </div>

            {/* BLOQUE DIRECCIÓN DE ENVÍO */}
            <Card className="shadow-sm my-4">
                <Card.Body>
                    <Card.Title className="mb-3 text-primary">Dirección de envío</Card.Title>
                    <Row className="g-2 align-items-end">
                        <Col className="mb-3">
                            <Form.Label>Enviar a:</Form.Label>
                            <Form.Select
                                value={selectedAddress}
                                onChange={handleAddressChange}
                            >
                                <option disabled value="">Seleccione una dirección</option>
                                {/* Direcciones guardadas del usuario */}
                                {addresses.map(addr => (
                                    <option key={addr.id} value={`${addr.alias ? addr.alias + ': ' : ''}${addr.street}, ${addr.comuna}`}>
                                        {addr.alias ? `${addr.alias}: ` : ''}{addr.street}, {addr.comuna}
                                    </option>
                                ))}
                                <option disabled>──────────</option>
                                <option value="Casa (Av. Ejemplo 1234)">Casa (Av. Ejemplo 1234)</option>
                                <option value="Trabajo (Centro 456)">Trabajo (Centro 456)</option>
                            </Form.Select>
                        </Col>
                        <Col md={4} className="d-grid mb-3">
                            <Button variant="outline-primary" onClick={() => setShowAddressModal(true)}>
                                + Agregar nueva
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* BLOQUE MÉTODO DE PAGO */}
            <Card className="shadow-sm my-4">
                <Card.Body>
                    <Card.Title className="mb-3 text-primary">Método de pago</Card.Title>
                    <div className="mb-3">
                        <Form.Label>Pagar con:</Form.Label>
                        <Form.Select
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        >
                            <option disabled value="">Seleccione un método</option>
                            <option value="card">Tarjeta (crédito/débito)</option>
                            <option value="transfer">Transferencia</option>
                            <option value="cash">Efectivo (contra entrega)</option>
                        </Form.Select>
                    </div>

                    {paymentMethod === 'card' && (
                        <Alert variant="info">Demo: Se redirigirá a WebPay (simulado).</Alert>
                    )}
                    {paymentMethod === 'transfer' && (
                        <Alert variant="secondary">
                            <strong>Datos:</strong> Banco Estado, Cta 123456...
                        </Alert>
                    )}
                    {paymentMethod === 'cash' && (
                        <Form.Group className="mb-3">
                            <Form.Label>¿Con cuánto pagarás?</Form.Label>
                            <Form.Control type="number" placeholder="Ej: 20000" />
                        </Form.Group>
                    )}
                </Card.Body>
            </Card>

            <div className="d-flex gap-2">
                <Button variant="outline-danger" onClick={clearCart}>Vaciar carrito</Button>
                <Button variant="secondary" href="/">Seguir comprando</Button>
                <Button variant="success" onClick={handleOrder} className="btn-premium">Pagar y Pedir</Button>
            </div>

            {/* MODAL PARA DIRECCIÓN */}
            <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-primary">Agregar dirección</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form id="addressForm">
                        <Form.Group className="mb-3" controlId="addrAlias">
                            <Form.Label>Alias (opcional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Casa, Trabajo..."
                                value={newAddress.alias}
                                onChange={(e) => setNewAddress({ ...newAddress, alias: e.target.value })}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="addrStreet">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                required
                                placeholder="Av. Siempre Viva 742"
                                value={newAddress.street}
                                onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                            />
                        </Form.Group>

                        <Row className="g-2">
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3" controlId="addrComuna">
                                    <Form.Label>Comuna</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="Concepción"
                                        value={newAddress.comuna}
                                        onChange={(e) => setNewAddress({ ...newAddress, comuna: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col xs={12} md={6}>
                                <Form.Group className="mb-3" controlId="addrCiudad">
                                    <Form.Label>Ciudad</Form.Label>
                                    <Form.Control
                                        type="text"
                                        required
                                        placeholder="Concepción"
                                        value={newAddress.city}
                                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <Form.Group className="mb-3" controlId="addrRef">
                            <Form.Label>Referencia (opcional)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Depto 12B, portón rojo..."
                                value={newAddress.reference}
                                onChange={(e) => setNewAddress({ ...newAddress, reference: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-secondary" onClick={() => setShowAddressModal(false)}>Cancelar</Button>
                    <Button variant="success" onClick={handleSaveAddress}>Guardar</Button>
                </Modal.Footer>
            </Modal>

            {/* AUTH MODALS FOR NON-LOGGED IN USERS */}
            <LoginModal
                show={showLoginModal}
                handleClose={() => setShowLoginModal(false)}
                onRegisterClick={() => {
                    setShowLoginModal(false);
                    setShowRegisterModal(true);
                }}
                onRecoverClick={() => {
                    setShowLoginModal(false);
                    setShowRecoverModal(true);
                }}
            />

            <RegisterModal
                show={showRegisterModal}
                handleClose={() => setShowRegisterModal(false)}
            />

            <RecoverPasswordModal
                show={showRecoverModal}
                handleClose={() => setShowRecoverModal(false)}
            />

        </Container>
    );
}

export default Cart;

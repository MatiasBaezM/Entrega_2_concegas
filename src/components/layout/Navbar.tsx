import { Navbar as BSNavbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../hooks/useAuth';

// Propiedades que admite el Navbar: funciones para manejar clicks
interface NavbarProps {
    onLoginClick?: () => void;
    onRegisterClick?: () => void;
    onCartClick?: () => void;
    onHomeClick?: () => void;
}

function Navbar({ onLoginClick, onRegisterClick, onCartClick, onHomeClick }: NavbarProps) {
    // Obtenemos la cantidad de items del carrito para mostrar en la burbuja roja
    const { itemCount } = useCart();
    // Obtenemos estado de autenticación para mostrar nombre de usuario o botón de login
    const { user, logout, isAuthenticated, isAdmin, isRepartidor } = useAuth();

    return (
        // Componente Navbar de React-Bootstrap con tema oscuro
        <BSNavbar expand="sm" bg="dark" data-bs-theme="dark" className="shadow">
            <Container fluid>
                {/* Logo de la empresa: al hacer clic lleva al inicio */}
                <BSNavbar.Brand href="#" onClick={(e) => { e.preventDefault(); onHomeClick?.(); }}>
                    <img
                        src="/img/Logo.png"
                        alt="ConceGas"
                        width="40"
                        height="40"
                        className="d-inline-block align-text-top"
                    />
                </BSNavbar.Brand>

                {/* Botón hamburguesa para móvil */}
                <BSNavbar.Toggle aria-controls="collapsibleNavbar" />

                {/* Contenido colapsable (menú) */}
                <BSNavbar.Collapse id="collapsibleNavbar">
                    <Nav className="ms-auto">

                        {/* Menú desplegable de Usuario */}
                        <NavDropdown
                            title={
                                <>
                                    <img
                                        src="/img/cuenta.png"
                                        alt="img_cuenta"
                                        width="30"
                                        height="30"
                                        className="d-inline-block align-text-top"
                                    />{' '}
                                    {/* Muestra el nombre si está logueado, sino 'Cuenta' */}
                                    {isAuthenticated ? user?.name : 'Cuenta'}
                                </>
                            }
                            id="collasible-nav-dropdown"
                            align="end"
                        >
                            {!isAuthenticated ? (
                                // Opciones para usuario NO logueado
                                <>
                                    <NavDropdown.Item
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onRegisterClick?.();
                                        }}
                                    >
                                        Registro
                                    </NavDropdown.Item>
                                    <NavDropdown.Item
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            onLoginClick?.();
                                        }}
                                    >
                                        Inicio sesion
                                    </NavDropdown.Item>
                                </>
                            ) : (
                                // Opciones para usuario LOGUEADO
                                <>
                                    {isAdmin && (
                                        <NavDropdown.Item href="#">
                                            ⚙️ Panel Admin
                                        </NavDropdown.Item>
                                    )}
                                    <NavDropdown.Item href="#">Cambia Contraseña</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            logout(); // Llama a la función de logout del contexto
                                        }}
                                    >
                                        Cerrar sesion
                                    </NavDropdown.Item>
                                </>
                            )}
                        </NavDropdown>

                        {/* Icono del Carrito de Compras - Oculto para admin y repartidor */}
                        {!isAdmin && !isRepartidor && (
                            <Nav.Link href="#" onClick={(e) => { e.preventDefault(); onCartClick?.(); }} className="position-relative">
                                <img
                                    src="/img/carro.png"
                                    alt="ConceGas"
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-text-top"
                                />
                                {/* Burbuja roja con contador si hay productos */}
                                {itemCount > 0 && (
                                    <Badge
                                        pill
                                        bg="danger"
                                        className="position-absolute top-0 start-100 translate-middle"
                                    >
                                        {itemCount}
                                    </Badge>
                                )}
                            </Nav.Link>
                        )}
                    </Nav>
                </BSNavbar.Collapse>
            </Container>
        </BSNavbar>
    );
}

export default Navbar;

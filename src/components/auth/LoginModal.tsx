import { useState } from 'react';
import { Modal, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useAuth } from '../../hooks/useAuth';


interface LoginModalProps {
    show: boolean;
    handleClose: () => void;
    onRecoverClick?: () => void;
    onRegisterClick?: () => void;
}

function LoginModal({ show, handleClose, onRecoverClick, onRegisterClick }: LoginModalProps) {
    const { login } = useAuth(); // Hook de autenticación
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [error, setError] = useState('');
    const [showPass, setShowPass] = useState(false); // Estado para mostrar/ocultar contraseña

    // Manejar envío del formulario
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Intentar loguear con el contexto
        const success = login(email, pass);
        if (success) {
            handleClose();
            // Limpiar campos si fue exitoso
            setEmail('');
            setPass('');
        } else {
            setError('Credenciales inválidas. Intente nuevamente.');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="modal-premium">
            <Modal.Header closeButton className="modal-premium-header">
                <Modal.Title className="modal-premium-title">Inicio Sesión</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Mostrar alerta si hay error */}
                {error && <Alert variant="danger" style={{ whiteSpace: 'pre-line' }}>{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="nombre@ejemplo.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pass">
                        <Form.Label>Contraseña</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type={showPass ? "text" : "password"} // Type dinámico para ver pass
                                value={pass}
                                onChange={(e) => setPass(e.target.value)}
                                required
                            />
                            {/* Botón del "ojito" para ver contraseña */}
                            <Button
                                variant="outline-secondary"
                                onClick={() => setShowPass(!showPass)}
                            >
                                {showPass ? "👁️" : "🔒"}
                            </Button>
                        </InputGroup>
                    </Form.Group>

                    <div className="mt-4">
                        <Button className="w-100 mb-2 btn-premium" type="submit">
                            Iniciar
                        </Button>
                        <div className="text-center d-flex flex-column gap-2">
                            {/* Enlaces de ayuda que disparan eventos al padre (App) */}
                            <a
                                href="#"
                                className="text-muted small"
                                style={{ textDecoration: 'none' }}
                                onClick={(e) => { e.preventDefault(); onRecoverClick?.(); }}
                            >
                                ¿Olvidaste tu contraseña?
                            </a>
                            <a
                                href="#"
                                className="text-muted"
                                style={{ textDecoration: 'none' }}
                                onClick={(e) => { e.preventDefault(); onRegisterClick?.(); }}
                            >
                                ¿No tengo cuenta?
                            </a>
                        </div>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default LoginModal;

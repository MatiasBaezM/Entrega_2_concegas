import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

interface RecoverPasswordModalProps {
    show: boolean;
    handleClose: () => void;
}

function RecoverPasswordModal({ show, handleClose }: RecoverPasswordModalProps) {
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulación envío de correo
        setSent(true);
        setTimeout(() => {
            setSent(false);
            setEmail('');
            handleClose();
        }, 3000);
    };

    return (
        <Modal show={show} onHide={handleClose} centered className="modal-premium">
            <Modal.Header closeButton className="modal-premium-header">
                <Modal.Title className="modal-premium-title">Recuperar Contraseña</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {sent ? (
                    <Alert variant="success">
                        ✅ Si el correo existe en nuestros registros, recibirás las instrucciones para restablecer tu contraseña.
                    </Alert>
                ) : (
                    <>
                        <p className="text-muted">
                            Ingresa tu correo electrónico asociado a tu cuenta para recibir un enlace de recuperación.
                        </p>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3" controlId="recoverEmail">
                                <Form.Label>Correo electrónico</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="ejemplo@correo.cl"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </Form.Group>
                            <div className="d-grid">
                                <Button className="btn-premium" type="submit">
                                    Enviar Instrucciones
                                </Button>
                            </div>
                        </Form>
                    </>
                )}
            </Modal.Body>
        </Modal>
    );
}

export default RecoverPasswordModal;

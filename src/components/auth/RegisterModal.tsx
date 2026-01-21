import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { formatearRut, validarRut } from '../../utils/rutUtils';
import { isValidChileanPhone } from '../../utils/validationUtils';
import { profileService } from '../../services/profileService';
import type { UserProfile } from '../../types';

interface RegisterModalProps {
    show: boolean;
    handleClose: () => void;
}

function RegisterModal({ show, handleClose }: RegisterModalProps) {
    const [formData, setFormData] = useState({
        rut: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        pass: '',
        repass: ''
    });
    const [success, setSuccess] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [isRutValid, setIsRutValid] = useState(true);
    const [isPhoneValid, setIsPhoneValid] = useState(true);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === 'rut') {
            setFormData(prev => ({ ...prev, [name]: formatearRut(value) }));
            setIsRutValid(true);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // Validar contraseñas al escribir
        if (name === 'pass' || name === 'repass') {
            const p1 = name === 'pass' ? value : formData.pass;
            const p2 = name === 'repass' ? value : formData.repass;
            if (p1 && p2 && p1 !== p2) {
                setPasswordError('Las contraseñas no coinciden');
            } else {
                setPasswordError('');
            }
        }
    };

    const handleRutBlur = () => {
        if (formData.rut.length > 1) {
            setIsRutValid(validarRut(formData.rut));
        }
    };

    const handlePhoneBlur = () => {
        if (formData.telefono.length > 0) {
            setIsPhoneValid(isValidChileanPhone(formData.telefono));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarRut(formData.rut)) {
            setIsRutValid(false);
            return;
        }

        if (!isValidChileanPhone(formData.telefono)) {
            setIsPhoneValid(false);
            return;
        }

        if (formData.pass !== formData.repass) {
            setPasswordError('Las contraseñas no coinciden');
            return;
        }

        try {
            // Construimos el perfil del usuario uniendo Nombre y Apellido ingresados por separado
            const newUser: UserProfile = {
                rut: formData.rut,
                name: `${formData.nombre} ${formData.apellido}`.trim(),
                email: formData.email,
                telefono: formData.telefono,
                pass: formData.pass,
                role: 'cliente' // Todo usuario registrado desde la web es tipo cliente por defecto
            };

            // Intentar crear el usuario en el servicio (localStorage)
            profileService.create(newUser);

            setSuccess(true);

            // Cerrar modal después de unos segundos
            setTimeout(() => {
                setSuccess(false);
                handleClose();
                // Limpiar formulario
                setFormData({
                    rut: '',
                    nombre: '',
                    apellido: '',
                    email: '',
                    telefono: '',
                    pass: '',
                    repass: ''
                });
                setIsRutValid(true);
                setIsPhoneValid(true);
            }, 2000);

        } catch (error) {
            if (error instanceof Error) {
                alert(error.message); // Muestra error si el RUT ya existe, etc.
            } else {
                alert('Ocurrió un error desconocido al registrar');
            }
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg" className="modal-premium">
            <Modal.Header closeButton className="modal-premium-header">
                <Modal.Title className="modal-premium-title">Formulario de Registro</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {success && (
                    <Alert variant="success">
                        ✅ Se ha registrado correctamente.
                    </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="rut">
                        <Form.Label>Rut</Form.Label>
                        <Form.Control
                            type="text"
                            name="rut"
                            placeholder="12.345.678-9"
                            value={formData.rut}
                            onChange={handleChange}
                            onBlur={handleRutBlur}
                            isInvalid={!isRutValid}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Rut inválido
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Ingrese rut sin puntos con guión
                        </Form.Text>
                    </Form.Group>

                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Group controlId="nombre">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="nombre"
                                    placeholder="Ingrese nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group controlId="apellido">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apellido"
                                    placeholder="Ingrese apellido"
                                    value={formData.apellido}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Correo electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            placeholder="ejemplo@correo.cl"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <Form.Text className="text-muted">
                            Usaremos este correo para notificaciones y recuperación de contraseña.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="telefono">
                        <Form.Label>Teléfono</Form.Label>
                        <Form.Control
                            type="tel"
                            name="telefono"
                            placeholder="912345678"
                            maxLength={9}
                            value={formData.telefono}
                            onChange={handleChange}
                            onBlur={handlePhoneBlur}
                            isInvalid={!isPhoneValid}
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Teléfono inválido (debe tener 9 dígitos)
                        </Form.Control.Feedback>
                        <Form.Text className="text-muted">
                            Ingrese teléfono chileno de 9 dígitos (ej: 912345678)
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="pass">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="pass"
                            value={formData.pass}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="repass">
                        <Form.Label>Reingrese contraseña</Form.Label>
                        <Form.Control
                            type="password"
                            name="repass"
                            value={formData.repass}
                            onChange={handleChange}
                            required
                        />
                        {passwordError && <Form.Text className="text-danger">{passwordError}</Form.Text>}
                    </Form.Group>

                    <div className="mt-4">
                        <Button size="lg" type="submit" className="w-100 btn-premium">
                            Registrar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
}

export default RegisterModal;

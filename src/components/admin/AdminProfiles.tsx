import { useState } from 'react';
import { Table, Button, Badge, Modal, Form } from 'react-bootstrap';
import { profileService } from '../../services/profileService';
import type { UserProfile, Role } from '../../types';
import { formatearRut, validarRut } from '../../utils/rutUtils';
import { isValidChileanPhone } from '../../utils/validationUtils';

function AdminProfiles() {
    const [profiles, setProfiles] = useState<UserProfile[]>(() => profileService.getAll());
    const [showCreateModal, setShowCreateModal] = useState(false);

    const [showEditModal, setShowEditModal] = useState(false);
    const [originalPass, setOriginalPass] = useState(''); // Para mantener la contraseña si no se cambia

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

    // Form States
    const [formData, setFormData] = useState({
        rut: '',
        name: '',
        surname: '',
        email: '',
        telefono: '',
        pass: '',
        role: 'cliente' as Role
    });
    const [rutValid, setRutValid] = useState(true);
    const [phoneValid, setPhoneValid] = useState(true);

    const loadProfiles = () => {
        setProfiles(profileService.getAll());
    };

    const resetForm = () => {
        setFormData({
            rut: '',
            name: '',
            surname: '',
            email: '',
            telefono: '',
            pass: '',
            role: 'cliente'
        });
        setRutValid(true);
        setPhoneValid(true);
        setOriginalPass('');
    };

    const handleCreateClick = () => {
        resetForm();
        setShowCreateModal(true);
    };

    const handleEditClick = (user: UserProfile) => {
        // Separar nombre y apellido de forma básica (la primera palabra nombre, el resto apellido)
        const parts = user.name.split(' ');
        const name = parts[0] || '';
        const surname = parts.slice(1).join(' ') || '';

        setFormData({
            rut: user.rut,
            name: name,
            surname: surname,
            email: user.email || '',
            telefono: user.telefono || '',
            pass: '', // Campo vacío para password, si lo llena se actualiza
            role: user.role
        });
        setOriginalPass(user.pass); // Guardamos la pass actual
        setShowEditModal(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'rut') {
            setFormData(prev => ({ ...prev, [name]: formatearRut(value) }));
            setRutValid(true); // Reset error while typing
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleRutBlur = () => {
        if (formData.rut.length > 2) {
            setRutValid(validarRut(formData.rut));
        }
    };

    const handlePhoneBlur = () => {
        if (formData.telefono.length > 0) {
            setPhoneValid(isValidChileanPhone(formData.telefono));
        }
    };

    const handleSubmitCreate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validarRut(formData.rut)) {
            setRutValid(false);
            return;
        }

        if (!isValidChileanPhone(formData.telefono)) {
            setPhoneValid(false);
            return;
        }

        try {
            const fullName = `${formData.name} ${formData.surname}`.trim();

            profileService.create({
                rut: formData.rut,
                name: fullName,
                email: formData.email,
                telefono: formData.telefono,
                pass: formData.pass,
                role: formData.role
            });

            loadProfiles();
            setShowCreateModal(false);
            resetForm();
            alert('Usuario creado correctamente');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocurrió un error desconocido');
            }
        }
    };

    const handleSubmitEdit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidChileanPhone(formData.telefono)) {
            setPhoneValid(false);
            return;
        }

        try {
            const fullName = `${formData.name} ${formData.surname}`.trim();

            // Si el campo pass está vacío, usamos la original
            const finalPass = formData.pass.trim() === '' ? originalPass : formData.pass;

            profileService.update(formData.rut, {
                name: fullName,
                email: formData.email,
                telefono: formData.telefono,
                pass: finalPass,
                role: formData.role
            });

            loadProfiles();
            setShowEditModal(false);
            resetForm();
            alert('Usuario actualizado correctamente');
        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert('Ocurrió un error desconocido');
            }
        }
    };

    const handleDeleteClick = (user: UserProfile) => {
        setSelectedUser(user);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (selectedUser) {
            profileService.delete(selectedUser.rut);
            loadProfiles();
            setShowDeleteModal(false);
        }
    };

    return (
        <div>
            <h2 className="mb-4 text-dark">Gestión de Perfiles</h2>

            <div className="table-responsive">
                <Table hover className="align-middle bg-white">
                    <thead className="table-light">
                        <tr>
                            <th>RUT</th>
                            <th>Nombre Completo</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {profiles.map(profile => (
                            <tr key={profile.rut}>
                                <td>{profile.rut}</td>
                                <td>{profile.name}</td>
                                <td>{profile.email || '-'}</td>
                                <td>{profile.telefono || '-'}</td>
                                <td>
                                    <Badge bg={profile.role === 'admin' ? 'danger' : 'primary'}>
                                        {profile.role.toUpperCase()}
                                    </Badge>
                                </td>
                                <td>
                                    <Button variant="warning" size="sm" className="me-2" onClick={() => handleEditClick(profile)}>
                                        Editar
                                    </Button>
                                    {profile.role !== 'admin' && (
                                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(profile)}>
                                            Eliminar
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Button variant="success" className="mt-3" onClick={handleCreateClick}>
                + Crear Nuevo Usuario
            </Button>

            {/* MODAL CREAR USUARIO */}
            <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered className="modal-premium" backdrop="static">
                <Modal.Header closeButton className="modal-premium-header">
                    <Modal.Title className="modal-premium-title">Crear Nuevo Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitCreate}>
                        <Form.Group className="mb-3">
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                                type="text"
                                name="rut"
                                value={formData.rut}
                                onChange={handleFormChange}
                                onBlur={handleRutBlur}
                                isInvalid={!rutValid}
                                required
                                placeholder="12.345.678-9"
                            />
                            <Form.Control.Feedback type="invalid">Rut inválido</Form.Control.Feedback>
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                                placeholder="nombre@ejemplo.com"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleFormChange}
                                required
                                placeholder="912345678"
                                maxLength={9}
                                onBlur={handlePhoneBlur}
                                isInvalid={!phoneValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Teléfono inválido (9 dígitos)
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="pass"
                                value={formData.pass}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                            >
                                <option value="cliente">Cliente</option>
                                <option value="repartidor">Repartidor</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>Cancelar</Button>
                            <Button variant="success" type="submit" className="btn-premium">Crear Usuario</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* MODAL EDITAR USUARIO */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="modal-premium" backdrop="static">
                <Modal.Header closeButton className="modal-premium-header">
                    <Modal.Title className="modal-premium-title">Editar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmitEdit}>
                        <Form.Group className="mb-3">
                            <Form.Label>RUT</Form.Label>
                            <Form.Control
                                type="text"
                                name="rut"
                                value={formData.rut}
                                readOnly
                                disabled
                                className="bg-light"
                            />
                            <Form.Text className="text-muted">El RUT no se puede modificar</Form.Text>
                        </Form.Group>

                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                            <div className="col-md-6 mb-3">
                                <Form.Label>Apellido</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="surname"
                                    value={formData.surname}
                                    onChange={handleFormChange}
                                    required
                                />
                            </div>
                        </div>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleFormChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Teléfono</Form.Label>
                            <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleFormChange}
                                required
                                maxLength={9}
                                onBlur={handlePhoneBlur}
                                isInvalid={!phoneValid}
                            />
                            <Form.Control.Feedback type="invalid">
                                Teléfono inválido (9 dígitos)
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Contraseña</Form.Label>
                            <Form.Control
                                type="password"
                                name="pass"
                                value={formData.pass}
                                onChange={handleFormChange}
                                placeholder="Dejar en blanco para mantener actual"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Rol</Form.Label>
                            <Form.Select
                                name="role"
                                value={formData.role}
                                onChange={handleFormChange}
                            >
                                <option value="cliente">Cliente</option>
                                <option value="repartidor">Repartidor</option>
                                <option value="admin">Administrador</option>
                            </Form.Select>
                        </Form.Group>

                        <div className="d-flex justify-content-end gap-2">
                            <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancelar</Button>
                            <Button variant="primary" type="submit" className="btn-premium">Guardar Cambios</Button>
                        </div>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* MODAL ELIMINAR USUARIO */}
            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                <Modal.Header closeButton className="bg-dark text-white">
                    <Modal.Title className="text-danger">Eliminar Usuario</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <p>¿Estás seguro que deseas eliminar al usuario <strong>{selectedUser?.name}</strong>?</p>
                    <p className="text-danger small">Esta acción no se puede deshacer.</p>
                </Modal.Body>
                <Modal.Footer className="bg-dark border-secondary">
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancelar</Button>
                    <Button variant="danger" onClick={confirmDelete}>Eliminar Definitivamente</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AdminProfiles;

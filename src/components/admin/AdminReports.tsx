import { Row, Col, Card, ProgressBar, Table, Badge } from 'react-bootstrap';

function AdminReports() {
    return (
        <div className="fade-in">
            <h2 className="mb-4 text-dark">📊 Reportes y Estadísticas</h2>

            {/* KPIs Principales */}
            <Row className="mb-4">
                <Col md={3}>
                    <Card className="text-white bg-primary mb-3 shadow-sm">
                        <Card.Header>Ventas del Día</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold">$450.000</Card.Title>
                            <Card.Text>
                                <small>+15% vs ayer</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-success mb-3 shadow-sm">
                        <Card.Header>Pedidos Completados</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold">24</Card.Title>
                            <Card.Text>
                                <small>98% Tasa de éxito</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-warning mb-3 shadow-sm">
                        <Card.Header className="text-dark">Pedidos Pendientes</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold text-dark">5</Card.Title>
                            <Card.Text className="text-dark">
                                <small>Tiempo prom: 45 min</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3}>
                    <Card className="text-white bg-danger mb-3 shadow-sm">
                        <Card.Header>Stock Crítico</Card.Header>
                        <Card.Body>
                            <Card.Title className="display-6 fw-bold">2</Card.Title>
                            <Card.Text>
                                <small>Productos bajos</small>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Ventas por Formato de Cilindro */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-white fw-bold">🔥 Ventas por Formato</Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 15kg (Hogar)</span>
                                    <span className="fw-bold">60%</span>
                                </div>
                                <ProgressBar variant="primary" now={60} />
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 45kg (Industrial/Calefacción)</span>
                                    <span className="fw-bold">25%</span>
                                </div>
                                <ProgressBar variant="info" now={25} />
                            </div>
                            <div className="mb-3">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Gas 11kg / 5kg (Parrilla/Camping)</span>
                                    <span className="fw-bold">15%</span>
                                </div>
                                <ProgressBar variant="warning" now={15} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Zonas de Mayor Demanda */}
                <Col md={6} className="mb-4">
                    <Card className="shadow-sm h-100">
                        <Card.Header className="bg-white fw-bold">📍 Zonas de Mayor Demanda</Card.Header>
                        <Card.Body>
                            <Table hover size="sm">
                                <thead>
                                    <tr>
                                        <th>Sector</th>
                                        <th>Pedidos</th>
                                        <th>Tendencia</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>Centro Concepción</td>
                                        <td>145</td>
                                        <td><Badge bg="success">⬆ Alta</Badge></td>
                                    </tr>
                                    <tr>
                                        <td>Lomas de San Andrés</td>
                                        <td>98</td>
                                        <td><Badge bg="primary">➡ Estable</Badge></td>
                                    </tr>
                                    <tr>
                                        <td>San Pedro de la Paz</td>
                                        <td>76</td>
                                        <td><Badge bg="success">⬆ Alta</Badge></td>
                                    </tr>
                                    <tr>
                                        <td>Hualpén</td>
                                        <td>45</td>
                                        <td><Badge bg="warning">⬇ Baja</Badge></td>
                                    </tr>
                                    <tr>
                                        <td>Chiguayante</td>
                                        <td>30</td>
                                        <td><Badge bg="secondary">➡ Estable</Badge></td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {/* Stock actual */}
                <Col md={12}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-white fw-bold">📦 Inventario de Cilindros</Card.Header>
                        <Card.Body>
                            <Row className="text-center">
                                <Col>
                                    <h5 className="text-secondary">Gas 5kg</h5>
                                    <h3 className="text-dark">150</h3>
                                    <Badge bg="success">Stock OK</Badge>
                                </Col>
                                <Col className="border-start border-end">
                                    <h5 className="text-secondary">Gas 11kg</h5>
                                    <h3 className="text-dark">85</h3>
                                    <Badge bg="success">Stock OK</Badge>
                                </Col>
                                <Col className="border-end">
                                    <h5 className="text-secondary">Gas 15kg</h5>
                                    <h3 className="text-danger">12</h3>
                                    <Badge bg="danger">Crítico</Badge>
                                </Col>
                                <Col>
                                    <h5 className="text-secondary">Gas 45kg</h5>
                                    <h3 className="text-warning">25</h3>
                                    <Badge bg="warning" text="dark">Bajo</Badge>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default AdminReports;


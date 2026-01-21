import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
    return (
        <footer className="bg-dark text-white mt-5 pt-4">
            <Container>
                <Row>
                    {/* Empresa */}
                    <Col md={4} className="mb-3">
                        <h5 className="text-uppercase">ConceGas</h5>
                        <p>
                            Venta y distribución de cilindros de gas licuado para hogares y empresas.
                            Servicio rápido y seguro.
                        </p>
                    </Col>

                    {/* Contacto */}
                    <Col md={4} className="mb-3">
                        <h5 className="text-uppercase">Contacto</h5>
                        <ul className="list-unstyled">
                            <li>📞 Teléfono: +56 9 1234 5678</li>
                            <li>📧 Email: contacto@concegas.cl</li>
                            <li>🕒 Horario: Lun a Sáb 08:00 - 20:00</li>
                        </ul>
                    </Col>

                    {/* Dirección */}
                    <Col md={4} className="mb-3">
                        <h5 className="text-uppercase">Dirección</h5>
                        <p>
                            📍 Av. Ejemplo 1234<br />
                            Concepción, Región del Biobío<br />
                            Chile
                        </p>
                    </Col>
                </Row>

                <hr className="border-secondary" />

                {/* Copyright */}
                <div className="text-center pb-3">
                    <small>
                        © 2026 ConceGas — Todos los derechos reservados
                    </small>
                </div>
            </Container>
        </footer>
    );
}

export default Footer;

import { Spinner, Card, Container } from 'react-bootstrap';

export default function OrderProcessing() {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Card className="text-center shadow-lg p-5 border-0 rounded-4" style={{ backgroundColor: '#fff' }}>
                <Card.Body>
                    <div className="mb-4">
                        <Spinner animation="border" variant="primary" style={{ width: '4rem', height: '4rem' }} />
                    </div>
                    <Card.Title className="h3 mb-3 text-primary">Procesando tu pedido</Card.Title>
                    <Card.Text className="text-muted">
                        Estamos validando tu pago y confirmando stock. Por favor, no cierres esta ventana.
                    </Card.Text>
                </Card.Body>
            </Card>
        </Container>
    );
}

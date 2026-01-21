import { Card, Button, Container } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

interface OrderSuccessProps {
    onContinue: () => void;
}

export default function OrderSuccess({ onContinue }: OrderSuccessProps) {
    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <Card className="text-center shadow-lg p-5 border-0 rounded-4 animate__animated animate__fadeIn">
                <Card.Body>
                    <div className="mb-4">
                        <FaCheckCircle className="text-success display-1" />
                    </div>
                    <Card.Title className="h2 mb-3 fw-bold text-success">¡Pedido Exitoso!</Card.Title>
                    <Card.Text className="text-muted mb-4 fs-5">
                        Tu pago ha sido procesado correctamente. Hemos enviado un correo con los detalles de tu compra.
                    </Card.Text>
                    <div className="d-grid gap-2 col-8 mx-auto">
                        <Button variant="success" size="lg" className="btn-premium" onClick={onContinue}>
                            Seguir Comprando
                        </Button>
                        <Button variant="link" className="text-muted" onClick={onContinue}>
                            Ver mis pedidos
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}

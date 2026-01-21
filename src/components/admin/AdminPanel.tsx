import { useState, useEffect } from 'react';
import { Container, Nav, Row, Col, Button } from 'react-bootstrap';
import { FaBars, FaClipboardList, FaBoxOpen, FaUserFriends, FaChartLine } from 'react-icons/fa';
import AdminOrders from './AdminOrders';
import AdminProducts from './AdminProducts';
import AdminProfiles from './AdminProfiles';
import AdminReports from './AdminReports';

function AdminPanel() {
    const [currentView, setCurrentView] = useState(() => {
        return localStorage.getItem('admin_current_view') || 'pedidos';
    });
    const [collapsed, setCollapsed] = useState(false);

    useEffect(() => {
        localStorage.setItem('admin_current_view', currentView);
    }, [currentView]);

    const renderContent = () => {
        switch (currentView) {
            case 'pedidos':
                return <AdminOrders />;
            case 'productos':
                return <AdminProducts />;
            case 'perfiles':
                return <AdminProfiles />;
            case 'reportes':
                return <AdminReports />;
            default:
                return <AdminOrders />;
        }
    };

    const navItems = [
        { key: 'pedidos', label: 'Pedidos', icon: <FaClipboardList size={20} /> },
        { key: 'productos', label: 'Gestión Productos', icon: <FaBoxOpen size={20} /> },
        { key: 'perfiles', label: 'Gestión Perfiles', icon: <FaUserFriends size={20} /> },
        { key: 'reportes', label: 'Reportes', icon: <FaChartLine size={20} /> },
    ];

    return (
        <Container fluid className="my-4">
            <Row>
                <Col
                    xs={12}
                    md="auto"
                    className={`bg-dark text-white p-3 rounded mb-3 mb-md-0 d-flex flex-column sidebar-panel ${collapsed ? 'collapsed' : 'expanded'}`}
                >
                    <div className={`d-flex align-items-center mb-4 ${collapsed ? 'justify-content-center' : 'justify-content-between'}`}>
                        {!collapsed && <h4 className="text-white m-0 text-truncate">Panel Admin</h4>}
                        <Button
                            variant="link"
                            className="text-white p-0"
                            onClick={() => setCollapsed(!collapsed)}
                            aria-label={collapsed ? "Expandir menú" : "Colapsar menú"}
                        >
                            <FaBars size={24} />
                        </Button>
                    </div>

                    <Nav className="flex-column flex-grow-1" activeKey={currentView} onSelect={(k) => setCurrentView(k || 'pedidos')}>
                        {navItems.map((item) => (
                            <Nav.Item key={item.key} className="mb-2">
                                <Nav.Link
                                    eventKey={item.key}
                                    className={`text-white d-flex align-items-center nav-link-custom ${collapsed ? 'justify-content-center px-0' : 'px-3'} ${currentView === item.key ? 'bg-secondary fw-bold rounded active' : 'text-white-50'}`}
                                    title={collapsed ? item.label : ''}
                                >
                                    <span className={collapsed ? '' : 'me-3'}>{item.icon}</span>
                                    {!collapsed && <span>{item.label}</span>}
                                </Nav.Link>
                            </Nav.Item>
                        ))}
                    </Nav>

                    <div className={`mt-auto pt-3 border-top border-secondary ${collapsed ? 'text-center' : ''}`}>
                        <small className="text-white-50">
                            {collapsed ? 'v1.0' : 'ConceGas Admin v1.0'}
                        </small>
                    </div>
                </Col>

                <Col className="flex-grow-1">
                    {renderContent()}
                </Col>
            </Row>
        </Container>
    );
}

export default AdminPanel;

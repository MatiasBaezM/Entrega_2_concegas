import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import RepartidorPage from './pages/RepartidorPage';

function App() {
  const { isAdmin, isRepartidor } = useAuth();

  if (isAdmin) {
    return <AdminPage />;
  }

  if (isRepartidor) {
    return <RepartidorPage />;
  }

  return <HomePage />;
}

export default App;

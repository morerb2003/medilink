
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
            <AppRouter />
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;


import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <div className="relative min-h-screen bg-medilink-canvas text-medilink-ink overflow-x-hidden font-sans">
            {/* Premium Background Mesh */}
            <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
              <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-medilink-mint/20 rounded-full blur-[120px] animate-pulse" />
              <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-medilink-coral/10 rounded-full blur-[100px] animate-bounce" style={{ animationDuration: '10s' }} />
              <div className="absolute top-[20%] right-[15%] w-[25%] h-[25%] bg-medilink-gold/10 rounded-full blur-[80px]" />
            </div>
            
            <div className="relative z-10 flex flex-col min-h-screen">
              <AppRouter />
            </div>
          </div>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default App;

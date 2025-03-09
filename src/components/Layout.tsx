
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Home, 
  Activity,
  PanelLeftClose,
  PanelLeftOpen,
  LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { toast } = useToast();

  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/schedules', icon: <Calendar className="w-5 h-5" />, label: 'Schedules' },
    { path: '/alarms', icon: <Clock className="w-5 h-5" />, label: 'Alarms' },
    { path: '/health', icon: <Activity className="w-5 h-5" />, label: 'Health' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = () => {
    // Clear all stored information
    localStorage.removeItem('user-email');
    localStorage.removeItem('onboarding-completed');
    localStorage.removeItem('elderly-info');
    
    toast({
      title: 'Signed out successfully',
      description: 'You have been signed out of your account.',
    });
    
    // Navigate to login page
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-all duration-300",
          isSidebarOpen ? "w-64" : "w-16"
        )}
      >
        <div className="h-full overflow-y-auto py-5 px-3 bg-white border-r border-gray-200 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              {isSidebarOpen && (
                <h1 className="text-xl font-bold text-eldercare-blue">ElderCare Sync</h1>
              )}
              <button 
                onClick={toggleSidebar}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                {isSidebarOpen ? 
                  <PanelLeftClose className="h-5 w-5 text-gray-500" /> : 
                  <PanelLeftOpen className="h-5 w-5 text-gray-500" />
                }
              </button>
            </div>
            
            <nav className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center p-2 rounded-lg",
                    location.pathname === item.path 
                      ? "bg-eldercare-light-blue text-eldercare-blue" 
                      : "text-gray-600 hover:bg-gray-100",
                    isSidebarOpen ? "justify-start" : "justify-center"
                  )}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Sign Out Button */}
          <div className="mt-auto">
            <Button
              variant="outline"
              className={cn(
                "w-full flex items-center text-gray-600 hover:bg-gray-100 hover:text-eldercare-red",
                isSidebarOpen ? "justify-start" : "justify-center"
              )}
              onClick={handleSignOut}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="ml-3">Sign Out</span>}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main 
        className={cn(
          "transition-all duration-300 flex-1 p-5", 
          isSidebarOpen ? "ml-64" : "ml-16"
        )}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;

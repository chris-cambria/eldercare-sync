
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Home, 
  Bell, 
  Activity, 
  Settings,
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { toast } = useToast();

  const navItems = [
    { path: '/', icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/schedules', icon: <Calendar className="w-5 h-5" />, label: 'Schedules' },
    { path: '/alarms', icon: <Clock className="w-5 h-5" />, label: 'Alarms' },
    { path: '/notifications', icon: <Bell className="w-5 h-5" />, label: 'Notifications' },
    { path: '/health', icon: <Activity className="w-5 h-5" />, label: 'Health' },
    { path: '/settings', icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const showComingSoonToast = (feature: string) => {
    toast({
      title: "Coming Soon",
      description: `${feature} feature will be available in the next update.`,
    });
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
        <div className="h-full overflow-y-auto py-5 px-3 bg-white border-r border-gray-200">
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
                onClick={(e) => {
                  // Only allow dashboard and schedules to navigate for now
                  if (!["/", "/schedules", "/alarms", "/health"].includes(item.path)) {
                    e.preventDefault();
                    showComingSoonToast(item.label);
                  }
                }}
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

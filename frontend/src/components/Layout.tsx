import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Calendar, Clock, Settings, Home, CalendarDays } from 'lucide-react';
import { cn } from '../utils/helpers';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Calendar', href: '/calendar', icon: CalendarDays },
    { name: 'Slots', href: '/slots', icon: Clock },
    { name: 'Exceptions', href: '/exceptions', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-dark-950">
      {/* Header */}
      <header className="bg-gradient-to-r from-dark-900 to-dark-850 border-b border-dark-700 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-500 rounded-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h1 className="ml-3 text-xl font-bold bg-gradient-to-r from-primary-400 to-primary-300 bg-clip-text text-transparent">
                  Scheduler
                </h1>
              </div>
            </div>
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all',
                      isActive
                        ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                        : 'text-dark-400 hover:text-foreground hover:bg-dark-800'
                    )}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="md:hidden bg-dark-900 border-b border-dark-700">
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'flex items-center px-3 py-2 rounded-lg text-base font-medium transition-all',
                  isActive
                    ? 'bg-gradient-to-r from-primary-600 to-primary-500 text-white'
                    : 'text-dark-400 hover:text-foreground hover:bg-dark-800'
                )}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;

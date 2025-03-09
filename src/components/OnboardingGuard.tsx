
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface OnboardingGuardProps {
  children: React.ReactNode;
}

const OnboardingGuard: React.FC<OnboardingGuardProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the user is logged in and completed onboarding
    const isLoggedIn = localStorage.getItem('user-email');
    const isOnboardingCompleted = localStorage.getItem('onboarding-completed');
    
    // Don't redirect if already on login or onboarding page
    const isAuthPage = location.pathname === '/login' || location.pathname === '/onboarding';
    
    if (!isLoggedIn && !isAuthPage) {
      navigate('/login');
    } else if (isLoggedIn && !isOnboardingCompleted && location.pathname !== '/onboarding') {
      navigate('/onboarding');
    }
    
    setIsLoading(false);
  }, [navigate, location.pathname]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-eldercare-blue border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default OnboardingGuard;

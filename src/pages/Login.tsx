
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'பிழை',
        description: 'மின்னஞ்சல் மற்றும் கடவுச்சொல் இரண்டையும் உள்ளிடவும்',
        variant: 'destructive',
      });
      return;
    }

    // For demo purposes, we'll just navigate to the onboarding
    // In a real app, you would validate credentials against a backend
    localStorage.setItem('user-email', email);
    navigate('/onboarding');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">AuraWell</CardTitle>
          <CardDescription className="text-center">
            உங்கள் கணக்கை அணுக சான்றுகளை உள்ளிடவும்
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">மின்னஞ்சல்</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">கடவுச்சொல்</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">உள்நுழை</Button>
          </form>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-center text-gray-500 w-full">
            கணக்கு இல்லையா? <a href="#" className="text-eldercare-blue hover:underline">பதிவு செய்யுங்கள்</a>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

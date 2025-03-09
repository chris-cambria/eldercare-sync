
import React, { useEffect, useState } from 'react';
import { 
  CalendarCheck, 
  Pill, 
  Dumbbell, 
  AlertTriangle, 
  ChevronRight,
  Heart,
  Activity,
  User
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

// Define types to match the onboarding data structure
type MedicationInfo = {
  name: string;
  time: string;
  dosage: string;
};

type MealInfo = {
  type: string;
  time: string;
};

type ExerciseInfo = {
  type: string;
  time: string;
  duration: string;
};

type ElderlyInfo = {
  name: string;
  age: string;
  gender: string;
  medicalConditions: string;
  allergies: string;
  emergencyContact: string;
  medications: MedicationInfo[];
  meals: MealInfo[];
  exercises: ExerciseInfo[];
};

const Dashboard = () => {
  const { toast } = useToast();
  const [elderlyInfo, setElderlyInfo] = useState<ElderlyInfo | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Load elderly information from localStorage
    const storedInfo = localStorage.getItem('elderly-info');
    if (storedInfo) {
      setElderlyInfo(JSON.parse(storedInfo));
    }
    setLoading(false);
  }, []);

  // Mock data for statistics that would normally come from an API
  const patientData = {
    lastActive: "10 minutes ago",
    healthStatus: "Stable",
    medicationAdherence: 85,
    exerciseCompletion: 60,
    mealCompletion: 90,
    missedAlarms: 1,
    recentActivities: [
      { type: 'medication', name: 'Took Morning Medication', time: '8:00 AM', status: 'completed' },
      { type: 'meal', name: 'Had Breakfast', time: '9:00 AM', status: 'completed' },
      { type: 'alarm', name: 'Missed Exercise Reminder', time: 'Yesterday, 4:00 PM', status: 'missed' },
    ]
  };

  const connectFitbit = () => {
    toast({
      title: "Permission Required",
      description: "We need your permission to connect to Fitbit for better health tracking.",
      action: (
        <Button
          variant="default"
          onClick={() => {
            toast({
              title: "Fitbit Connected",
              description: "Successfully connected to Fitbit account.",
            });
          }}
        >
          Allow
        </Button>
      ),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-eldercare-blue border-gray-200 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Generate upcoming events from the onboarding data
  const generateUpcomingEvents = () => {
    if (!elderlyInfo) return [];
    
    const events = [];
    
    // Add medications to events
    elderlyInfo.medications.forEach(med => {
      events.push({
        type: 'medication',
        name: med.name,
        time: med.time
      });
    });
    
    // Add meals to events
    elderlyInfo.meals.forEach(meal => {
      events.push({
        type: 'meal',
        name: meal.type.charAt(0).toUpperCase() + meal.type.slice(1),
        time: meal.time
      });
    });
    
    // Add exercises to events
    elderlyInfo.exercises.forEach(exercise => {
      events.push({
        type: 'exercise',
        name: exercise.type,
        time: exercise.time
      });
    });
    
    // Sort events by time
    return events.sort((a, b) => {
      const timeA = new Date(`2000-01-01T${a.time}`);
      const timeB = new Date(`2000-01-01T${b.time}`);
      return timeA.getTime() - timeB.getTime();
    }).slice(0, 3); // Get next 3 events
  };

  const upcomingEvents = generateUpcomingEvents();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Caregiver Dashboard</h1>
        <Button onClick={connectFitbit} variant="outline" className="flex items-center">
          <Heart className="w-4 h-4 mr-2 text-eldercare-red" />
          Connect Fitbit
        </Button>
      </div>

      {/* Patient overview card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between">
            <div>
              <CardTitle className="text-xl">{elderlyInfo?.name || 'No name provided'}</CardTitle>
              <CardDescription>
                {elderlyInfo?.age || '0'} years • Last active: {patientData.lastActive}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-1 px-3 py-1 bg-eldercare-light-green text-eldercare-green rounded-full text-sm">
              <Activity className="w-4 h-4" />
              <span>{patientData.healthStatus}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center">
                  <Pill className="w-4 h-4 mr-1 text-eldercare-blue" />
                  Medication Adherence
                </span>
                <span>{patientData.medicationAdherence}%</span>
              </div>
              <Progress value={patientData.medicationAdherence} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center">
                  <Dumbbell className="w-4 h-4 mr-1 text-eldercare-green" />
                  Exercise Completion
                </span>
                <span>{patientData.exerciseCompletion}%</span>
              </div>
              <Progress value={patientData.exerciseCompletion} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="flex items-center">
                  <CalendarCheck className="w-4 h-4 mr-1 text-eldercare-purple" />
                  Meal Completion
                </span>
                <span>{patientData.mealCompletion}%</span>
              </div>
              <Progress value={patientData.mealCompletion} className="h-2" />
            </div>
          </div>

          {elderlyInfo?.medicalConditions && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium text-sm mb-1">Medical Conditions:</h3>
              <p className="text-sm text-gray-700">{elderlyInfo.medicalConditions}</p>
            </div>
          )}

          {elderlyInfo?.allergies && (
            <div className="mt-2 p-3 bg-gray-50 rounded-md">
              <h3 className="font-medium text-sm mb-1">Allergies:</h3>
              <p className="text-sm text-gray-700">{elderlyInfo.allergies}</p>
            </div>
          )}

          {patientData.missedAlarms > 0 && (
            <div className="mt-4 p-3 bg-red-50 text-eldercare-red rounded-md flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>
                <strong>{patientData.missedAlarms}</strong> missed alarm in the last 24 hours. 
                {patientData.missedAlarms >= 3 && " Alert threshold reached!"}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Upcoming events card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center justify-between">
              <span>Upcoming Events</span>
              <Link to="/schedules" className="text-sm text-eldercare-blue flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center p-3 rounded-md border border-gray-100 hover:bg-gray-50">
                    {event.type === 'medication' && <Pill className="w-5 h-5 mr-3 text-eldercare-blue" />}
                    {event.type === 'meal' && <CalendarCheck className="w-5 h-5 mr-3 text-eldercare-purple" />}
                    {event.type === 'exercise' && <Dumbbell className="w-5 h-5 mr-3 text-eldercare-green" />}
                    <div className="flex-1">
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-gray-500">{event.time}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 text-gray-500">
                  No upcoming events found
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent activities card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientData.recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-3 rounded-md border 
                    ${activity.status === 'missed' ? 'border-red-100 bg-red-50' : 'border-gray-100'}`}
                >
                  {activity.type === 'medication' && <Pill className="w-5 h-5 mr-3 text-eldercare-blue" />}
                  {activity.type === 'meal' && <CalendarCheck className="w-5 h-5 mr-3 text-eldercare-purple" />}
                  {activity.type === 'exercise' && <Dumbbell className="w-5 h-5 mr-3 text-eldercare-green" />}
                  {activity.type === 'alarm' && <AlertTriangle className="w-5 h-5 mr-3 text-eldercare-red" />}
                  <div className="flex-1">
                    <p className="font-medium">{activity.name}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                  {activity.status === 'completed' && 
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">Completed</span>
                  }
                  {activity.status === 'missed' && 
                    <span className="text-xs px-2 py-1 bg-red-100 text-red-800 rounded-full">Missed</span>
                  }
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;

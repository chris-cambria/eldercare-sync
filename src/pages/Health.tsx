
import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Footprints, 
  Moon,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Progress } from '@/components/ui/progress';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';

const HealthDashboard = () => {
  const { toast } = useToast();
  const [isConnected, setIsConnected] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock data for the health metrics
  const heartRateData = [
    { time: '00:00', rate: 62 },
    { time: '04:00', rate: 58 },
    { time: '08:00', rate: 72 },
    { time: '12:00', rate: 85 },
    { time: '16:00', rate: 78 },
    { time: '20:00', rate: 68 },
    { time: '23:59', rate: 64 },
  ];
  
  const sleepData = [
    { stage: 'Deep', hours: 1.8, color: '#4A90E2' },
    { stage: 'Light', hours: 4.2, color: '#50C878' },
    { stage: 'REM', hours: 1.5, color: '#9D65C9' },
    { stage: 'Awake', hours: 0.5, color: '#FFA500' },
  ];
  
  const stepsData = [
    { day: 'Mon', steps: 7800 },
    { day: 'Tue', steps: 8200 },
    { day: 'Wed', steps: 6500 },
    { day: 'Thu', steps: 9100 },
    { day: 'Fri', steps: 8700 },
    { day: 'Sat', steps: 5400 },
    { day: 'Sun', steps: 3200 },
  ];
  
  const activityData = [
    { day: 'Mon', active: 135, sedentary: 720, light: 585 },
    { day: 'Tue', active: 145, sedentary: 680, light: 615 },
    { day: 'Wed', active: 120, sedentary: 740, light: 580 },
    { day: 'Thu', active: 168, sedentary: 660, light: 612 },
    { day: 'Fri', active: 152, sedentary: 690, light: 598 },
    { day: 'Sat', active: 105, sedentary: 760, light: 575 },
    { day: 'Sun', active: 85, sedentary: 820, light: 535 },
  ];

  const healthSummary = {
    heartRate: {
      current: 72,
      resting: 64,
      min: 58,
      max: 118,
      trend: 'down',
    },
    steps: {
      current: 8700,
      goal: 10000,
      trend: 'up',
      average: 7800,
    },
    sleep: {
      lastNight: 7.5,
      goal: 8,
      quality: 'Good',
      trend: 'stable',
    },
    activity: {
      activeMinutes: 152,
      goal: 150,
      caloriesBurned: 1860,
      trend: 'up',
    },
  };

  const connectFitbit = () => {
    setIsLoading(true);
    
    toast({
      title: "Requesting Permission",
      description: "Please allow Fitbit access to help track health metrics.",
    });
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsConnected(true);
      toast({
        title: "Connection Successful",
        description: "Fitbit account has been connected successfully.",
      });
    }, 1500);
  };

  const refreshData = () => {
    setIsLoading(true);
    
    // Simulate refreshing data
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Data Updated",
        description: "Health data has been refreshed.",
      });
    }, 1000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short',
      day: 'numeric', 
    });
  };

  const previousDay = () => {
    const prevDate = new Date(currentDate);
    prevDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(prevDate);
  };

  const nextDay = () => {
    const nextDate = new Date(currentDate);
    nextDate.setDate(currentDate.getDate() + 1);
    const today = new Date();
    
    if (nextDate <= today) {
      setCurrentDate(nextDate);
    } else {
      toast({
        title: "Cannot Navigate Forward",
        description: "Future data is not available yet.",
        variant: "destructive",
      });
    }
  };

  const TrendIndicator = ({ trend }: { trend: string }) => {
    return (
      <span className={`flex items-center ml-2 ${
        trend === 'up' ? 'text-eldercare-green' : 
        trend === 'down' ? 'text-eldercare-red' : 'text-eldercare-blue'
      }`}>
        {trend === 'up' && <ArrowUpRight className="h-4 w-4" />}
        {trend === 'down' && <ArrowDownRight className="h-4 w-4" />}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Health Tracking</h1>
        {!isConnected ? (
          <Button onClick={connectFitbit} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2 text-eldercare-red" />
                Connect Fitbit
              </>
            )}
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            </Button>
            <div className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <Heart className="w-4 h-4 mr-1 text-eldercare-red" />
              <span>Fitbit Connected</span>
            </div>
          </div>
        )}
      </div>

      {!isConnected ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Heart className="w-16 h-16 mx-auto mb-4 text-eldercare-red animate-pulse-gentle" />
            <h2 className="text-xl font-semibold mb-2">Connect to Fitbit</h2>
            <p className="text-gray-500 mb-6 max-w-lg mx-auto">
              Connect your Fitbit account to track heart rate, sleep patterns, activity levels, 
              and more for better health monitoring of your loved one.
            </p>
            <Button onClick={connectFitbit} disabled={isLoading}>
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Connect Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button variant="outline" onClick={previousDay}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <div className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2 text-eldercare-blue" />
                <span className="font-medium">{formatDate(currentDate)}</span>
              </div>
              <Button variant="outline" onClick={nextDay}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Heart className="w-4 h-4 mr-2 text-eldercare-red" />
                  Heart Rate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{healthSummary.heartRate.current}</span>
                  <span className="text-sm ml-1">bpm</span>
                  <TrendIndicator trend={healthSummary.heartRate.trend} />
                </div>
                <div className="mt-1 grid grid-cols-3 text-xs text-gray-500">
                  <div>
                    <span className="block">Resting</span>
                    <span className="font-medium">{healthSummary.heartRate.resting} bpm</span>
                  </div>
                  <div>
                    <span className="block">Min</span>
                    <span className="font-medium">{healthSummary.heartRate.min} bpm</span>
                  </div>
                  <div>
                    <span className="block">Max</span>
                    <span className="font-medium">{healthSummary.heartRate.max} bpm</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Footprints className="w-4 h-4 mr-2 text-eldercare-blue" />
                  Steps
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{healthSummary.steps.current.toLocaleString()}</span>
                  <TrendIndicator trend={healthSummary.steps.trend} />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Goal: {healthSummary.steps.goal.toLocaleString()} steps</span>
                    <span>{Math.round((healthSummary.steps.current / healthSummary.steps.goal) * 100)}%</span>
                  </div>
                  <Progress value={(healthSummary.steps.current / healthSummary.steps.goal) * 100} className="h-1.5" />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>Avg: {healthSummary.steps.average.toLocaleString()} steps</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Moon className="w-4 h-4 mr-2 text-eldercare-purple" />
                  Sleep
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{healthSummary.sleep.lastNight}</span>
                  <span className="text-sm ml-1">hrs</span>
                  <TrendIndicator trend={healthSummary.sleep.trend} />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Quality: {healthSummary.sleep.quality}</span>
                    <span>{Math.round((healthSummary.sleep.lastNight / healthSummary.sleep.goal) * 100)}%</span>
                  </div>
                  <div className="flex h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    {sleepData.map((stage, i) => (
                      <div 
                        key={i}
                        className="h-full" 
                        style={{ 
                          width: `${(stage.hours / healthSummary.sleep.goal) * 100}%`,
                          backgroundColor: stage.color
                        }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>Goal: {healthSummary.sleep.goal} hrs</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Activity className="w-4 h-4 mr-2 text-eldercare-green" />
                  Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold">{healthSummary.activity.activeMinutes}</span>
                  <span className="text-sm ml-1">mins</span>
                  <TrendIndicator trend={healthSummary.activity.trend} />
                </div>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Goal: {healthSummary.activity.goal} mins</span>
                    <span>{Math.round((healthSummary.activity.activeMinutes / healthSummary.activity.goal) * 100)}%</span>
                  </div>
                  <Progress 
                    value={(healthSummary.activity.activeMinutes / healthSummary.activity.goal) * 100} 
                    className="h-1.5"
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <span>{healthSummary.activity.caloriesBurned} calories burned</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="heartRate">
            <TabsList className="mb-4">
              <TabsTrigger value="heartRate">Heart Rate</TabsTrigger>
              <TabsTrigger value="steps">Steps</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="heartRate">
              <Card>
                <CardHeader>
                  <CardTitle>Heart Rate</CardTitle>
                  <CardDescription>24-hour heart rate monitoring</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={heartRateData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="time" />
                        <YAxis domain={[40, 120]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="rate" 
                          stroke="#FF6B6B" 
                          strokeWidth={2} 
                          dot={{ r: 4 }} 
                          activeDot={{ r: 8 }} 
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="steps">
              <Card>
                <CardHeader>
                  <CardTitle>Steps</CardTitle>
                  <CardDescription>Daily step count for the past week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={stepsData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Bar 
                          dataKey="steps" 
                          fill="#4A90E2" 
                          radius={[4, 4, 0, 0]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="sleep">
              <Card>
                <CardHeader>
                  <CardTitle>Sleep Analysis</CardTitle>
                  <CardDescription>Sleep stages from last night</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col md:flex-row items-center">
                    <div className="w-full md:w-1/2 h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                          data={sleepData} 
                          layout="vertical" 
                          margin={{ top: 20, right: 30, left: 40, bottom: 0 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" />
                          <YAxis dataKey="stage" type="category" />
                          <Tooltip />
                          <Bar 
                            dataKey="hours" 
                            radius={[0, 4, 4, 0]}
                            fill="rgba(0, 0, 0, 0)" // Transparent fill
                          >
                            {sleepData.map((entry, index) => (
                              <rect key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 p-6">
                      <h3 className="text-lg font-semibold mb-4">Sleep Summary</h3>
                      <div className="space-y-4">
                        {sleepData.map((stage, i) => (
                          <div key={i} className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-2" 
                              style={{ backgroundColor: stage.color }}
                            />
                            <div className="flex-1">
                              <span className="font-medium">{stage.stage}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-semibold">{stage.hours} hrs</span>
                              <span className="text-xs text-gray-500 block">
                                {Math.round((stage.hours / healthSummary.sleep.lastNight) * 100)}%
                              </span>
                            </div>
                          </div>
                        ))}
                        <div className="pt-2 border-t border-gray-100">
                          <div className="flex justify-between">
                            <span className="font-medium">Total Sleep</span>
                            <span className="font-semibold">{healthSummary.sleep.lastNight} hrs</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Levels</CardTitle>
                  <CardDescription>Active minutes per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area 
                          type="monotone" 
                          dataKey="active" 
                          stackId="1" 
                          stroke="#50C878" 
                          fill="#50C878" 
                          name="Active"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="light" 
                          stackId="1" 
                          stroke="#B8E2F2" 
                          fill="#B8E2F2" 
                          name="Light"
                        />
                        <Area 
                          type="monotone" 
                          dataKey="sedentary" 
                          stackId="1" 
                          stroke="#F0F4F8" 
                          fill="#F0F4F8" 
                          name="Sedentary"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};

export default HealthDashboard;

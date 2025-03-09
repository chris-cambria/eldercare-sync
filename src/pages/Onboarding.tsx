import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

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

const defaultElderlyInfo: ElderlyInfo = {
  name: '',
  age: '',
  gender: '',
  medicalConditions: '',
  allergies: '',
  emergencyContact: '',
  medications: [{ name: '', time: '', dosage: '' }],
  meals: [{ type: 'breakfast', time: '08:00' }],
  exercises: [{ type: '', time: '', duration: '30' }]
};

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState('profile');
  const [elderlyInfo, setElderlyInfo] = useState<ElderlyInfo>(defaultElderlyInfo);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (section: keyof ElderlyInfo, field: string, value: string) => {
    setElderlyInfo(prev => {
      // Fix: Handle primitive values directly
      if (field === '') {
        return {
          ...prev,
          [section]: value
        };
      } else {
        // This case is not currently used in this component
        // But we'll keep it for future extensibility
        const sectionValue = prev[section];
        if (typeof sectionValue === 'object' && sectionValue !== null) {
          return {
            ...prev,
            [section]: {
              ...sectionValue,
              [field]: value
            }
          };
        }
        return prev;
      }
    });
  };

  const handleArrayChange = (
    section: 'medications' | 'meals' | 'exercises', 
    index: number, 
    field: string, 
    value: string
  ) => {
    setElderlyInfo(prev => {
      const updatedArray = [...prev[section]];
      updatedArray[index] = { 
        ...updatedArray[index], 
        [field]: value 
      };
      return { ...prev, [section]: updatedArray };
    });
  };

  const addArrayItem = (section: 'medications' | 'meals' | 'exercises') => {
    setElderlyInfo(prev => {
      let newItem;
      
      if (section === 'medications') {
        newItem = { name: '', time: '', dosage: '' };
      } else if (section === 'meals') {
        newItem = { type: 'breakfast', time: '' };
      } else {
        newItem = { type: '', time: '', duration: '30' };
      }
      
      return {
        ...prev,
        [section]: [...prev[section], newItem]
      };
    });
  };

  const removeArrayItem = (section: 'medications' | 'meals' | 'exercises', index: number) => {
    setElderlyInfo(prev => {
      const updatedArray = [...prev[section]];
      if (updatedArray.length > 1) {
        updatedArray.splice(index, 1);
      }
      return { ...prev, [section]: updatedArray };
    });
  };

  const validateStep = (step: string) => {
    if (step === 'profile') {
      if (!elderlyInfo.name || !elderlyInfo.age || !elderlyInfo.gender) {
        toast({
          title: 'Missing Information',
          description: 'Please fill out all required fields before proceeding.',
          variant: 'destructive',
        });
        return false;
      }
    } else if (step === 'medical') {
      const allMedsValid = elderlyInfo.medications.every(med => 
        med.name.trim() !== '' && med.time.trim() !== ''
      );
      
      if (!allMedsValid) {
        toast({
          title: 'Missing Information',
          description: 'Please complete all medication fields or remove empty entries.',
          variant: 'destructive',
        });
        return false;
      }
    } else if (step === 'meals') {
      const allMealsValid = elderlyInfo.meals.every(meal => 
        meal.time.trim() !== ''
      );
      
      if (!allMealsValid) {
        toast({
          title: 'Missing Information',
          description: 'Please set times for all meals.',
          variant: 'destructive',
        });
        return false;
      }
    } else if (step === 'exercise') {
      const allExercisesValid = elderlyInfo.exercises.every(exercise => 
        exercise.type.trim() !== '' && exercise.time.trim() !== ''
      );
      
      if (!allExercisesValid) {
        toast({
          title: 'Missing Information',
          description: 'Please complete all exercise fields or remove empty entries.',
          variant: 'destructive',
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = () => {
    if (validateStep('exercise')) {
      // Save the data to localStorage for persistence
      localStorage.setItem('elderly-info', JSON.stringify(elderlyInfo));
      localStorage.setItem('onboarding-completed', 'true');
      
      toast({
        title: 'Setup Complete',
        description: 'All information has been saved successfully.',
      });
      
      navigate('/');
    }
  };

  const navigateToStep = (step: string) => {
    if (validateStep(currentStep)) {
      setCurrentStep(step);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Setup Elderly Care Information</CardTitle>
          <CardDescription>
            Please provide details about the elderly person you're caring for.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={currentStep} onValueChange={navigateToStep} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="medical">Medical & Medications</TabsTrigger>
              <TabsTrigger value="meals">Meals</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
            </TabsList>
            
            {/* Profile Information */}
            <TabsContent value="profile">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={elderlyInfo.name}
                    onChange={(e) => handleChange('name', '', e.target.value)}
                    placeholder="Enter full name" 
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number" 
                      value={elderlyInfo.age}
                      onChange={(e) => handleChange('age', '', e.target.value)}
                      placeholder="Age" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={elderlyInfo.gender}
                      onValueChange={(value) => handleChange('gender', '', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emergency-contact">Emergency Contact</Label>
                  <Input 
                    id="emergency-contact" 
                    value={elderlyInfo.emergencyContact}
                    onChange={(e) => handleChange('emergencyContact', '', e.target.value)}
                    placeholder="Name & Phone Number" 
                  />
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => navigateToStep('medical')}>Next</Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Medical Information */}
            <TabsContent value="medical">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="medical-conditions">Medical Conditions</Label>
                  <Textarea 
                    id="medical-conditions" 
                    value={elderlyInfo.medicalConditions}
                    onChange={(e) => handleChange('medicalConditions', '', e.target.value)}
                    placeholder="Enter any medical conditions" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea 
                    id="allergies" 
                    value={elderlyInfo.allergies}
                    onChange={(e) => handleChange('allergies', '', e.target.value)}
                    placeholder="Enter any allergies" 
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Medications</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('medications')}
                    >
                      Add Medication
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {elderlyInfo.medications.map((medication, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5 space-y-1">
                          <Label htmlFor={`med-name-${index}`} className="text-xs">Name</Label>
                          <Input 
                            id={`med-name-${index}`} 
                            value={medication.name}
                            onChange={(e) => handleArrayChange('medications', index, 'name', e.target.value)}
                            placeholder="Medication name" 
                          />
                        </div>
                        
                        <div className="col-span-3 space-y-1">
                          <Label htmlFor={`med-time-${index}`} className="text-xs">Time</Label>
                          <Input 
                            id={`med-time-${index}`} 
                            type="time"
                            value={medication.time}
                            onChange={(e) => handleArrayChange('medications', index, 'time', e.target.value)}
                          />
                        </div>
                        
                        <div className="col-span-3 space-y-1">
                          <Label htmlFor={`med-dosage-${index}`} className="text-xs">Dosage</Label>
                          <Input 
                            id={`med-dosage-${index}`} 
                            value={medication.dosage}
                            onChange={(e) => handleArrayChange('medications', index, 'dosage', e.target.value)}
                            placeholder="e.g., 10mg" 
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeArrayItem('medications', index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigateToStep('profile')}>
                    Previous
                  </Button>
                  <Button onClick={() => navigateToStep('meals')}>Next</Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Meals Information */}
            <TabsContent value="meals">
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  <Label>Meal Schedule</Label>
                  
                  <div className="space-y-3">
                    {elderlyInfo.meals.map((meal, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5 space-y-1">
                          <Label htmlFor={`meal-type-${index}`} className="text-xs">Type</Label>
                          <Select 
                            value={meal.type}
                            onValueChange={(value) => handleArrayChange('meals', index, 'type', value)}
                          >
                            <SelectTrigger id={`meal-type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="breakfast">Breakfast</SelectItem>
                              <SelectItem value="lunch">Lunch</SelectItem>
                              <SelectItem value="dinner">Dinner</SelectItem>
                              <SelectItem value="snack">Snack</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-6 space-y-1">
                          <Label htmlFor={`meal-time-${index}`} className="text-xs">Time</Label>
                          <Input 
                            id={`meal-time-${index}`} 
                            type="time"
                            value={meal.time}
                            onChange={(e) => handleArrayChange('meals', index, 'time', e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeArrayItem('meals', index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => addArrayItem('meals')}
                  >
                    Add Meal
                  </Button>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigateToStep('medical')}>
                    Previous
                  </Button>
                  <Button onClick={() => navigateToStep('exercise')}>Next</Button>
                </div>
              </div>
            </TabsContent>
            
            {/* Exercise Information */}
            <TabsContent value="exercise">
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Exercise Schedule</Label>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => addArrayItem('exercises')}
                    >
                      Add Exercise
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    {elderlyInfo.exercises.map((exercise, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5 space-y-1">
                          <Label htmlFor={`exercise-type-${index}`} className="text-xs">Type</Label>
                          <Input 
                            id={`exercise-type-${index}`} 
                            value={exercise.type}
                            onChange={(e) => handleArrayChange('exercises', index, 'type', e.target.value)}
                            placeholder="e.g., Walking, Stretching" 
                          />
                        </div>
                        
                        <div className="col-span-3 space-y-1">
                          <Label htmlFor={`exercise-time-${index}`} className="text-xs">Time</Label>
                          <Input 
                            id={`exercise-time-${index}`} 
                            type="time"
                            value={exercise.time}
                            onChange={(e) => handleArrayChange('exercises', index, 'time', e.target.value)}
                          />
                        </div>
                        
                        <div className="col-span-3 space-y-1">
                          <Label htmlFor={`exercise-duration-${index}`} className="text-xs">Duration (min)</Label>
                          <Input 
                            id={`exercise-duration-${index}`} 
                            type="number"
                            value={exercise.duration}
                            onChange={(e) => handleArrayChange('exercises', index, 'duration', e.target.value)}
                          />
                        </div>
                        
                        <Button 
                          variant="ghost" 
                          size="icon"
                          className="col-span-1"
                          onClick={() => removeArrayItem('exercises', index)}
                        >
                          <span className="sr-only">Remove</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="w-4 h-4"
                          >
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => navigateToStep('meals')}>
                    Previous
                  </Button>
                  <Button onClick={handleSubmit}>Complete Setup</Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;

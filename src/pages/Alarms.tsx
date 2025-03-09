
import React, { useState } from 'react';
import { 
  Clock, 
  Trash, 
  Plus,
  Edit,
  Bell,
  Volume2,
  Volume1,
  VolumeX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

type Alarm = {
  id: string;
  time: string;
  label: string;
  days: string[];
  enabled: boolean;
  volume: 'low' | 'medium' | 'high' | 'muted';
  linkedTo: 'medication' | 'meal' | 'exercise' | 'custom';
};

const Alarms = () => {
  const [alarms, setAlarms] = useState<Alarm[]>([
    {
      id: '1',
      time: '08:00',
      label: 'Morning Medication',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      enabled: true,
      volume: 'medium',
      linkedTo: 'medication',
    },
    {
      id: '2',
      time: '12:30',
      label: 'Lunch Time',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      enabled: true,
      volume: 'medium',
      linkedTo: 'meal',
    },
    {
      id: '3',
      time: '17:00',
      label: 'Evening Walk',
      days: ['mon', 'wed', 'fri'],
      enabled: true,
      volume: 'low',
      linkedTo: 'exercise',
    },
    {
      id: '4',
      time: '20:00',
      label: 'Evening Medication',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      enabled: true,
      volume: 'medium',
      linkedTo: 'medication',
    },
  ]);
  
  const [newAlarm, setNewAlarm] = useState<Omit<Alarm, 'id'>>({
    time: '',
    label: '',
    days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
    enabled: true,
    volume: 'medium',
    linkedTo: 'custom',
  });
  
  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const weekdays = [
    { value: 'mon', label: 'M' },
    { value: 'tue', label: 'T' },
    { value: 'wed', label: 'W' },
    { value: 'thu', label: 'T' },
    { value: 'fri', label: 'F' },
    { value: 'sat', label: 'S' },
    { value: 'sun', label: 'S' },
  ];

  const handleAddAlarm = () => {
    if (!newAlarm.time || !newAlarm.label) {
      toast({
        title: 'Error',
        description: 'Please fill out all fields',
        variant: 'destructive',
      });
      return;
    }

    const alarmToAdd = {
      ...newAlarm,
      id: Math.random().toString(36).substr(2, 9),
    };
    
    setAlarms([...alarms, alarmToAdd]);
    setNewAlarm({
      time: '',
      label: '',
      days: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'],
      enabled: true,
      volume: 'medium',
      linkedTo: 'custom',
    });
    
    setDialogOpen(false);
    
    toast({
      title: 'Success',
      description: 'Alarm has been added.',
    });
  };

  const handleEditAlarm = () => {
    if (editingAlarm && (editingAlarm.time && editingAlarm.label)) {
      setAlarms(
        alarms.map(alarm => 
          alarm.id === editingAlarm.id ? editingAlarm : alarm
        )
      );
      
      setEditingAlarm(null);
      setDialogOpen(false);
      
      toast({
        title: 'Updated',
        description: 'Alarm has been updated.',
      });
    }
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms(alarms.filter(alarm => alarm.id !== id));
    
    toast({
      title: 'Deleted',
      description: 'Alarm has been removed.',
    });
  };

  const toggleAlarm = (id: string, enabled: boolean) => {
    setAlarms(
      alarms.map(alarm => 
        alarm.id === id ? { ...alarm, enabled } : alarm
      )
    );
    
    toast({
      title: enabled ? 'Alarm Enabled' : 'Alarm Disabled',
      description: enabled ? 'Alarm has been turned on.' : 'Alarm has been turned off.',
    });
  };

  const toggleDay = (day: string) => {
    if (editingAlarm) {
      const updatedDays = editingAlarm.days.includes(day)
        ? editingAlarm.days.filter(d => d !== day)
        : [...editingAlarm.days, day];
      
      setEditingAlarm({
        ...editingAlarm,
        days: updatedDays,
      });
    } else {
      const updatedDays = newAlarm.days.includes(day)
        ? newAlarm.days.filter(d => d !== day)
        : [...newAlarm.days, day];
      
      setNewAlarm({
        ...newAlarm,
        days: updatedDays,
      });
    }
  };

  const getVolumeIcon = (volume: string) => {
    switch (volume) {
      case 'high':
        return <Volume2 className="h-4 w-4" />;
      case 'medium':
        return <Volume1 className="h-4 w-4" />;
      case 'low':
        return <Volume1 className="h-4 w-4 text-gray-400" />;
      case 'muted':
        return <VolumeX className="h-4 w-4 text-gray-400" />;
      default:
        return <Volume1 className="h-4 w-4" />;
    }
  };

  const getLinkedToBadge = (linkedTo: string) => {
    switch (linkedTo) {
      case 'medication':
        return <Badge className="bg-eldercare-blue">Medication</Badge>;
      case 'meal':
        return <Badge className="bg-eldercare-purple">Meal</Badge>;
      case 'exercise':
        return <Badge className="bg-eldercare-green">Exercise</Badge>;
      default:
        return <Badge variant="outline">Custom</Badge>;
    }
  };

  const sortedAlarms = [...alarms].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Alarms</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingAlarm(null)}>
              <Plus className="w-4 h-4 mr-2" /> Add Alarm
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAlarm ? 'Edit Alarm' : 'Add New Alarm'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={editingAlarm ? editingAlarm.time : newAlarm.time}
                  onChange={(e) => {
                    if (editingAlarm) {
                      setEditingAlarm({ ...editingAlarm, time: e.target.value });
                    } else {
                      setNewAlarm({ ...newAlarm, time: e.target.value });
                    }
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="label">Label</Label>
                <Input
                  id="label"
                  value={editingAlarm ? editingAlarm.label : newAlarm.label}
                  onChange={(e) => {
                    if (editingAlarm) {
                      setEditingAlarm({ ...editingAlarm, label: e.target.value });
                    } else {
                      setNewAlarm({ ...newAlarm, label: e.target.value });
                    }
                  }}
                  placeholder="Enter alarm label"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Days</Label>
                <div className="flex justify-between">
                  {weekdays.map(day => (
                    <Button
                      key={day.value}
                      type="button"
                      variant="outline"
                      className={`w-9 h-9 p-0 ${
                        (editingAlarm ? editingAlarm.days : newAlarm.days).includes(day.value)
                          ? 'bg-eldercare-blue text-white'
                          : ''
                      }`}
                      onClick={() => toggleDay(day.value)}
                    >
                      {day.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Select
                  value={editingAlarm ? editingAlarm.volume : newAlarm.volume}
                  onValueChange={(value: 'low' | 'medium' | 'high' | 'muted') => {
                    if (editingAlarm) {
                      setEditingAlarm({ ...editingAlarm, volume: value });
                    } else {
                      setNewAlarm({ ...newAlarm, volume: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="muted">Muted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="linkedTo">Link To</Label>
                <Select
                  value={editingAlarm ? editingAlarm.linkedTo : newAlarm.linkedTo}
                  onValueChange={(value: 'medication' | 'meal' | 'exercise' | 'custom') => {
                    if (editingAlarm) {
                      setEditingAlarm({ ...editingAlarm, linkedTo: value });
                    } else {
                      setNewAlarm({ ...newAlarm, linkedTo: value });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medication">Medication</SelectItem>
                    <SelectItem value="meal">Meal</SelectItem>
                    <SelectItem value="exercise">Exercise</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enabled">Enabled</Label>
                <Switch
                  id="enabled"
                  checked={editingAlarm ? editingAlarm.enabled : newAlarm.enabled}
                  onCheckedChange={(checked) => {
                    if (editingAlarm) {
                      setEditingAlarm({ ...editingAlarm, enabled: checked });
                    } else {
                      setNewAlarm({ ...newAlarm, enabled: checked });
                    }
                  }}
                />
              </div>
              
              <div className="flex justify-end pt-4">
                <Button
                  onClick={editingAlarm ? handleEditAlarm : handleAddAlarm}
                  disabled={
                    editingAlarm 
                      ? !editingAlarm.time || !editingAlarm.label
                      : !newAlarm.time || !newAlarm.label
                  }
                >
                  {editingAlarm ? 'Update' : 'Add'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Alarms</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedAlarms.length > 0 ? (
            <div className="space-y-3">
              {sortedAlarms.map(alarm => (
                <div key={alarm.id} className={`flex items-center p-4 border rounded-md ${alarm.enabled ? '' : 'bg-gray-50'}`}>
                  <div className="flex-1 flex items-center">
                    <Clock className="w-5 h-5 mr-3 text-eldercare-blue" />
                    <div>
                      <div className="flex items-center">
                        <p className="font-semibold">{alarm.time}</p>
                        <span className="ml-2">{getLinkedToBadge(alarm.linkedTo)}</span>
                      </div>
                      <p>{alarm.label}</p>
                      <p className="text-xs text-gray-500">
                        {alarm.days.map((day, i) => weekdays.find(d => d.value === day)?.label).join(', ')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      title={`Volume: ${alarm.volume}`}
                    >
                      {getVolumeIcon(alarm.volume)}
                    </Button>
                    
                    <Switch
                      checked={alarm.enabled}
                      onCheckedChange={(checked) => toggleAlarm(alarm.id, checked)}
                    />
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => {
                        setEditingAlarm(alarm);
                        setDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleDeleteAlarm(alarm.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <Bell className="h-10 w-10 mx-auto mb-2 text-gray-300" />
              <p>No alarms set</p>
              <Button 
                variant="link" 
                onClick={() => setDialogOpen(true)}
                className="mt-2"
              >
                Add your first alarm
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Alarms;

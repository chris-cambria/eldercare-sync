
import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Trash, 
  Plus, 
  Edit,
  Pill,
  CalendarCheck, 
  Dumbbell
} from 'lucide-react';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Schedule item type definition
type ScheduleItem = {
  id: string;
  type: 'medication' | 'meal' | 'exercise';
  name: string;
  time: string;
  date: Date;
};

const Schedules = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
    {
      id: '1',
      type: 'medication',
      name: 'Blood Pressure Medication',
      time: '08:00',
      date: new Date(),
    },
    {
      id: '2',
      type: 'meal',
      name: 'Breakfast',
      time: '09:00',
      date: new Date(),
    },
    {
      id: '3',
      type: 'exercise',
      name: 'Morning Walk',
      time: '10:00',
      date: new Date(),
    },
    {
      id: '4',
      type: 'medication',
      name: 'Vitamin Supplement',
      time: '12:00',
      date: new Date(),
    },
    {
      id: '5',
      type: 'meal',
      name: 'Lunch',
      time: '13:00',
      date: new Date(),
    },
  ]);
  
  const [newItem, setNewItem] = useState<Omit<ScheduleItem, 'id'>>({
    type: 'medication',
    name: '',
    time: '',
    date: new Date(),
  });
  
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (!newItem.name || !newItem.time) {
      toast({
        title: 'Error',
        description: 'Please fill out all fields',
        variant: 'destructive',
      });
      return;
    }

    const itemToAdd = {
      ...newItem,
      id: Math.random().toString(36).substr(2, 9),
      date: date,
    };
    
    setScheduleItems([...scheduleItems, itemToAdd]);
    setNewItem({
      type: 'medication',
      name: '',
      time: '',
      date: new Date(),
    });
    
    setDialogOpen(false);
    
    toast({
      title: 'Success',
      description: `${newItem.type} schedule has been added.`,
    });
  };

  const handleEditItem = () => {
    if (editingItem && (editingItem.name && editingItem.time)) {
      setScheduleItems(
        scheduleItems.map(item => 
          item.id === editingItem.id ? editingItem : item
        )
      );
      
      setEditingItem(null);
      setDialogOpen(false);
      
      toast({
        title: 'Updated',
        description: `${editingItem.type} schedule has been updated.`,
      });
    }
  };

  const handleDeleteItem = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
    
    toast({
      title: 'Deleted',
      description: 'Schedule item has been removed.',
    });
  };

  const filterItemsByDate = (items: ScheduleItem[], date: Date) => {
    return items.filter(item => 
      item.date.toDateString() === date.toDateString()
    );
  };

  const filteredItems = filterItemsByDate(scheduleItems, date);
  
  const sortedItems = [...filteredItems].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Schedules</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        <Card className="md:w-80 flex-shrink-0 h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Date</CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
        
        <div className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              {format(date, 'EEEE, MMMM do, yyyy')}
            </h2>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => setEditingItem(null)}>
                  <Plus className="w-4 h-4 mr-2" /> Add Schedule
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingItem ? 'Edit Schedule' : 'Add New Schedule'}
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={editingItem ? editingItem.type : newItem.type}
                      onValueChange={(value: 'medication' | 'meal' | 'exercise') => {
                        if (editingItem) {
                          setEditingItem({ ...editingItem, type: value });
                        } else {
                          setNewItem({ ...newItem, type: value });
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
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editingItem ? editingItem.name : newItem.name}
                      onChange={(e) => {
                        if (editingItem) {
                          setEditingItem({ ...editingItem, name: e.target.value });
                        } else {
                          setNewItem({ ...newItem, name: e.target.value });
                        }
                      }}
                      placeholder="Enter name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={editingItem ? editingItem.time : newItem.time}
                      onChange={(e) => {
                        if (editingItem) {
                          setEditingItem({ ...editingItem, time: e.target.value });
                        } else {
                          setNewItem({ ...newItem, time: e.target.value });
                        }
                      }}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editingItem 
                            ? format(editingItem.date, 'PPP')
                            : format(newItem.date, 'PPP')}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={editingItem ? editingItem.date : newItem.date}
                          onSelect={(newDate) => {
                            if (!newDate) return;
                            if (editingItem) {
                              setEditingItem({ ...editingItem, date: newDate });
                            } else {
                              setNewItem({ ...newItem, date: newDate });
                            }
                          }}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button
                      onClick={editingItem ? handleEditItem : handleAddItem}
                      disabled={
                        editingItem 
                          ? !editingItem.name || !editingItem.time
                          : !newItem.name || !newItem.time
                      }
                    >
                      {editingItem ? 'Update' : 'Add'}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="medication">Medication</TabsTrigger>
              <TabsTrigger value="meal">Meals</TabsTrigger>
              <TabsTrigger value="exercise">Exercise</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              {sortedItems.length > 0 ? (
                <div className="space-y-3">
                  {sortedItems.map(item => (
                    <div key={item.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                      {item.type === 'medication' && <Pill className="w-5 h-5 mr-3 text-eldercare-blue" />}
                      {item.type === 'meal' && <CalendarCheck className="w-5 h-5 mr-3 text-eldercare-purple" />}
                      {item.type === 'exercise' && <Dumbbell className="w-5 h-5 mr-3 text-eldercare-green" />}
                      
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.time.substring(0, 5)} • {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => {
                            setEditingItem(item);
                            setDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          onClick={() => handleDeleteItem(item.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No schedule items for this date</p>
                  <Button 
                    variant="link" 
                    onClick={() => setDialogOpen(true)}
                    className="mt-2"
                  >
                    Add your first schedule
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="medication" className="mt-0">
              {sortedItems.filter(item => item.type === 'medication').length > 0 ? (
                <div className="space-y-3">
                  {sortedItems
                    .filter(item => item.type === 'medication')
                    .map(item => (
                      <div key={item.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                        <Pill className="w-5 h-5 mr-3 text-eldercare-blue" />
                        
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.time.substring(0, 5)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingItem(item);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No medication schedules for this date</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setNewItem({...newItem, type: 'medication'});
                      setDialogOpen(true);
                    }}
                    className="mt-2"
                  >
                    Add medication schedule
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="meal" className="mt-0">
              {sortedItems.filter(item => item.type === 'meal').length > 0 ? (
                <div className="space-y-3">
                  {sortedItems
                    .filter(item => item.type === 'meal')
                    .map(item => (
                      <div key={item.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                        <CalendarCheck className="w-5 h-5 mr-3 text-eldercare-purple" />
                        
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.time.substring(0, 5)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingItem(item);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No meal schedules for this date</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setNewItem({...newItem, type: 'meal'});
                      setDialogOpen(true);
                    }}
                    className="mt-2"
                  >
                    Add meal schedule
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="exercise" className="mt-0">
              {sortedItems.filter(item => item.type === 'exercise').length > 0 ? (
                <div className="space-y-3">
                  {sortedItems
                    .filter(item => item.type === 'exercise')
                    .map(item => (
                      <div key={item.id} className="flex items-center p-3 border rounded-md hover:bg-gray-50">
                        <Dumbbell className="w-5 h-5 mr-3 text-eldercare-green" />
                        
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">{item.time.substring(0, 5)}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => {
                              setEditingItem(item);
                              setDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteItem(item.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-10 text-gray-500">
                  <p>No exercise schedules for this date</p>
                  <Button 
                    variant="link" 
                    onClick={() => {
                      setNewItem({...newItem, type: 'exercise'});
                      setDialogOpen(true);
                    }}
                    className="mt-2"
                  >
                    Add exercise schedule
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Schedules;

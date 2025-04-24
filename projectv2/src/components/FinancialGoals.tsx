import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Target, DollarSign, Home, GraduationCap } from 'lucide-react';

interface Goal {
  id: string;
  type: 'savings' | 'investment' | 'debt' | 'other';
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
  priority: 'high' | 'medium' | 'low';
}

const defaultGoals: Goal[] = [
  {
    id: '1',
    type: 'savings',
    name: 'Emergency Fund',
    targetAmount: 10000,
    currentAmount: 0,
    priority: 'high'
  },
  {
    id: '2',
    type: 'investment',
    name: 'Retirement',
    targetAmount: 1000000,
    currentAmount: 0,
    priority: 'high'
  }
];

const FinancialGoals = () => {
  const [goals, setGoals] = useState<Goal[]>(defaultGoals);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    type: 'savings',
    priority: 'medium'
  });

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'savings':
        return <DollarSign className="h-5 w-5" />;
      case 'investment':
        return <Target className="h-5 w-5" />;
      case 'debt':
        return <Home className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-red-500';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount) {
      const goal: Goal = {
        id: Date.now().toString(),
        type: newGoal.type as Goal['type'],
        name: newGoal.name,
        targetAmount: newGoal.targetAmount,
        currentAmount: 0,
        priority: newGoal.priority as Goal['priority'],
        deadline: newGoal.deadline
      };
      setGoals([...goals, goal]);
      setIsAddingGoal(false);
      setNewGoal({ type: 'savings', priority: 'medium' });
    }
  };

  return (
    <Card className="p-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Financial Goals</CardTitle>
        <Dialog open={isAddingGoal} onOpenChange={setIsAddingGoal}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Financial Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Goal Name</Label>
                <Input
                  value={newGoal.name || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  placeholder="e.g., Emergency Fund"
                />
              </div>
              <div className="space-y-2">
                <Label>Target Amount</Label>
                <Input
                  type="number"
                  value={newGoal.targetAmount || ''}
                  onChange={(e) => setNewGoal({ ...newGoal, targetAmount: Number(e.target.value) })}
                  placeholder="e.g., 10000"
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal({ ...newGoal, priority: e.target.value as Goal['priority'] })}
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <select
                  className="w-full p-2 border rounded"
                  value={newGoal.type}
                  onChange={(e) => setNewGoal({ ...newGoal, type: e.target.value as Goal['type'] })}
                >
                  <option value="savings">Savings</option>
                  <option value="investment">Investment</option>
                  <option value="debt">Debt Reduction</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <Button onClick={handleAddGoal}>Add Goal</Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className={getPriorityColor(goal.priority)}>
                    {getGoalIcon(goal.type)}
                  </div>
                  <div>
                    <h3 className="font-medium">{goal.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{goal.type} • {goal.priority} priority</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(goal.currentAmount)}</div>
                  <div className="text-sm text-muted-foreground">of {new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                  }).format(goal.targetAmount)}</div>
                </div>
              </div>
              <Progress
                value={(goal.currentAmount / goal.targetAmount) * 100}
                className="h-2"
              />
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialGoals; 
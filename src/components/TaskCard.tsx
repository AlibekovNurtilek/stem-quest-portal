import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface Task {
  id: number;
  problem: string;
  answer: string;
  difficulty: number;
}

interface TaskCardProps {
  task: Task;
  index: number;
}

const getDifficultyColor = (difficulty: number) => {
  if (difficulty <= 2) return 'bg-green-100 text-green-800 border-green-200';
  if (difficulty <= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
  if (difficulty <= 6) return 'bg-orange-100 text-orange-800 border-orange-200';
  return 'bg-red-100 text-red-800 border-red-200';
};

const getDifficultyText = (difficulty: number) => {
  if (difficulty <= 2) return 'Жеңил';
  if (difficulty <= 4) return 'Орточо';
  if (difficulty <= 6) return 'Кыйын';
  return 'Өтө кыйын';
};

const TaskCard = ({ task, index }: TaskCardProps) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card 
      className="p-6 hover:shadow-card transition-smooth gradient-card border-0 animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center">
            <span className="text-white font-semibold text-sm">{task.id}</span>
          </div>
          <Badge className={`${getDifficultyColor(task.difficulty)} border`}>
            {getDifficultyText(task.difficulty)} • Деңгээл {task.difficulty}
          </Badge>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground mb-2">Маселе:</h3>
        <div className="bg-muted/50 rounded-lg p-4 border">
          <code className="text-lg font-mono text-primary">{task.problem}</code>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          variant={showAnswer ? "secondary" : "default"}
          onClick={() => setShowAnswer(!showAnswer)}
          className={`w-full transition-smooth ${
            showAnswer 
              ? '' 
              : 'gradient-primary hover:shadow-glow text-white'
          }`}
        >
          {showAnswer ? 'Жоопту жашыруу' : 'Жоопту көрсөтүү'}
        </Button>

        {showAnswer && (
          <div className="animate-slide-up">
            <h4 className="text-md font-semibold text-success mb-2">Жооп:</h4>
            <div className="bg-success/10 rounded-lg p-4 border border-success/20">
              <code className="text-lg font-mono text-success font-semibold">{task.answer}</code>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
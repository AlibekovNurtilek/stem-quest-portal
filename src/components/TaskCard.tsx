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

// Компонент для отображения дроби
const Fraction = ({ numerator, denominator }: { numerator: string; denominator: string }) => {
  return (
    <span className="inline-flex flex-col items-center mx-1 align-middle" style={{ verticalAlign: 'middle' }}>
      <span className="text-sm leading-none border-b border-current pb-0.5 min-w-[1em] text-center">
        {numerator}
      </span>
      <span className="text-sm leading-none pt-0.5 min-w-[1em] text-center">
        {denominator}
      </span>
    </span>
  );
};

// Функция для парсинга и форматирования математических выражений
const formatMathExpression = (expression: string) => {
  // Улучшенное регулярное выражение:
  // Ищем дроби, но останавливаемся перед скобками, если они идут сразу после знаменателя
  const fractionRegex = /([a-zA-Z0-9\+\-\*\^\s]*(?:\([^)]*\))*[a-zA-Z0-9\+\-\*\^\s]*)\/([a-zA-Z0-9\+\-\*\^\s]+)(?![a-zA-Z0-9\(])|([a-zA-Z0-9\+\-\*\^\s]*(?:\([^)]*\))*[a-zA-Z0-9\+\-\*\^\s]*)\/(\([^)]*\))(?=\s|$|[+\-=])/g;
  
  const parts = [];
  let lastIndex = 0;
  let match;

  // Сначала обработаем простые случаи - числовые дроби перед скобками
  let processedExpression = expression.replace(/(\d+)\/(\d+)(?=\()/g, (match, num, den) => {
    return `[FRACTION:${num}|${den}]`;
  });

  // Затем обработаем остальные дроби
  processedExpression = processedExpression.replace(/([^\/\s\+\-\*=]+(?:\([^)]*\))?[^\/\s\+\-\*=]*|[^\/\s\+\-\*=]*\([^)]*\)[^\/\s\+\-\*=]*|[a-zA-Z0-9]+)\/([^\/\s\+\-\*=]+(?:\([^)]*\))?[^\/\s\+\-\*=]*|[^\/\s\+\-\*=]*\([^)]*\)[^\/\s\+\-\*=]*|[a-zA-Z0-9]+)(?=\s|$|[+\-=])/g, (match, num, den) => {
    return `[FRACTION:${num}|${den}]`;
  });

  // Теперь разбираем строку и заменяем маркеры на компоненты
  const tokens = processedExpression.split(/(\[FRACTION:[^\]]+\])/);
  
  tokens.forEach((token, index) => {
    if (token.startsWith('[FRACTION:')) {
      // Это дробь
      const content = token.slice(10, -1); // Убираем [FRACTION: и ]
      const [numerator, denominator] = content.split('|');
      
      let cleanNumerator = numerator.trim();
      let cleanDenominator = denominator.trim();
      
      // Убираем внешние скобки только если они охватывают всё выражение
      if (cleanNumerator.startsWith('(') && cleanNumerator.endsWith(')') && isBalancedParentheses(cleanNumerator)) {
        cleanNumerator = cleanNumerator.slice(1, -1);
      }
      if (cleanDenominator.startsWith('(') && cleanDenominator.endsWith(')') && isBalancedParentheses(cleanDenominator)) {
        cleanDenominator = cleanDenominator.slice(1, -1);
      }

      parts.push(
        <Fraction
          key={`fraction-${index}`}
          numerator={cleanNumerator}
          denominator={cleanDenominator}
        />
      );
    } else if (token.trim()) {
      // Это обычный текст
      parts.push(
        <span key={`text-${index}`}>
          {token}
        </span>
      );
    }
  });

  return parts.length > 0 ? parts : [<span key="original">{expression}</span>];
};

// Вспомогательная функция для проверки сбалансированности скобок
const isBalancedParentheses = (str: string): boolean => {
  let count = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') count++;
    if (str[i] === ')') count--;
    if (count < 0) return false;
  }
  return count === 0;
};

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
    <>
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
            <div className="text-lg font-mono text-primary">
              {formatMathExpression(task.problem)}
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          {/* <Button 
            variant={showAnswer ? "secondary" : "default"}
            onClick={() => setShowAnswer(!showAnswer)}
            className={`w-full transition-smooth ${
              showAnswer 
                ? '' 
                : 'gradient-primary hover:shadow-glow text-white'
            }`}
          >
            {showAnswer ? 'Жоопту жашыруу' : 'Жоопту көрсөтүү'}
          </Button> */}
          
          {showAnswer && (
            <div className="animate-slide-up">
              <h4 className="text-md font-semibold text-success mb-2">Жооп:</h4>
              <div className="bg-success/10 rounded-lg p-4 border border-success/20">
                <div className="text-lg font-mono text-success font-semibold">
                  {formatMathExpression(task.answer)}
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        
        .animate-slide-up {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default TaskCard;
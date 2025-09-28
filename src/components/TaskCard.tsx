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
    <span
      className="inline-flex flex-col items-center mx-1 align-middle"
      style={{ verticalAlign: 'middle' }}
    >
      <span className="text-sm leading-none border-b border-current pb-0.5 min-w-[1em] text-center">
        {numerator}
      </span>
      <span className="text-sm leading-none pt-0.5 min-w-[1em] text-center">
        {denominator}
      </span>
    </span>
  );
};

// Функция для разделения текста задачи и математического выражения
const parseTaskProblem = (problem: string) => {
  if (!problem || !problem.trim()) {
    return { taskText: '', mathExpression: '' };
  }

  // Ищем двоеточие как разделитель
  const colonIndex = problem.indexOf(':');
  
  if (colonIndex !== -1) {
    const taskText = problem.substring(0, colonIndex + 1).trim();
    const mathExpression = problem.substring(colonIndex + 1).trim();
    return { taskText, mathExpression };
  }
  
  // Если двоеточия нет, всё считаем математическим выражением
  return { taskText: '', mathExpression: problem.trim() };
};

// Функция для поиска сбалансированного выражения в скобках
const findMatchingParentheses = (str: string, startIndex: number): number => {
  let count = 0;
  for (let i = startIndex; i < str.length; i++) {
    if (str[i] === '(') count++;
    if (str[i] === ')') count--;
    if (count === 0) return i;
  }
  return -1;
};

// Функция для парсинга и форматирования математических выражений
const formatMathExpression = (expression: string) => {
  let processedExpression = expression;
  const fractions: { placeholder: string; numerator: string; denominator: string }[] = [];
  let fractionCounter = 0;

  // Функция для создания уникального плейсхолдера
  const createPlaceholder = (num: string, den: string): string => {
    const placeholder = `__FRACTION_${fractionCounter++}__`;
    fractions.push({ placeholder, numerator: num, denominator: den });
    return placeholder;
  };

  // Этап 1: Находим все дроби, используя более точный алгоритм
  let i = 0;
  let result = '';
  
  while (i < processedExpression.length) {
    const char = processedExpression[i];
    
    // Ищем символ '/'
    if (char === '/') {
      // Найдем начало числителя (движемся назад)
      let numStart = i - 1;
      let numEnd = i - 1;
      
      // Если перед '/' есть ')', найдем соответствующую '('
      if (processedExpression[numEnd] === ')') {
        let parenCount = 1;
        numStart = numEnd - 1;
        while (numStart >= 0 && parenCount > 0) {
          if (processedExpression[numStart] === ')') parenCount++;
          if (processedExpression[numStart] === '(') parenCount--;
          if (parenCount > 0) numStart--;
        }
      } else {
        // Найдем начало числителя (буквы, цифры, пробелы)
        while (numStart >= 0 && /[a-zA-Z0-9\s]/.test(processedExpression[numStart])) {
          numStart--;
        }
        numStart++;
      }
      
      // Найдем конец знаменателя (движемся вперед)
      let denStart = i + 1;
      let denEnd = denStart;
      
      // Если после '/' есть '(', найдем соответствующую ')'
      if (processedExpression[denStart] === '(') {
        denEnd = findMatchingParentheses(processedExpression, denStart);
        if (denEnd === -1) denEnd = denStart;
      } else {
        // Найдем конец знаменателя (буквы, цифры, пробелы)
        while (denEnd < processedExpression.length && /[a-zA-Z0-9\s]/.test(processedExpression[denEnd])) {
          denEnd++;
        }
        denEnd--;
      }
      
      // Извлекаем числитель и знаменатель
      const numerator = processedExpression.substring(numStart, numEnd + 1).trim();
      const denominator = processedExpression.substring(denStart, denEnd + 1).trim();
      
      // Проверяем, что у нас есть и числитель, и знаменатель
      if (numerator && denominator) {
        // Добавляем часть до дроби
        result += processedExpression.substring(0, numStart);
        
        // Создаем плейсхолдер для дроби
        const placeholder = createPlaceholder(numerator, denominator);
        result += placeholder;
        
        // Продолжаем с остатком строки
        processedExpression = processedExpression.substring(denEnd + 1);
        i = 0;
        continue;
      }
    }
    
    i++;
  }
  
  // Добавляем оставшуюся часть
  result += processedExpression;
  processedExpression = result;

  // Этап 2: Заменяем плейсхолдеры на компоненты React
  const parts = [];
  let currentIndex = 0;
  
  // Сортируем дроби по порядку появления в строке
  const sortedFractions = fractions.sort((a, b) => 
    processedExpression.indexOf(a.placeholder) - processedExpression.indexOf(b.placeholder)
  );
  
  for (const fraction of sortedFractions) {
    const placeholderIndex = processedExpression.indexOf(fraction.placeholder, currentIndex);
    
    if (placeholderIndex > currentIndex) {
      // Добавляем текст перед дробью
      const textBefore = processedExpression.substring(currentIndex, placeholderIndex);
      if (textBefore) {
        parts.push(<span key={`text-${parts.length}`}>{textBefore}</span>);
      }
    }
    
    // Очищаем числитель и знаменатель от лишних скобок
    let cleanNumerator = fraction.numerator;
    let cleanDenominator = fraction.denominator;
    
    if (
      cleanNumerator.startsWith('(') &&
      cleanNumerator.endsWith(')') &&
      isBalancedParentheses(cleanNumerator)
    ) {
      cleanNumerator = cleanNumerator.slice(1, -1);
    }
    if (
      cleanDenominator.startsWith('(') &&
      cleanDenominator.endsWith(')') &&
      isBalancedParentheses(cleanDenominator)
    ) {
      cleanDenominator = cleanDenominator.slice(1, -1);
    }
    
    // Добавляем компонент дроби
    parts.push(
      <Fraction
        key={`fraction-${parts.length}`}
        numerator={cleanNumerator}
        denominator={cleanDenominator}
      />
    );
    
    currentIndex = placeholderIndex + fraction.placeholder.length;
  }
  
  // Добавляем оставшийся текст
  if (currentIndex < processedExpression.length) {
    const remainingText = processedExpression.substring(currentIndex);
    if (remainingText) {
      parts.push(<span key={`text-${parts.length}`}>{remainingText}</span>);
    }
  }

  return parts.length > 0 ? parts : [<span key="original">{expression}</span>];
};

// Проверка сбалансированности скобок
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
  
  // Разбираем задачу на текст и математическое выражение
  const { taskText, mathExpression } = parseTaskProblem(task.problem);

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
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {taskText || 'Маселе:'}
          </h3>
          <div className="bg-muted/50 rounded-lg p-4 border">
            <div className="text-lg font-mono text-primary">
              {mathExpression ? formatMathExpression(mathExpression) : 'Маселе'}
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
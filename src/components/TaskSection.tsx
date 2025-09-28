import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import TaskCard from './TaskCard';

interface Task {
  id: number;
  problem: string;
  answer: string;
  difficulty: number;
}

interface TaskSectionProps {
  title: string;
  tasks: Task[];
}

const TASKS_PER_PAGE = 6;

const TaskSection = ({ title, tasks }: TaskSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all');

  const filteredTasks = tasks.filter(task => 
    difficultyFilter === 'all' || task.difficulty.toString() === difficultyFilter
  );

  const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE);
  const startIndex = (currentPage - 1) * TASKS_PER_PAGE;
  const endIndex = startIndex + TASKS_PER_PAGE;
  const currentTasks = filteredTasks.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (value: string) => {
    setDifficultyFilter(value);
    setCurrentPage(1);
  };

  const getSectionIcon = (title: string) => {
    if (title.includes('Линейные')) return '📐';
    if (title.includes('дроби')) return '🔢';
    if (title.includes('Скобки')) return '📊';
    if (title.includes('Логарифмы')) return '📈';
    return '📚';
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <span className="text-4xl animate-float">{getSectionIcon(title)}</span>
          <h2 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            {title}
          </h2>
        </div>
        <p className="text-muted-foreground">
          Всего задач: {tasks.length} | Отфильтровано: {filteredTasks.length}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <Select value={difficultyFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Фильтр по уровню сложности" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все уровни</SelectItem>
            <SelectItem value="1">Уровень 1-2 (Легкий)</SelectItem>
            <SelectItem value="3">Уровень 3-4 (Средний)</SelectItem>
            <SelectItem value="5">Уровень 5-6 (Сложный)</SelectItem>
            <SelectItem value="7">Уровень 7+ (Очень сложный)</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">
          Страница {currentPage} из {totalPages}
        </div>
      </div>

      {currentTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Нет задач для выбранного уровня сложности
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {currentTasks.map((task, index) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                index={index}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="min-w-20"
              >
                Назад
              </Button>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={page === currentPage ? "default" : "outline"}
                  onClick={() => handlePageChange(page)}
                  className={`min-w-12 ${
                    page === currentPage 
                      ? 'gradient-primary text-white' 
                      : ''
                  }`}
                >
                  {page}
                </Button>
              ))}
              
              <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="min-w-20"
              >
                Вперед
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default TaskSection;
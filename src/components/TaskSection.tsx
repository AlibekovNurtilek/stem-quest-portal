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

const TASKS_PER_PAGE = 10;

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
    if (title.includes('Сызыктуу') || title.includes('теңдемелер')) return '📐';
    if (title.includes('Бөлчөктөрдү') || title.includes('жөнөкөйлөштүрүү')) return '🔢';
    if (title.includes('Кашалар') || title.includes('операциялар')) return '📊';
    if (title.includes('Логарифмдер')) return '📈';
    return '📚';
  };

  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <h2 className="text-lg md:text-2xl font-bold flex items-center gap-3">
            {title}
          </h2>
        </div>
        <p className="text-muted-foreground">
          Жалпы тапшырмалар: {tasks.length} | Фильтрленген: {filteredTasks.length}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-between">
        <Select value={difficultyFilter} onValueChange={handleFilterChange}>
          <SelectTrigger className="w-full sm:w-64">
            <SelectValue placeholder="Кыйынчылык деңгээли боюнча фильтр" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бардык деңгээлдер</SelectItem>
            <SelectItem value="1">Деңгээл 1-2 (Жеңил)</SelectItem>
            <SelectItem value="3">Деңгээл 3-4 (Орточо)</SelectItem>
            <SelectItem value="5">Деңгээл 5-6 (Кыйын)</SelectItem>
            <SelectItem value="7">Деңгээл 7+ (Өтө кыйын)</SelectItem>
          </SelectContent>
        </Select>

        <div className="text-sm text-muted-foreground">
          Барак {currentPage} / {totalPages}
        </div>
      </div>

      {currentTasks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            Тандалган кыйынчылык деңгээли үчүн тапшырмалар жок
          </p>
        </div>
      ) : (
        <>
          {/* Fixed grid layout for consistent card widths */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 auto-rows-fr">
            {currentTasks.map((task, index) => (
              <div key={task.id} className="w-full">
                <TaskCard 
                  task={task} 
                  index={index}
                />
              </div>
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
                Артка
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
                Алдыга
              </Button>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default TaskSection;
import { useState, useEffect } from 'react';
import LoadingScreen from '@/components/LoadingScreen';
import TaskSection from '@/components/TaskSection';
import { Button } from '@/components/ui/button';
import tasksData from '@/data/tasks.json';

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>('linear_equations');

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  const sections = [
    {
      id: 'linear_equations',
      title: 'Сызыктуу теңдемелер',
      tasks: tasksData.math_tasks.linear_equations
    },
    {
      id: 'fraction_simplification', 
      title: 'Бөлчөктөрдү жөнөкөйлөштүрүү',
      tasks: tasksData.math_tasks.fraction_simplification
    },
    {
      id: 'brackets_operations',
      title: 'Кашалар менен операциялар', 
      tasks: tasksData.math_tasks.brackets_operations
    },
    {
      id: 'logarithms',
      title: 'Логарифмдер',
      tasks: tasksData.math_tasks.logarithms
    }
  ];

  const totalTasks = sections.reduce((sum, section) => sum + section.tasks.length, 0);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="gradient-hero text-white py-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-700/20" />
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center animate-slide-up">
            <div className="inline-flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-glow">
                <span className="text-3xl">🎓</span>
              </div>
              <div>
                <h1 className="text-4xl md:text-6xl font-bold mb-2">
                  STEM Математика
                </h1>
                <p className="text-xl opacity-90">
                  STEM программасынын окуучулары үчүн тесттер
                </p>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
              <p className="text-lg mb-2">
                <strong>Мугалим:</strong> Алибеков Нүртилек
              </p>
              <p className="text-white/90">
                Жалпы тапшырмалар: <span className="font-semibold">{totalTasks}</span> • 
                Экзамендерде ийгилик! 🌟
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-card shadow-soft sticky top-0 z-40 border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {sections.map((section) => (
              <Button
                key={section.id}
                variant={activeSection === section.id ? 'default' : 'outline'}
                onClick={() => setActiveSection(section.id)}
                className={activeSection === section.id ? 'gradient-primary text-white' : ''}
              >
                {section.title} ({section.tasks.length})
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="container mx-auto px-6 py-12">
        <div className="animate-fade-in-up">
          <TaskSection
            title={sections.find(s => s.id === activeSection)?.title || ''}
            tasks={sections.find(s => s.id === activeSection)?.tasks || []}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-muted/50 text-center py-8 mt-16">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-2xl animate-float">🎯</span>
            <p className="text-muted-foreground">
              STEM программасы үчүн математикалык маселелер
            </p>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 Алибеков Нүртилек • Математиканы үйрөнүүдө ийгилик!
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

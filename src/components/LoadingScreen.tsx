import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen = ({ onComplete }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setShowWelcome(true);
          setTimeout(() => {
            onComplete();
          }, 2000);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center gradient-hero">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20 animate-pulse" />
      
      <div className="relative z-10 text-center px-8">
        {!showWelcome ? (
          <div className="animate-slide-up">
            <div className="mb-8">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-white flex items-center justify-center">
                  <span className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">∑</span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-glow">
                STEM Математика
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Загрузка задач...
              </p>
            </div>
            
            <div className="w-full max-w-md mx-auto">
              <div className="bg-white/20 rounded-full h-4 overflow-hidden backdrop-blur-sm">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-white/80 mt-2">{progress}%</p>
            </div>
          </div>
        ) : (
          <div className="animate-fade-in-up">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Добро пожаловать!
            </h2>
            <p className="text-xl text-white/90 mb-4">
              Учитель: <span className="font-semibold">Алибеков Нуртилек</span>
            </p>
            <p className="text-lg text-white/80">
              Желаю удачи всем ученикам программы STEM! 🌟
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
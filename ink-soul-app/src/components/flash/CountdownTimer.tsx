import { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

interface CountdownTimerProps {
  targetDate: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const { t } = useLanguage();
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft | null => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    };

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    setTimeLeft(calculateTimeLeft());

    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return null;
  }

  return (
    <div className="flex items-center justify-center flex-wrap gap-xs">
      <div className="flex flex-col items-center bg-background-elevated border border-border-gold rounded px-2 py-1 min-w-[45px] countdown-segment">
        <span className="text-lg font-display text-accent-gold font-bold countdown-box">
          {timeLeft.days.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-text-tertiary uppercase countdown-label">
          {t('flash.countdown.days')}
        </span>
      </div>
      <span className="text-accent-gold text-lg countdown-separator">:</span>
      <div className="flex flex-col items-center bg-background-elevated border border-border-gold rounded px-2 py-1 min-w-[45px] countdown-segment">
        <span className="text-lg font-display text-accent-gold font-bold countdown-box">
          {timeLeft.hours.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-text-tertiary uppercase countdown-label">
          {t('flash.countdown.hours')}
        </span>
      </div>
      <span className="text-accent-gold text-lg countdown-separator">:</span>
      <div className="flex flex-col items-center bg-background-elevated border border-border-gold rounded px-2 py-1 min-w-[45px] countdown-segment">
        <span className="text-lg font-display text-accent-gold font-bold countdown-box">
          {timeLeft.minutes.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-text-tertiary uppercase countdown-label">
          {t('flash.countdown.minutes')}
        </span>
      </div>
      <span className="text-accent-gold text-lg countdown-separator">:</span>
      <div className="flex flex-col items-center bg-background-elevated border border-border-gold rounded px-2 py-1 min-w-[45px] countdown-segment">
        <span className="text-lg font-display text-accent-gold font-bold countdown-box">
          {timeLeft.seconds.toString().padStart(2, '0')}
        </span>
        <span className="text-xs text-text-tertiary uppercase countdown-label">
          {t('flash.countdown.seconds')}
        </span>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { FlashEvent } from '../../types/flash';
import { CountdownTimer } from './CountdownTimer';
import { Calendar, Clock } from 'lucide-react';

interface FlashEventCardProps {
  event: FlashEvent;
}

export function FlashEventCard({ event }: FlashEventCardProps) {
  const { t, language } = useLanguage();
  const title = language === 'es' ? event.title_es : event.title_en;
  const description = language === 'es' ? event.description_es : event.description_en;

  const now = new Date();
  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);
  
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;
  const isPast = now > endDate;

  return (
    <div className="bg-background-elevated border border-border-gold rounded-lg overflow-hidden hover:shadow-glow-gold hover:border-accent-gold transition-all duration-standard group">
      {event.hero_image && (
        <div className="aspect-video overflow-hidden relative">
          <img 
            src={event.hero_image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-standard group-hover:scale-105"
          />
          {isActive && (
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-accent-gold text-background-primary font-semibold text-xs uppercase rounded-full">
                {t('flash.activeEvents')}
              </span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-lg">
        <h3 className="font-display text-2xl text-accent-gold mb-sm">{title}</h3>
        {description && (
          <p className="text-text-secondary text-sm mb-md line-clamp-2">{description}</p>
        )}
        
        <div className="flex items-center gap-md mb-md text-text-tertiary text-xs">
          <div className="flex items-center gap-xs">
            <Calendar size={14} />
            <span>{new Date(event.start_at).toLocaleDateString()}</span>
          </div>
          <span>-</span>
          <div className="flex items-center gap-xs">
            <Clock size={14} />
            <span>{new Date(event.end_at).toLocaleDateString()}</span>
          </div>
        </div>
        
        {isUpcoming && (
          <div className="mb-md">
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-xs">
              {t('flash.countdown.startsIn')}
            </p>
            <CountdownTimer targetDate={event.start_at} />
          </div>
        )}
        
        {isActive && (
          <div className="mb-md">
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-xs">
              {t('flash.countdown.endsIn')}
            </p>
            <CountdownTimer targetDate={event.end_at} />
          </div>
        )}
        
        <Link to={`/flash/${event.slug}`}>
          <button 
            className="w-full px-lg py-3 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold hover:scale-105 transform transition-all duration-standard disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isPast}
          >
            {isPast ? t('flash.countdown.endsIn') : t('flash.viewEvent')}
          </button>
        </Link>
      </div>
    </div>
  );
}

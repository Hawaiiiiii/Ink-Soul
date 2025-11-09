import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { supabase } from '../../lib/supabase';
import { FlashEvent } from '../../types/flash';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HomeFlashBanner() {
  const { t, language } = useLanguage();
  const [activeEvents, setActiveEvents] = useState<FlashEvent[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveEvents();
  }, []);

  const fetchActiveEvents = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flash_events')
        .select('*')
        .eq('is_active', true)
        .lte('start_at', now)
        .gte('end_at', now)
        .order('start_at', { ascending: true })
        .limit(5);

      if (error) throw error;
      setActiveEvents(data || []);
    } catch (err) {
      console.error('Error fetching active events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeEvents.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeEvents.length);
    }, 5000); // Cambiar cada 5 segundos

    return () => clearInterval(interval);
  }, [activeEvents.length]);

  if (loading || activeEvents.length === 0) {
    return null;
  }

  const currentEvent = activeEvents[currentIndex];
  const title = language === 'es' ? currentEvent.title_es : currentEvent.title_en;
  const description = language === 'es' ? currentEvent.description_es : currentEvent.description_en;

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-accent-burgundy/10 via-accent-gold/5 to-accent-burgundy/10">
      <div className="max-w-container-xl mx-auto px-md md:px-lg">
        <div className="relative overflow-hidden rounded-lg border-2 border-accent-gold/30 bg-background-elevated/50 backdrop-blur-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-gold/5 to-transparent" />
          
          <div className="relative p-lg md:p-xl">
            <div className="flex items-center justify-between mb-md">
              <div className="flex items-center gap-2">
                <Sparkles className="text-accent-gold" size={24} />
                <span className="text-accent-gold text-sm font-semibold uppercase tracking-wider">
                  {t('flash.title')}
                </span>
              </div>
              
              {activeEvents.length > 1 && (
                <div className="flex gap-2">
                  {activeEvents.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-standard ${
                        index === currentIndex
                          ? 'bg-accent-gold w-8'
                          : 'bg-border-subtle hover:bg-accent-gold/50'
                      }`}
                      aria-label={`${t('flash.viewEvent')} ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-lg items-center">
              <div>
                <h3 className="font-display text-3xl md:text-4xl text-accent-gold mb-sm">
                  {title}
                </h3>
                <p className="text-text-secondary mb-lg leading-relaxed">
                  {description}
                </p>
                
                <Link to={`/flash/${currentEvent.slug}`}>
                  <button className="group inline-flex items-center gap-2 px-lg py-3 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold hover:scale-105 transform transition-all duration-standard">
                    {t('flash.bookNow')}
                    <ArrowRight 
                      size={18} 
                      className="transition-transform duration-standard group-hover:translate-x-1" 
                    />
                  </button>
                </Link>
              </div>

              {currentEvent.hero_image && (
                <div className="aspect-video rounded-lg overflow-hidden border border-border-gold">
                  <img
                    src={currentEvent.hero_image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

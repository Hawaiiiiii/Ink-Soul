import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlashEvent } from '../types/flash';
import { FlashEventCard } from '../components/flash/FlashEventCard';
import { supabase } from '../lib/supabase';
import { Calendar, Sparkles } from 'lucide-react';

export function FlashEventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<FlashEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flash_events')
        .select('*')
        .eq('is_active', true)
        .gte('end_at', now) // Solo eventos que NO han terminado
        .order('start_at', { ascending: true }); // Ordenar por fecha de inicio

      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading events');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-burgundy/5 to-transparent" />
        
        <div className="max-w-container-xl mx-auto px-md md:px-lg relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-md">
              <Sparkles className="text-accent-gold" size={24} />
              <span className="text-accent-gold text-sm font-semibold uppercase tracking-wider">
                {t('flash.subtitle')}
              </span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl text-accent-gold mb-md">
              {t('flash.title')}
            </h1>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-container-xl mx-auto px-md md:px-lg">
          <div className="flex items-center gap-3 mb-xl">
            <Calendar className="text-accent-gold" size={28} />
            <h2 className="font-display text-3xl text-text-primary">
              {t('flash.activeEvents')}
            </h2>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
              <p className="text-text-secondary mt-md">Cargando eventos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-400">{error}</p>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 mx-auto mb-md bg-background-elevated border border-border-gold rounded-full flex items-center justify-center">
                <Calendar className="text-text-tertiary" size={32} />
              </div>
              <p className="text-text-secondary text-lg">{t('flash.noEvents')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {events.map((event) => (
                <FlashEventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 md:py-24 bg-background-elevated border-y border-border-subtle">
        <div className="max-w-container-lg mx-auto px-md md:px-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-md bg-accent-gold/10 border border-border-gold rounded-full flex items-center justify-center">
                <Sparkles className="text-accent-gold" size={28} />
              </div>
              <h3 className="font-display text-xl text-text-primary mb-sm">
                {t('flash.exclusiveDesigns')}
              </h3>
              <p className="text-text-secondary text-sm">
                {t('flash.exclusiveDescription')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-md bg-accent-gold/10 border border-border-gold rounded-full flex items-center justify-center">
                <Calendar className="text-accent-gold" size={28} />
              </div>
              <h3 className="font-display text-xl text-text-primary mb-sm">
                {t('flash.easyBooking')}
              </h3>
              <p className="text-text-secondary text-sm">
                {t('flash.bookingDescription')}
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-md bg-accent-gold/10 border border-border-gold rounded-full flex items-center justify-center">
                <svg className="text-accent-gold" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z" />
                  <path d="M2 17l10 5 10-5" />
                  <path d="M2 12l10 5 10-5" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-text-primary mb-sm">
                {t('flash.qualityGuaranteed')}
              </h3>
              <p className="text-text-secondary text-sm">
                {t('flash.qualityGuarantee')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

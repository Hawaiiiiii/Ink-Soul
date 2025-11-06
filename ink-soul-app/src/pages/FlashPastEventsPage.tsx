import { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FlashEvent } from '../types/flash';
import { FlashEventCard } from '../components/flash/FlashEventCard';
import { supabase } from '../lib/supabase';
import { Calendar, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export function FlashPastEventsPage() {
  const { t } = useLanguage();
  const [events, setEvents] = useState<FlashEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPastEvents();
  }, []);

  const fetchPastEvents = async () => {
    try {
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('flash_events')
        .select('*')
        .eq('is_active', true)
        .lt('end_at', now) // Eventos que ya terminaron
        .order('start_at', { ascending: false }); // Más recientes primero

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
              <Clock className="text-accent-gold" size={24} />
              <span className="text-accent-gold text-sm font-semibold uppercase tracking-wider">
                {t('flash.pastEvents')}
              </span>
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl text-accent-gold mb-md">
              {t('flash.pastEvents')}
            </h1>
            
            <p className="text-text-secondary text-lg leading-relaxed mb-lg">
              Explora los eventos flash anteriores que marcaron cada temporada.
            </p>

            <Link
              to="/flash"
              className="inline-block px-lg py-3 border-2 border-accent-gold text-accent-gold font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold hover:text-background-primary transition-all duration-standard"
            >
              Ver Eventos Activos
            </Link>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 md:py-24">
        <div className="max-w-container-xl mx-auto px-md md:px-lg">
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-block w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
              <p className="text-text-secondary mt-md">Cargando eventos pasados...</p>
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
              <p className="text-text-secondary text-lg">No hay eventos pasados para mostrar.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
              {events.map((event) => (
                <div key={event.id} className="relative">
                  {/* Badge "Finalizado" */}
                  <div className="absolute top-4 right-4 z-10">
                    <span className="px-3 py-1 bg-text-tertiary/80 text-background-primary text-xs font-semibold uppercase rounded-full">
                      {t('flash.eventExpired')}
                    </span>
                  </div>
                  <FlashEventCard event={event} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

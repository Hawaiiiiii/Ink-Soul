import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { FlashEvent, FlashDesign } from '../types/flash';
import { FlashDesignCard } from '../components/flash/FlashDesignCard';
import { FlashBookingDrawer } from '../components/flash/FlashBookingDrawer';
import { CountdownTimer } from '../components/flash/CountdownTimer';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Calendar, Clock, Info } from 'lucide-react';

export function FlashEventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  
  const [event, setEvent] = useState<FlashEvent | null>(null);
  const [designs, setDesigns] = useState<FlashDesign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDesign, setSelectedDesign] = useState<FlashDesign | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    if (slug) {
      fetchEventAndDesigns();
    }
  }, [slug]);

  const fetchEventAndDesigns = async () => {
    try {
      // Fetch event
      const { data: eventData, error: eventError } = await supabase
        .from('flash_events')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (eventError) throw eventError;
      if (!eventData) throw new Error('Event not found');
      
      setEvent(eventData);

      // Fetch designs for this event
      const { data: designsData, error: designsError } = await supabase
        .from('flash_designs')
        .select('*')
        .eq('event_id', eventData.id)
        .eq('is_available', true)
        .order('created_at', { ascending: true });

      if (designsError) throw designsError;
      setDesigns(designsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading event');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDesign = (design: FlashDesign) => {
    setSelectedDesign(design);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedDesign(null), 300);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-accent-gold/20 border-t-accent-gold rounded-full animate-spin" />
          <p className="text-text-secondary mt-md">Cargando evento...</p>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-background-primary flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-md">{error || 'Evento no encontrado'}</p>
          <button
            onClick={() => navigate('/flash')}
            className="px-lg py-3 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold transition-all duration-standard"
          >
            Volver a Eventos
          </button>
        </div>
      </div>
    );
  }

  const title = language === 'es' ? event.title_es : event.title_en;
  const description = language === 'es' ? event.description_es : event.description_en;
  const rules = language === 'es' ? event.rules_es : event.rules_en;

  const now = new Date();
  const startDate = new Date(event.start_at);
  const endDate = new Date(event.end_at);
  const isActive = now >= startDate && now <= endDate;
  const isUpcoming = now < startDate;

  return (
    <div className="min-h-screen bg-background-primary">
      {/* Back Button */}
      <div className="max-w-container-xl mx-auto px-md md:px-lg pt-lg">
        <button
          onClick={() => navigate('/flash')}
          className="flex items-center gap-2 text-text-secondary hover:text-accent-gold transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm uppercase tracking-wider">Volver a Eventos</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="py-12 md:py-20">
        <div className="max-w-container-xl mx-auto px-md md:px-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl items-center">
            {/* Event Info */}
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-accent-gold mb-md">
                {title}
              </h1>
              {description && (
                <p className="text-text-secondary text-lg leading-relaxed mb-lg">
                  {description}
                </p>
              )}

              <div className="flex items-center gap-md mb-lg text-text-tertiary">
                <div className="flex items-center gap-xs">
                  <Calendar size={18} />
                  <span className="text-sm">
                    {new Date(event.start_at).toLocaleDateString()} - {new Date(event.end_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {isUpcoming && (
                <div className="bg-background-elevated border border-border-gold rounded-lg p-lg mb-lg">
                  <p className="text-text-tertiary text-sm uppercase tracking-wider mb-md">
                    {t('flash.countdown.startsIn')}
                  </p>
                  <CountdownTimer targetDate={event.start_at} />
                </div>
              )}

              {isActive && (
                <div className="bg-background-elevated border border-border-gold rounded-lg p-lg mb-lg">
                  <p className="text-text-tertiary text-sm uppercase tracking-wider mb-md">
                    {t('flash.countdown.endsIn')}
                  </p>
                  <CountdownTimer targetDate={event.end_at} />
                </div>
              )}



              {/* Deposit Info */}
              <div className="bg-accent-gold/10 border border-accent-gold/30 rounded-lg p-md">
                <div className="flex items-start gap-sm">
                  <Info className="text-accent-gold flex-shrink-0 mt-1" size={18} />
                  <div>
                    <p className="text-text-primary font-semibold text-sm mb-xs">
                      Depósito: €{(event.deposit_amount / 100).toFixed(2)}
                    </p>
                    <p className="text-text-secondary text-xs">
                      {t('flash.depositApplied')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Banner Image */}
            {event.hero_image && (
              <div className="aspect-video lg:aspect-square rounded-lg overflow-hidden border border-border-gold">
                <img
                  src={event.hero_image}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Designs Grid */}
      <section className="py-16 md:py-24 bg-background-elevated border-y border-border-subtle">
        <div className="max-w-container-xl mx-auto px-md md:px-lg">
          <h2 className="font-display text-3xl text-text-primary mb-xl">
            {t('flash.designs')}
          </h2>

          {designs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-text-secondary text-lg">
                {t('flash.noDesignsAvailable')}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-lg">
              {designs.map((design) => (
                <FlashDesignCard
                  key={design.id}
                  design={design}
                  onSelect={handleSelectDesign}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Rules Section */}
      {rules && (
        <section className="py-16 md:py-24">
          <div className="max-w-container-lg mx-auto px-md md:px-lg">
            <h2 className="font-display text-3xl text-text-primary mb-lg">
              Reglas y Condiciones
            </h2>
            <div className="prose prose-invert prose-gold max-w-none">
              <div className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                {rules}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Booking Drawer */}
      {selectedDesign && (
        <FlashBookingDrawer
          isOpen={isDrawerOpen}
          onClose={handleCloseDrawer}
          design={selectedDesign}
          eventId={event.id}
        />
      )}
    </div>
  );
}

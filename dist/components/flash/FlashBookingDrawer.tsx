import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { FlashDesign, FlashSlot, FlashBookingRequest, FlashBookingResponse } from '../../types/flash';
import { supabase } from '../../lib/supabase';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_51QUfz7BOdphqnSKe1WcU4r8MHLlVvHTwZ4PW5c1yWn1WFMX75Qc2fVDGI0kbqLrq3NGjQvMEPzPjHWZ6ySXaLWvC00J7CuU2HG');

interface FlashBookingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  design: FlashDesign;
  eventId: string;
}

interface StepProps {
  label: string;
  number: number;
  isActive: boolean;
  isCompleted: boolean;
}

function Step({ label, number, isActive, isCompleted }: StepProps) {
  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-standard ${
        isCompleted 
          ? 'bg-accent-gold text-background-primary' 
          : isActive
          ? 'bg-accent-gold/20 border-2 border-accent-gold text-accent-gold'
          : 'bg-background-primary border-2 border-border-subtle text-text-tertiary'
      }`}>
        {isCompleted ? <Check size={16} /> : <span className="text-sm font-semibold">{number}</span>}
      </div>
      <span className={`ml-2 text-sm font-medium hidden sm:inline ${
        isActive ? 'text-text-primary' : 'text-text-tertiary'
      }`}>
        {label}
      </span>
    </div>
  );
}

function PaymentForm({ clientSecret, onSuccess, onError }: { clientSecret: string, onSuccess: () => void, onError: (error: string) => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useLanguage();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/flash/booking-success`,
        },
        redirect: 'if_required'
      });

      if (error) {
        onError(error.message || t('flash.errors.paymentFailed'));
      } else {
        onSuccess();
      }
    } catch (err) {
      onError(t('flash.errors.paymentFailed'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-md">
      <PaymentElement />
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full px-lg py-3 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold hover:scale-105 transform transition-all duration-standard disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isProcessing ? t('flash.booking.processing') : t('flash.booking.confirm')}
      </button>
    </form>
  );
}

export function FlashBookingDrawer({ isOpen, onClose, design, eventId }: FlashBookingDrawerProps) {
  const { t, language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedSize, setSelectedSize] = useState<'S' | 'M' | 'L' | null>(null);
  const [selectedColor, setSelectedColor] = useState(false);
  const [selectedZone, setSelectedZone] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<FlashSlot | null>(null);
  const [availableSlots, setAvailableSlots] = useState<FlashSlot[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const title = language === 'es' ? design.title : (design.title_en || design.title);

  // Calculate total price
  const totalPrice = selectedSize 
    ? design.base_price + (selectedColor ? design.color_extra : 0)
    : 0;

  // Load available slots when step 4 is reached
  useEffect(() => {
    if (currentStep === 4 && selectedSize) {
      loadAvailableSlots();
    }
  }, [currentStep, selectedSize]);

  const loadAvailableSlots = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('flash-get-available-slots', {
        body: { eventId, designId: design.id }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error.message);

      setAvailableSlots(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('flash.errors.slotUnavailable'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextStep = async () => {
    setError(null);

    // Validation for each step
    if (currentStep === 1 && !selectedSize) {
      setError(t('flash.errors.selectSize'));
      return;
    }
    if (currentStep === 3 && !selectedZone) {
      setError(t('flash.errors.selectZone'));
      return;
    }
    if (currentStep === 4 && !selectedSlot) {
      setError(t('flash.errors.selectSlot'));
      return;
    }

    if (currentStep === 4) {
      // Validate contact info
      if (!clientName || !clientEmail) {
        setError(t('flash.errors.fillRequired'));
        return;
      }

      // Create payment intent
      await createPaymentIntent();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const createPaymentIntent = async () => {
    if (!selectedSize || !selectedZone || !selectedSlot) return;

    setIsLoading(true);
    try {
      const bookingData: FlashBookingRequest = {
        eventId,
        designId: design.id,
        slotId: selectedSlot.id,
        clientName,
        clientEmail,
        clientPhone,
        size: selectedSize,
        zone: selectedZone,
        withColor: selectedColor,
        notes
      };

      const { data, error } = await supabase.functions.invoke('flash-create-payment-intent', {
        body: bookingData
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error.message);

      const response: FlashBookingResponse = data.data;
      setClientSecret(response.clientSecret);
      setCurrentStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('flash.errors.paymentFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
      resetForm();
    }, 3000);
  };

  const handlePaymentError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedSize(null);
    setSelectedColor(false);
    setSelectedZone(null);
    setSelectedSlot(null);
    setClientName('');
    setClientEmail('');
    setClientPhone('');
    setNotes('');
    setClientSecret(null);
    setError(null);
    setShowSuccess(false);
  };

  const handleClose = () => {
    onClose();
    setTimeout(resetForm, 300);
  };

  if (!isOpen) return null;

  const steps = [
    { label: t('flash.booking.step1'), number: 1 },
    { label: t('flash.booking.step2'), number: 2 },
    { label: t('flash.booking.step3'), number: 3 },
    { label: t('flash.booking.step4'), number: 4 },
    { label: t('flash.booking.step5'), number: 5 }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />
      
      {/* Drawer */}
      <div className="absolute right-0 top-0 h-full w-full max-w-2xl bg-background-primary shadow-2xl overflow-y-auto">
        <div className="p-lg">
          {/* Header */}
          <div className="flex items-start justify-between mb-lg">
            <div>
              <h2 className="font-display text-2xl text-accent-gold mb-xs">
                {t('flash.booking.title')}
              </h2>
              <p className="text-text-secondary text-sm">{title}</p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-text-tertiary hover:text-accent-gold transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center justify-between mb-xl">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <Step
                  {...step}
                  isActive={currentStep === step.number}
                  isCompleted={currentStep > step.number}
                />
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-[2px] mx-2 ${
                    currentStep > step.number ? 'bg-accent-gold' : 'bg-border-subtle'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-lg p-md bg-green-900/20 border border-green-700/50 rounded-lg text-green-200 text-center">
              <p className="font-semibold mb-xs">{t('flash.booking.success')}</p>
              <p className="text-sm">{t('flash.booking.successMessage')}</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-lg p-md bg-red-900/20 border border-red-700/50 rounded-lg text-red-200">
              {error}
            </div>
          )}

          {/* Step Content */}
          <div className="space-y-lg">
            {/* Step 1: Size */}
            {currentStep === 1 && (
              <div>
                <h3 className="font-display text-lg text-text-primary mb-md">
                  {t('flash.size')}
                </h3>
                <div className="grid grid-cols-3 gap-md">
                  {design.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`p-md border-2 rounded-lg transition-all duration-fast ${
                        selectedSize === size
                          ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                          : 'border-border-subtle text-text-secondary hover:border-accent-gold/50'
                      }`}
                    >
                      <div className="text-2xl font-display mb-xs">{size}</div>
                      <div className="text-xs">{t(`flash.sizes.${size}`)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2: Color */}
            {currentStep === 2 && (
              <div>
                <h3 className="font-display text-lg text-text-primary mb-md">
                  {t('flash.color')}
                </h3>
                <div className="grid grid-cols-2 gap-md">
                  <button
                    onClick={() => setSelectedColor(false)}
                    className={`p-md border-2 rounded-lg transition-all duration-fast ${
                      !selectedColor
                        ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                        : 'border-border-subtle text-text-secondary hover:border-accent-gold/50'
                    }`}
                  >
                    <div className="font-semibold mb-xs">{t('flash.withoutColor')}</div>
                    <div className="text-accent-gold text-lg font-display">
                      €{(design.base_price / 100).toFixed(2)}
                    </div>
                  </button>
                  {design.color_extra > 0 && (
                    <button
                      onClick={() => setSelectedColor(true)}
                      className={`p-md border-2 rounded-lg transition-all duration-fast ${
                        selectedColor
                          ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                          : 'border-border-subtle text-text-secondary hover:border-accent-gold/50'
                      }`}
                    >
                      <div className="font-semibold mb-xs">{t('flash.withColor')}</div>
                      <div className="text-accent-gold text-lg font-display">
                        €{((design.base_price + design.color_extra) / 100).toFixed(2)}
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Zone */}
            {currentStep === 3 && (
              <div>
                <h3 className="font-display text-lg text-text-primary mb-md">
                  {t('flash.zone')}
                </h3>
                <div className="grid grid-cols-2 gap-md">
                  {design.zones.map((zone) => (
                    <button
                      key={zone}
                      onClick={() => setSelectedZone(zone)}
                      className={`p-md border-2 rounded-lg transition-all duration-fast ${
                        selectedZone === zone
                          ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                          : 'border-border-subtle text-text-secondary hover:border-accent-gold/50'
                      }`}
                    >
                      {t(`flash.zones.${zone}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Slot & Contact Info */}
            {currentStep === 4 && (
              <div className="space-y-lg">
                <div>
                  <h3 className="font-display text-lg text-text-primary mb-md">
                    {t('flash.selectSlot')}
                  </h3>
                  {isLoading ? (
                    <div className="text-center py-lg text-text-tertiary">
                      {t('flash.booking.processing')}
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="text-center py-lg text-text-tertiary">
                      {t('flash.errors.slotUnavailable')}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-md max-h-60 overflow-y-auto">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.id}
                          onClick={() => setSelectedSlot(slot)}
                          className={`p-md border-2 rounded-lg transition-all duration-fast text-left ${
                            selectedSlot?.id === slot.id
                              ? 'border-accent-gold bg-accent-gold/10 text-accent-gold'
                              : 'border-border-subtle text-text-secondary hover:border-accent-gold/50'
                          }`}
                        >
                          <div className="font-semibold mb-xs">
                            {new Date(slot.slot_date).toLocaleDateString()}
                          </div>
                          <div className="text-sm">
                            {slot.start_time.substring(0, 5)} ({slot.duration_minutes} {t('flash.minutes')})
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <h3 className="font-display text-lg text-text-primary mb-md">
                    {t('flash.contactInfo')}
                  </h3>
                  <div className="space-y-md">
                    <div>
                      <label className="block text-sm text-text-secondary mb-xs">
                        {t('flash.booking.name')} *
                      </label>
                      <input
                        type="text"
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        className="w-full px-md py-2 bg-background-elevated border border-border-subtle rounded text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-xs">
                        {t('flash.booking.email')} *
                      </label>
                      <input
                        type="email"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className="w-full px-md py-2 bg-background-elevated border border-border-subtle rounded text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-xs">
                        {t('flash.booking.phone')}
                      </label>
                      <input
                        type="tel"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)}
                        className="w-full px-md py-2 bg-background-elevated border border-border-subtle rounded text-text-primary focus:border-accent-gold focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-text-secondary mb-xs">
                        {t('flash.booking.notes')}
                      </label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        className="w-full px-md py-2 bg-background-elevated border border-border-subtle rounded text-text-primary focus:border-accent-gold focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Payment */}
            {currentStep === 5 && clientSecret && (
              <div>
                <h3 className="font-display text-lg text-text-primary mb-md">
                  {t('flash.booking.step5')}
                </h3>
                <div className="mb-md p-md bg-background-elevated border border-border-gold rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-text-secondary">{t('flash.total')}</span>
                    <span className="text-2xl font-display text-accent-gold">
                      €{(totalPrice / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm 
                    clientSecret={clientSecret} 
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            )}

            {/* Navigation Buttons */}
            {currentStep < 5 && (
              <div className="flex gap-md pt-lg border-t border-border-subtle">
                {currentStep > 1 && (
                  <button
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="flex-1 px-lg py-3 border-2 border-border-gold text-text-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:border-accent-gold hover:text-accent-gold transition-all duration-fast"
                  >
                    {t('flash.back')}
                  </button>
                )}
                <button
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="flex-1 px-lg py-3 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold hover:scale-105 transform transition-all duration-standard disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isLoading ? t('flash.booking.processing') : currentStep === 4 ? t('flash.booking.confirm') : 'Siguiente'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

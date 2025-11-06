import { useLanguage } from '../../contexts/LanguageContext';
import { FlashDesign } from '../../types/flash';
import { StockBadge } from './StockBadge';
import { Palette } from 'lucide-react';

interface FlashDesignCardProps {
  design: FlashDesign;
  onSelect: (design: FlashDesign) => void;
}

export function FlashDesignCard({ design, onSelect }: FlashDesignCardProps) {
  const { t, language } = useLanguage();
  const title = language === 'es' ? (design.title_es || design.title) : (design.title_en || design.title);
  const isSoldOut = design.stock <= 0 || !design.is_available;

  return (
    <div className="bg-background-elevated border border-border-gold rounded-lg overflow-hidden hover:border-accent-gold transition-all duration-fast group">
      <div className="aspect-square overflow-hidden relative">
        <img 
          src={design.image_url} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-standard group-hover:scale-105"
        />
        
        {/* Stock Badge */}
        <div className="absolute top-2 right-2">
          <StockBadge stock={design.stock} isSoldOut={isSoldOut} />
        </div>

        {/* Color Available Badge */}
        {design.color_extra > 0 && design.color_image_url && (
          <div className="absolute top-2 left-2">
            <div className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-gold/20 text-accent-gold border border-accent-gold/50 backdrop-blur-sm flex items-center gap-1">
              <Palette size={12} />
              <span>{t('flash.withColor')}</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-md">
        <h4 className="font-display text-lg text-text-primary mb-xs truncate">{title}</h4>
        
        <div className="flex items-center justify-between mb-sm">
          <span className="text-text-secondary text-sm">{t('flash.basePrice')}</span>
          <span className="text-accent-gold font-semibold">
            €{(design.base_price / 100).toFixed(2)}
          </span>
        </div>

        {design.color_extra > 0 && (
          <div className="flex items-center justify-between mb-md text-text-tertiary text-xs">
            <span>{t('flash.colorExtra')}</span>
            <span>+€{(design.color_extra / 100).toFixed(2)}</span>
          </div>
        )}

        {/* Available Sizes */}
        <div className="flex gap-xs mb-md">
          {design.sizes.map((size) => (
            <span 
              key={size}
              className="px-2 py-1 bg-background-primary border border-border-subtle rounded text-xs text-text-secondary"
            >
              {size}
            </span>
          ))}
        </div>

        <button 
          onClick={() => onSelect(design)}
          disabled={isSoldOut}
          className="w-full px-md py-2 bg-accent-gold text-background-primary font-body text-sm font-semibold tracking-wider uppercase rounded-sm hover:bg-accent-gold-light hover:shadow-glow-gold hover:scale-105 transform transition-all duration-fast disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isSoldOut ? t('flash.soldOut') : t('flash.selectDesign')}
        </button>
      </div>
    </div>
  );
}

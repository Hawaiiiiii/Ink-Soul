import { useLanguage } from '../../contexts/LanguageContext';

interface StockBadgeProps {
  stock: number;
  isSoldOut?: boolean;
}

export function StockBadge({ stock, isSoldOut = false }: StockBadgeProps) {
  const { t } = useLanguage();

  if (isSoldOut || stock <= 0) {
    return (
      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-red-900/80 text-red-200 border border-red-700/50">
        {t('flash.soldOut')}
      </div>
    );
  }

  if (stock <= 3) {
    return (
      <div className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-900/80 text-yellow-200 border border-yellow-700/50">
        {stock} {t('flash.available')}
      </div>
    );
  }

  return (
    <div className="px-3 py-1 rounded-full text-xs font-semibold bg-green-900/80 text-green-200 border border-green-700/50">
      {stock} {t('flash.available')}
    </div>
  );
}

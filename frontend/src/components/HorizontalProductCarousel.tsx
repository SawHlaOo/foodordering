import type { Food } from '../types';
import { FoodCard } from './FoodCard';
import { HomeProductCard } from './HomeProductCard';

type HorizontalProductCarouselProps = {
  foods: Food[];
  ariaLabel?: string;
  cardType?: 'compact' | 'normal';
};

export const HorizontalProductCarousel = ({
  foods,
  ariaLabel = 'Products',
  cardType = 'compact'
}: HorizontalProductCarouselProps) => {
  if (foods.length === 0) return null;

  const renderCards = () => foods.map((food) => (
    cardType === 'normal'
      ? (
        <div key={food.id} className="w-72 shrink-0 snap-start">
          <FoodCard food={food} />
        </div>
      )
      : <HomeProductCard key={food.id} food={food} />
  ));

  return (
    <div
      className="hide-scrollbar -mx-1 flex snap-x snap-mandatory flex-nowrap overflow-x-auto px-1 pb-2"
      aria-label={ariaLabel}
    >
      <div className={`flex shrink-0 gap-3 ${cardType === 'normal' ? 'items-stretch' : ''}`}>
        {renderCards()}
      </div>
    </div>
  );
};

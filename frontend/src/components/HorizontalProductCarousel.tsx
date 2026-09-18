import type { Food } from '../types';
import { HomeProductCard } from './HomeProductCard';

type HorizontalProductCarouselProps = {
  foods: Food[];
};

export const HorizontalProductCarousel = ({ foods }: HorizontalProductCarouselProps) => (
  <div className="hide-scrollbar -mx-1 flex snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto px-1 pb-2">
    {foods.map((food) => <HomeProductCard key={food.id} food={food} />)}
  </div>
);

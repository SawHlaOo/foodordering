import { useCallback, useEffect, useRef } from 'react';
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
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const pausedRef = useRef(false);

  const pause = useCallback(() => {
    pausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const resume = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      pausedRef.current = false;
    }, 900);
  }, []);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel || foods.length < 2 || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let previousTime = performance.now();
    const speed = 18;
    const animate = (time: number) => {
      const elapsed = Math.min(time - previousTime, 64);
      previousTime = time;

      if (!pausedRef.current) {
        const loopWidth = carousel.firstElementChild?.getBoundingClientRect().width ?? 0;
        carousel.scrollLeft += (speed * elapsed) / 1000;
        if (loopWidth > 0 && carousel.scrollLeft >= loopWidth) carousel.scrollLeft -= loopWidth;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    };
  }, [foods.length]);

  if (foods.length === 0) return null;

  const renderCards = (duplicate = false) => foods.map((food) => (
    cardType === 'normal'
      ? (
        <div key={`${duplicate ? 'duplicate-' : ''}${food.id}`} className="w-72 shrink-0 snap-start">
          <FoodCard food={food} />
        </div>
      )
      : <HomeProductCard key={`${duplicate ? 'duplicate-' : ''}${food.id}`} food={food} ariaHidden={duplicate} />
  ));

  return (
    <div
      ref={carouselRef}
      className="hide-scrollbar -mx-1 flex snap-x snap-mandatory flex-nowrap overflow-x-auto px-1 pb-2"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onPointerDown={pause}
      onPointerUp={resume}
      onPointerCancel={resume}
      onWheel={() => {
        pause();
        resume();
      }}
      onFocusCapture={pause}
      onBlurCapture={resume}
      aria-label={ariaLabel}
    >
      <div className={`flex shrink-0 gap-3 ${cardType === 'normal' ? 'items-stretch' : ''}`}>
        {renderCards()}
      </div>
      <div className={`pointer-events-none flex shrink-0 gap-3 ${cardType === 'normal' ? 'items-stretch' : ''}`} aria-hidden="true">
        {renderCards(true)}
      </div>
    </div>
  );
};

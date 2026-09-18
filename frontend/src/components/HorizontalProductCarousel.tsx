import { useCallback, useEffect, useRef } from 'react';
import type { Food } from '../types';
import { HomeProductCard } from './HomeProductCard';

type HorizontalProductCarouselProps = {
  foods: Food[];
  ariaLabel?: string;
};

export const HorizontalProductCarousel = ({ foods, ariaLabel = 'Products' }: HorizontalProductCarouselProps) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const isPausedRef = useRef(false);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  }, []);

  const resumeAfterInteraction = useCallback(() => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
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

      if (!isPausedRef.current) {
        const firstTrack = carousel.firstElementChild;
        const loopWidth = firstTrack?.getBoundingClientRect().width ?? 0;
        carousel.scrollLeft += (speed * elapsed) / 1000;
        if (loopWidth > 0 && carousel.scrollLeft >= loopWidth) {
          carousel.scrollLeft -= loopWidth;
        }
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

  return (
    <div
      ref={carouselRef}
      className="hide-scrollbar -mx-1 flex snap-x snap-mandatory flex-nowrap overflow-x-auto px-1 pb-2"
      onMouseEnter={pause}
      onMouseLeave={resumeAfterInteraction}
      onPointerDown={pause}
      onPointerUp={resumeAfterInteraction}
      onPointerCancel={resumeAfterInteraction}
      onWheel={() => {
        pause();
        resumeAfterInteraction();
      }}
      onFocusCapture={pause}
      onBlurCapture={resumeAfterInteraction}
      aria-label={ariaLabel}
    >
      <div className="flex shrink-0 gap-3">
        {foods.map((food) => <HomeProductCard key={food.id} food={food} />)}
      </div>
      {foods.length > 1 && (
        <div className="flex shrink-0 gap-3" aria-hidden="true">
          {foods.map((food) => <HomeProductCard key={`duplicate-${food.id}`} food={food} ariaHidden />)}
        </div>
      )}
    </div>
  );
};

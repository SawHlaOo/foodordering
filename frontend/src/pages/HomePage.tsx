import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import { HorizontalProductCarousel } from '../components/HorizontalProductCarousel';
import { ScrollReveal } from '../components/ScrollReveal';
import type { Food } from '../types';

export const HomePage = () => {
  const { data: foods = [] } = useQuery({
    queryKey: ['featuredFoods'],
    queryFn: () => api.get<Food[]>('/foods')
  });

  return (
    <div className="space-y-10">
      <section>
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-sage-600 px-5 py-7 text-white shadow-soft sm:px-8 sm:py-9">
          <div className="max-w-2xl">
            <p className="hero-enter mb-2 text-xs font-bold uppercase tracking-[0.22em] text-sage-100">FlavorFlow special</p>
            <h1 className="hero-enter hero-enter-delay-1 text-3xl font-black leading-tight text-white sm:text-4xl">Your next favorite meal is waiting.</h1>
            <p className="hero-enter hero-enter-delay-2 mt-3 max-w-xl text-sm leading-6 text-sage-100 sm:text-base">
              Fresh food, refreshing drinks, and easy ordering delivered straight to your table.
            </p>
            <Link to="/menu" className="hero-enter hero-enter-delay-3 mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-bold text-brand-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:scale-[1.02] hover:bg-brand-50 hover:shadow-md active:scale-[0.98]">
              Explore today&apos;s menu
            </Link>
          </div>
        </div>
      </section>

      <ScrollReveal className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-bold">Recommended picks</h2>
          <Link to="/menu" className="shrink-0 text-sm font-semibold text-brand-600 transition hover:text-brand-700 focus:outline-none focus-visible:underline">
            See all
          </Link>
        </div>
        <HorizontalProductCarousel foods={foods.slice(0, 8)} ariaLabel="Recommended products" />
      </ScrollReveal>
    </div>
  );
};

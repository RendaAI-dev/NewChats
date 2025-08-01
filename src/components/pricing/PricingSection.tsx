import React from 'react';
import { PricingCard } from './PricingCard';
import { products } from '../../stripe-config';

export function PricingSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h2>
          <p className="text-xl text-gray-600">
            Planos flexíveis para todas as necessidades
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {products.map((product, index) => (
            <PricingCard
              key={product.id}
              product={product}
              isPopular={index === 0} // Make first product popular
            />
          ))}
        </div>
      </div>
    </section>
  );
}
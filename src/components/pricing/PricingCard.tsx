import React, { useState } from 'react';
import { CheckCircle, CreditCard } from 'lucide-react';
import { Product } from '../../stripe-config';
import { createCheckoutSession } from '../../lib/stripe';

interface PricingCardProps {
  product: Product;
  isPopular?: boolean;
}

export function PricingCard({ product, isPopular = false }: PricingCardProps) {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const successUrl = `${window.location.origin}/success`;
      const cancelUrl = window.location.href;
      
      await createCheckoutSession({
        priceId: product.priceId,
        mode: product.mode,
        successUrl,
        cancelUrl,
      });
    } catch (error) {
      console.error('Erro ao criar sessão de checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    'Contatos ilimitados',
    'Até 10 conexões WhatsApp',
    'IA para mensagens',
    'Chamada perdida',
    'Suporte prioritário',
    'Campanhas ilimitadas',
    'Sistema anti-bloqueio',
    'Dashboard completo'
  ];

  return (
    <div className={`relative bg-white p-8 rounded-xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
      isPopular ? 'border-green-500 scale-105' : 'border-gray-200'
    }`}>
      {isPopular && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
            Mais Popular
          </span>
        </div>
      )}

      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="mb-6">
          <span className="text-4xl font-bold text-gray-900">{product.price}</span>
          <span className="text-gray-600">/{product.mode === 'subscription' ? 'mês' : 'único'}</span>
        </div>
      </div>

      <ul className="space-y-3 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-700">
            <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
          isPopular
            ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
        } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
      >
        {loading ? (
          <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            {product.mode === 'subscription' ? 'Assinar Agora' : 'Comprar Agora'}
          </>
        )}
      </button>
    </div>
  );
}
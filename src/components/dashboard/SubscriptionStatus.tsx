import React from 'react';
import { Crown, Calendar, CreditCard } from 'lucide-react';

interface SubscriptionStatusProps {
  subscription: {
    subscription_status: string;
    price_id: string;
    current_period_end: number;
    cancel_at_period_end: boolean;
    payment_method_brand?: string;
    payment_method_last4?: string;
  } | null;
  planName: string;
}

export function SubscriptionStatus({ subscription, planName }: SubscriptionStatusProps) {
  if (!subscription) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
        <div className="flex items-center mb-4">
          <Crown className="w-6 h-6 text-gray-400 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">Plano Atual</h3>
        </div>
        <p className="text-gray-600 mb-4">Nenhuma assinatura ativa</p>
        <button className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
          Escolher Plano
        </button>
      </div>
    );
  }

  const isActive = subscription.subscription_status === 'active';
  const endDate = new Date(subscription.current_period_end * 1000);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      <div className="flex items-center mb-4">
        <Crown className={`w-6 h-6 mr-3 ${isActive ? 'text-green-500' : 'text-gray-400'}`} />
        <h3 className="text-lg font-semibold text-gray-900">Plano Atual</h3>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Plano:</span>
          <span className="font-semibold text-gray-900">{planName}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isActive 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Ativo' : 'Inativo'}
          </span>
        </div>

        {isActive && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-gray-600 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Próxima cobrança:
              </span>
              <span className="font-medium text-gray-900">
                {endDate.toLocaleDateString('pt-BR')}
              </span>
            </div>

            {subscription.payment_method_brand && subscription.payment_method_last4 && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600 flex items-center">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Cartão:
                </span>
                <span className="font-medium text-gray-900">
                  {subscription.payment_method_brand.toUpperCase()} •••• {subscription.payment_method_last4}
                </span>
              </div>
            )}

            {subscription.cancel_at_period_end && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Sua assinatura será cancelada em {endDate.toLocaleDateString('pt-BR')}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
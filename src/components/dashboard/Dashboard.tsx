import React from 'react';
import { SubscriptionStatus } from './SubscriptionStatus';
import { useSubscription } from '../../hooks/useSubscription';
import { MessageSquare, Users, Zap, BarChart3 } from 'lucide-react';

export function Dashboard() {
  const { subscription, planName, loading } = useSubscription();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      name: 'Conexões WhatsApp',
      value: '0',
      icon: MessageSquare,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Contatos',
      value: '0',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Campanhas Ativas',
      value: '0',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      name: 'Mensagens Enviadas',
      value: '0',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Bem-vindo ao New Chats</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {stats.map((stat) => (
                <div key={stat.name} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SubscriptionStatus subscription={subscription} planName={planName} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Primeiros Passos</h2>
          <div className="space-y-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-green-600 font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Conectar WhatsApp</h3>
                <p className="text-gray-600 text-sm">Conecte sua primeira conta WhatsApp Business</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-blue-600 font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Importar Contatos</h3>
                <p className="text-gray-600 text-sm">Adicione seus contatos ou importe via CSV</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                <span className="text-purple-600 font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Criar Campanha</h3>
                <p className="text-gray-600 text-sm">Configure sua primeira campanha de disparos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
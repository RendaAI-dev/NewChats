import React from 'react';
import { CheckCircle, ArrowRight, Home } from 'lucide-react';

interface SuccessPageProps {
  onGoToDashboard: () => void;
}

export function SuccessPage({ onGoToDashboard }: SuccessPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Pagamento Confirmado!
          </h1>
          
          <p className="text-gray-600 mb-8">
            Sua assinatura foi ativada com sucesso. Agora você pode aproveitar todos os recursos do New Chats.
          </p>
          
          <div className="space-y-4">
            <button
              onClick={onGoToDashboard}
              className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center"
            >
              <Home className="w-5 h-5 mr-2" />
              Ir para Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            
            <div className="text-sm text-gray-500">
              Você receberá um email de confirmação em breve
            </div>
          </div>
        </div>
        
        <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Próximos Passos:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
              Conecte sua primeira conta WhatsApp
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
              Importe seus contatos
            </li>
            <li className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              Configure sua primeira campanha
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
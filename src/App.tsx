import React, { useState } from 'react';
import { 
  MessageSquare, 
  Zap, 
  Users, 
  Bot, 
  Shield, 
  Clock, 
  CheckCircle, 
  ArrowRight, 
  Star,
  Phone,
  Download,
  Settings,
  BarChart3,
  Globe,
  Menu,
  X
} from 'lucide-react';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleStartNow = () => {
    scrollToSection('pricing');
  };

  const handleSubscribeNow = () => {
    window.open('https://app.newchats.io/webhook/integracao-stripe', '_blank');
  };

  const handleDemo = () => {
    alert('Demonstração será disponibilizada em breve! Entre em contato conosco.');
  };

  const handleContactSales = () => {
    window.open('https://wa.me/5511999999999?text=Olá! Gostaria de saber mais sobre o New Chats.', '_blank');
  };

  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-green-500" />,
      title: "Integração WhatsApp Business",
      description: "Conecte até 10 contas WhatsApp Business simultaneamente via QR Code com máxima segurança."
    },
    {
      icon: <Users className="w-8 h-8 text-blue-500" />,
      title: "Gestão Inteligente de Contatos",
      description: "Importe contatos ilimitados, crie listas, remova duplicatas automaticamente e verifique números válidos."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-500" />,
      title: "Disparos Individuais e em Grupo",
      description: "Envie mensagens personalizadas para contatos individuais ou grupos inteiros com facilidade."
    },
    {
      icon: <Bot className="w-8 h-8 text-purple-500" />,
      title: "IA para Geração de Mensagens",
      description: "Use inteligência artificial para criar mensagens mais eficazes e personalizadas."
    },
    {
      icon: <Shield className="w-8 h-8 text-red-500" />,
      title: "Sistema Anti-Bloqueio",
      description: "Tecnologia avançada de proteção que evita bloqueios e maximiza a entrega das mensagens."
    },
    {
      icon: <Phone className="w-8 h-8 text-orange-500" />,
      title: "Chamada Perdida Estratégica",
      description: "Função exclusiva para chamar atenção dos leads através de ligações perdidas."
    }
  ];

  const advancedFeatures = [
    "Variáveis de tempo (data, dia da semana, mês, cumprimentos)",
    "Variáveis de nome personalizadas",
    "Variáveis customizáveis",
    "Sistema de pausa e retomada",
    "Puxar grupos automaticamente",
    "Importação via CSV com exemplo",
    "API para integrações",
    "Dashboard de relatórios em tempo real"
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      role: "Diretor de Marketing",
      company: "TechStart",
      rating: 5,
      text: "Aumentamos nossa taxa de conversão em 300% usando o New Chats. Poder conectar 10 WhatsApp simultaneamente foi fundamental para nossos workflows."
    },
    {
      name: "Ana Santos",
      role: "Gerente de Vendas",
      company: "Digital Solutions",
      rating: 5,
      text: "A função de chamada perdida é genial! Nossos leads respondem muito mais rápido agora. O New Chats revolucionou nossa estratégia."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                New Chats
              </span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <button onClick={() => scrollToSection('features')} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Funcionalidades</button>
              <button onClick={() => scrollToSection('pricing')} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Preços</button>
              <button onClick={() => scrollToSection('testimonials')} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">Depoimentos</button>
              <button onClick={() => scrollToSection('faq')} className="text-gray-700 hover:text-green-600 transition-colors cursor-pointer">FAQ</button>
             <a 
               href="https://app.newchats.io/login" 
               target="_blank"
               rel="noopener noreferrer"
               className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
             >
               Login
             </a>
            </nav>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <button onClick={() => { scrollToSection('features'); setMobileMenuOpen(false); }} className="block px-3 py-2 text-gray-700 hover:text-green-600 w-full text-left">Funcionalidades</button>
              <button onClick={() => { scrollToSection('pricing'); setMobileMenuOpen(false); }} className="block px-3 py-2 text-gray-700 hover:text-green-600 w-full text-left">Preços</button>
              <button onClick={() => { scrollToSection('testimonials'); setMobileMenuOpen(false); }} className="block px-3 py-2 text-gray-700 hover:text-green-600 w-full text-left">Depoimentos</button>
              <button onClick={() => { scrollToSection('faq'); setMobileMenuOpen(false); }} className="block px-3 py-2 text-gray-700 hover:text-green-600 w-full text-left">FAQ</button>
             <a 
               href="https://app.newchats.io/login" 
               target="_blank"
               rel="noopener noreferrer"
               className="block px-3 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors text-center mx-3 mt-2"
             >
               Login
             </a>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 rounded-full text-green-800 text-sm font-medium mb-8">
              <Zap className="w-4 h-4 mr-2" />
              Sistema Mais Avançado do Mercado
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Automatize Seus Disparos no
              <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                WhatsApp Business
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Sistema completo com IA para geração de mensagens, tecnologia anti-bloqueio 
              e funcionalidades exclusivas como chamada perdida estratégica.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={handleStartNow}
                className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 flex items-center cursor-pointer"
              >
                Começar Agora
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
              <button 
                onClick={handleDemo}
                className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold text-lg hover:border-green-500 hover:text-green-600 transition-all duration-200 cursor-pointer"
              >
                Ver Demonstração
              </button>
            </div>

            <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-500" />
                Anti-Bloqueio
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                10 Conexões WhatsApp
              </div>
              <div className="flex items-center">
                <Globe className="w-5 h-5 mr-2 text-green-500" />
                Contatos Ilimitados
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Principais
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tudo que você precisa para automatizar e otimizar seus disparos no WhatsApp
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Recursos Avançados
            </h2>
            <p className="text-xl text-gray-600">
              Funcionalidades que fazem a diferença no seu resultado
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <Settings className="w-6 h-6 mr-3 text-blue-600" />
                Automação Completa
              </h3>
              <ul className="space-y-3">
                {advancedFeatures.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <BarChart3 className="w-6 h-6 mr-3 text-purple-600" />
                Gestão Inteligente
              </h3>
              <ul className="space-y-3">
                {advancedFeatures.slice(4).map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <CheckCircle className="w-5 h-5 mr-3 text-green-500 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-gray-600">
              Resultados reais de quem já usa nossa plataforma
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-xl">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 text-lg italic">
                  "{testimonial.text}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-gray-600">{testimonial.role} - {testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Plano Único e Completo
            </h2>
            <p className="text-xl text-gray-600">
              Todas as funcionalidades premium em um só plano
            </p>
          </div>

          <div className="flex justify-center">
            <div className="bg-gradient-to-br from-green-500 to-blue-600 p-8 rounded-xl shadow-xl text-white relative max-w-md w-full">
              <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </div>
              <h3 className="text-2xl font-semibold mb-4">New Chats Pro</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">R$ 699,99</span>
                <span className="text-green-100">/mês</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-200" />
                  Contatos ilimitados
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-200" />
                  Até 10 conexões WhatsApp
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-200" />
                  IA para mensagens
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-200" />
                  Chamada perdida
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-200" />
                  Suporte prioritário
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-3 text-green-200" />
                  Campanhas ilimitadas
                </li>
              </ul>
              <button 
                onClick={handleSubscribeNow}
                className="w-full bg-white text-green-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Assinar Agora
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Como funciona a integração com WhatsApp Business?",
                answer: "A integração é feita através de QR Code, permitindo conectar até 10 contas WhatsApp Business simultaneamente com máxima segurança."
              },
              {
                question: "O sistema pode ser bloqueado pelo WhatsApp?",
                answer: "Nosso sistema utiliza tecnologia anti-bloqueio avançada que minimiza drasticamente o risco de bloqueios."
              },
              {
                question: "Como funciona a API para integrações?",
                answer: "Nossa API permite conectar o sistema com outras ferramentas e serviços, criando workflows personalizados para seu negócio."
              },
              {
                question: "Posso conectar quantas contas WhatsApp?",
                answer: "Com o New Chats Pro você pode conectar até 10 contas WhatsApp Business simultaneamente."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                <p className="text-gray-600">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para Revolucionar seus Disparos no WhatsApp?
          </h2>
          <p className="text-xl mb-8 text-green-100">
            Junte-se a centenas de empresas que já estão usando o New Chats para aumentar suas vendas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleStartNow}
              className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center cursor-pointer"
            >
              Começar Teste Gratuito
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button 
              onClick={handleContactSales}
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-green-600 transition-colors cursor-pointer"
            >
              Falar com Especialista
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold">New Chats</span>
              </div>
              <p className="text-gray-400">
                A plataforma mais avançada para automação de WhatsApp Business.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrações</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Documentação</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tutoriais</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Empresa</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 New Chats. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
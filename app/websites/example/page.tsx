'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Target,
  Zap,
  Mail,
  Phone,
  MapPin,
  Star,
  ChevronRight,
} from 'lucide-react';

const services = [
  {
    icon: <Target className="w-8 h-8 text-blue-600" />,
    title: 'Estrategia Digital',
    description:
      'Desarrollamos estrategias personalizadas que impulsan el crecimiento sostenible de tu negocio en el entorno digital.',
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-600" />,
    title: 'Transformación Digital',
    description:
      'Modernizamos tus procesos empresariales con tecnología de vanguardia para maximizar la eficiencia operativa.',
  },
  {
    icon: <Users className="w-8 h-8 text-blue-600" />,
    title: 'Consultoría Empresarial',
    description:
      'Asesoramiento experto para optimizar tu organización y alcanzar objetivos comerciales ambiciosos.',
  },
  {
    icon: <Zap className="w-8 h-8 text-blue-600" />,
    title: 'Innovación Tecnológica',
    description:
      'Implementamos soluciones tecnológicas innovadoras que te posicionan como líder en tu industria.',
  },
];

const testimonials = [
  {
    name: 'María González',
    position: 'CEO, TechStart',
    content:
      'Acme transformó completamente nuestra operación. En 6 meses aumentamos nuestra eficiencia en un 40% y duplicamos nuestros ingresos.',
    rating: 5,
  },
  {
    name: 'Carlos Mendoza',
    position: 'Director, InnovateCorp',
    content:
      'Su enfoque estratégico y experiencia técnica nos ayudaron a implementar soluciones que parecían imposibles. Resultados excepcionales.',
    rating: 5,
  },
  {
    name: 'Ana Rodríguez',
    position: 'Fundadora, GrowthLab',
    content:
      'El equipo de Acme no solo cumplió nuestras expectativas, las superó. Su metodología es impecable y los resultados hablan por sí solos.',
    rating: 5,
  },
];

const stats = [
  { number: '150+', label: 'Proyectos Exitosos' },
  { number: '98%', label: 'Satisfacción del Cliente' },
  { number: '5 años', label: 'Experiencia Comprobada' },
  { number: '24/7', label: 'Soporte Continuo' },
];

const Website = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `mailto:contac@actme.com?subject=Consulta desde el sitio web&body=Nombre: ${formData.name}%0AEmpresa: ${formData.company}%0AEmail: ${formData.email}%0AMensaje: ${formData.message}`;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">Acme</h1>
            </div>
            <nav className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a
                  href="#servicios"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Servicios
                </a>
                <a
                  href="#nosotros"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Nosotros
                </a>
                <a
                  href="#testimonios"
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Testimonios
                </a>
                <a
                  href="#contacto"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  Contacto
                </a>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                  Transformamos tu negocio con
                  <span className="text-blue-600"> estrategia digital</span>
                </h2>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                  Impulsamos el crecimiento de empresas latinoamericanas a
                  través de consultoría estratégica, transformación digital e
                  innovación tecnológica de clase mundial.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() =>
                      document
                        .getElementById('contacto')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                    aria-label="Iniciar consulta gratuita"
                  >
                    Consulta Gratuita
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() =>
                      document
                        .getElementById('servicios')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }
                    className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg font-semibold hover:border-blue-600 hover:text-blue-600 transition-colors"
                    aria-label="Ver nuestros servicios"
                  >
                    Ver Servicios
                  </button>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1759884247142-028abd1e8ac2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBvZmZpY2UlMjB0ZWFtJTIwY29sbGFib3JhdGlvbiUyMHRlY2hub2xvZ3l8ZW58MXwwfHx8MTc2NDIyMTQ1MXww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Equipo profesional colaborando en oficina moderna con tecnología"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="servicios" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Servicios que Impulsan tu Crecimiento
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Ofrecemos soluciones integrales diseñadas para transformar tu
                empresa y posicionarla como líder en su industria.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="mb-4">{service.icon}</div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1762968274962-20c12e6e8ecd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxkaWdpdGFsJTIwdHJhbnNmb3JtYXRpb24lMjBidXNpbmVzcyUyMGNvbnN1bHRpbmd8ZW58MXwwfHx8MTc2NDIxODc1N3ww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Profesionales analizando datos digitales en pantallas"
                width={1200}
                height={400}
                className="rounded-2xl shadow-xl w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="nosotros" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <Image
                  src="https://images.unsplash.com/photo-1637979909766-ccf55518a928?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwYnVzaW5lc3MlMjB0ZWFtJTIwbWVldGluZyUyMGRpc2N1c3Npb258ZW58MXwyfHx8MTc2NDIyMTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Equipo diverso de profesionales en reunión estratégica"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-xl"
                />
              </div>
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  Expertos en Transformación Digital
                </h3>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  En Acme, combinamos experiencia estratégica con innovación
                  tecnológica para crear soluciones que realmente transforman
                  negocios. Nuestro enfoque colaborativo garantiza resultados
                  excepcionales y crecimiento sostenible.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">
                      Metodología probada en más de 150 proyectos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">
                      Equipo multidisciplinario de expertos
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">
                      Enfoque personalizado para cada cliente
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-green-500" />
                    <span className="text-gray-700">
                      Soporte continuo y seguimiento de resultados
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonios" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Lo que Dicen Nuestros Clientes
              </h3>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                La satisfacción de nuestros clientes es nuestra mayor
                validación. Descubre cómo hemos transformado sus negocios.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white p-8 rounded-xl shadow-lg">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {testimonial.position}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center">
              <Image
                src="https://images.unsplash.com/photo-1696861273647-92dfe8bb697c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxzYXRpc2ZpZWQlMjBidXNpbmVzcyUyMGNsaWVudCUyMGhhbmRzaGFrZSUyMHN1Y2Nlc3N8ZW58MXwwfHx8MTc2NDIyMTQ1Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Apretón de manos entre profesionales simbolizando éxito y satisfacción"
                width={800}
                height={300}
                className="rounded-2xl shadow-xl mx-auto object-cover"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-4xl font-bold text-white mb-6">
              ¿Listo para Transformar tu Negocio?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Únete a más de 150 empresas que han confiado en nosotros para
              impulsar su crecimiento. Comienza tu transformación digital hoy
              mismo.
            </p>
            <button
              onClick={() =>
                document
                  .getElementById('contacto')
                  ?.scrollIntoView({ behavior: 'smooth' })
              }
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
              aria-label="Solicitar consulta estratégica gratuita"
            >
              Consulta Estratégica Gratuita
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-4xl font-bold text-gray-900 mb-6">
                  Hablemos de tu Proyecto
                </h3>
                <p className="text-lg text-gray-600 mb-8">
                  Estamos listos para escuchar tus desafíos y diseñar una
                  solución personalizada que impulse el crecimiento de tu
                  empresa.
                </p>
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Mail className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">Email</div>
                      <a
                        href="mailto:contac@actme.com"
                        className="text-blue-600 hover:underline"
                      >
                        contac@actme.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Phone className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Teléfono
                      </div>
                      <span className="text-gray-600">+52 55 1234 5678</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <MapPin className="w-6 h-6 text-blue-600" />
                    <div>
                      <div className="font-semibold text-gray-900">
                        Ubicación
                      </div>
                      <span className="text-gray-600">
                        Ciudad de México, México
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="tu@email.com"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="company"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Empresa
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={4}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Cuéntanos sobre tu proyecto..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    aria-label="Enviar mensaje de contacto"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-4">Acme</h4>
              <p className="text-gray-400 leading-relaxed">
                Transformamos negocios a través de estrategia digital,
                consultoría empresarial e innovación tecnológica.
              </p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Servicios</h5>
              <ul className="space-y-2 text-gray-400">
                <li>Estrategia Digital</li>
                <li>Transformación Digital</li>
                <li>Consultoría Empresarial</li>
                <li>Innovación Tecnológica</li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contacto</h5>
              <div className="space-y-2 text-gray-400">
                <p>contac@actme.com</p>
                <p>+52 55 1234 5678</p>
                <p>Ciudad de México, México</p>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Acme. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">
              Fotos de Sigmund, Carlos Gil, Joao paulo m ramos paulo y David
              Trinks en Unsplash
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Website;
'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Play,
  Music,
  Users,
  Calendar,
  Mail,
  Phone,
  Instagram,
  Star,
  ArrowRight,
  Volume2,
} from 'lucide-react';

const stats = [
  { number: '50+', label: 'Presentaciones en vivo' },
  { number: '15K+', label: 'Oyentes mensuales' },
  { number: '25+', label: 'Eventos en Bogotá' },
  { number: '3', label: 'Años de trayectoria' },
];

const services = [
  {
    icon: Music,
    title: 'Música Original',
    description:
      'Composiciones propias que fusionan rock indie con pop contemporáneo, creando un sonido único y fresco.',
  },
  {
    icon: Users,
    title: 'Shows en Vivo',
    description:
      'Presentaciones energéticas y profesionales para eventos, festivales y venues en Bogotá y alrededores.',
  },
  {
    icon: Calendar,
    title: 'Eventos Privados',
    description:
      'Música en vivo para celebraciones corporativas, bodas y eventos especiales con repertorio adaptado.',
  },
];

const testimonials = [
  {
    name: 'Carlos Mendoza',
    role: 'Manager de Eventos Rock Palace',
    content:
      'Le Pharè tiene esa energía especial que conecta inmediatamente con el público. Sus shows siempre son un éxito.',
    rating: 5,
  },
  {
    name: 'Ana Rodríguez',
    role: 'Directora Festival Indie Bogotá',
    content:
      'Una banda con mucho potencial y profesionalismo. Su sonido indie pop es exactamente lo que buscan los jóvenes.',
    rating: 5,
  },
  {
    name: 'Miguel Torres',
    role: 'Dueño Café Cultural',
    content:
      'Contratamos a Le Pharè para varios eventos y siempre superan las expectativas. Muy recomendados.',
    rating: 5,
  },
];

const Website = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-sm z-50 border-b border-yellow-500/20">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-yellow-400">Le Pharè</div>
          <div className="hidden md:flex space-x-8">
            <a
              href="#inicio"
              className="hover:text-yellow-400 transition-colors"
            >
              Inicio
            </a>
            <a
              href="#musica"
              className="hover:text-yellow-400 transition-colors"
            >
              Música
            </a>
            <a
              href="#shows"
              className="hover:text-yellow-400 transition-colors"
            >
              Shows
            </a>
            <a
              href="#testimonios"
              className="hover:text-yellow-400 transition-colors"
            >
              Testimonios
            </a>
            <a
              href="#contacto"
              className="hover:text-yellow-400 transition-colors"
            >
              Contacto
            </a>
          </div>
          <a
            href="https://wa.me/573215935341"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
            aria-label="Contactar por WhatsApp"
          >
            Contrátanos
          </a>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section
          id="inicio"
          className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1544427901-7da49550f9e0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBiYW5kJTIwcGVyZm9ybWluZyUyMGxpdmUlMjBjb25jZXJ0JTIwc3RhZ2UlMjBsaWdodHMlMjB5ZWxsb3d8ZW58MXwwfHx8MTc2Mzc1NTU3N3ww&ixlib=rb-4.1.0&q=80&w=1080"
              alt="Banda de rock indie tocando en vivo con luces amarillas en el escenario"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-gray-900/60 to-transparent"></div>
          </div>

          <div className="relative container mx-auto px-4 text-center md:text-left">
            <div className="max-w-3xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-yellow-400">Le Pharè</span>
                <br />
                <span className="text-white">Rock Indie Pop</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 leading-relaxed">
                Llevamos la energía del rock indie pop a cada escenario. Música
                original, shows inolvidables y la pasión que Bogotá necesita.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-yellow-500 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  aria-label="Escuchar nuestra música"
                >
                  {isPlaying ? (
                    <Volume2 className="w-6 h-6" />
                  ) : (
                    <Play className="w-6 h-6" />
                  )}
                  {isPlaying ? 'Pausar Música' : 'Escuchar Música'}
                </button>
                <a
                  href="#contacto"
                  className="border-2 border-yellow-500 text-yellow-400 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-500 hover:text-gray-900 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                  aria-label="Contratar para evento"
                >
                  <Calendar className="w-6 h-6" />
                  Contratar Show
                </a>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                      {stat.number}
                    </div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="musica" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Nuestro <span className="text-yellow-400">Sonido</span>
                </h2>
                <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                  Le Pharè nació de la pasión por crear música que conecte con
                  las emociones. Fusionamos la energía del rock indie con
                  melodías pop contemporáneas, creando un sonido único que
                  resuena con la juventud bogotana.
                </p>
                <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                  Cada canción es una historia, cada show es una experiencia.
                  Trabajamos tanto para oyentes que buscan música fresca como
                  para managers y dueños de negocios que quieren ofrecer
                  entretenimiento de calidad.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                    Rock Indie
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                    Pop
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                    Música Original
                  </span>
                  <span className="bg-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full">
                    Shows en Vivo
                  </span>
                </div>
              </div>
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1594438578199-53b5c0d08178?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHx5b3VuZyUyMG11c2ljaWFucyUyMGluc3RydW1lbnRzJTIwZ3VpdGFyJTIwYmFzcyUyMGRydW1zJTIwaW5kaWUlMjByb2NrfGVufDF8Mnx8fDE3NjM3NTU1Nzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Músicos jóvenes con instrumentos de rock indie"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
                <div className="absolute -bottom-4 -right-4 bg-yellow-500 text-gray-900 p-4 rounded-lg font-bold">
                  3 años de trayectoria
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="shows" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Nuestros <span className="text-yellow-400">Servicios</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Ofrecemos experiencias musicales completas para diferentes tipos
                de eventos y audiencias
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-8 rounded-lg hover:bg-gray-700 transition-colors group"
                >
                  <div className="bg-yellow-500/20 w-16 h-16 rounded-lg flex items-center justify-center mb-6 group-hover:bg-yellow-500/30 transition-colors">
                    <service.icon className="w-8 h-8 text-yellow-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                La <span className="text-yellow-400">Experiencia</span> en Vivo
              </h2>
              <p className="text-xl text-gray-300">
                Cada show es una celebración de la música y la conexión humana
              </p>
            </div>

            <div className="relative">
              <Image
                src="https://images.unsplash.com/photo-1576659753959-e00990dc0636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxsaXZlJTIwbXVzaWMlMjB2ZW51ZSUyMGNvbmNlcnQlMjBjcm93ZCUyMGRhbmNpbmclMjB5ZWxsb3clMjBsaWdodHN8ZW58MXwwfHx8MTc2Mzc1NTU3OHww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Público disfrutando concierto en vivo con luces amarillas"
                width={1200}
                height={600}
                className="w-full rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent rounded-lg"></div>
              <div className="absolute bottom-8 left-8 right-8">
                <h3 className="text-3xl font-bold mb-4">
                  Energía que Contagia
                </h3>
                <p className="text-lg text-gray-200">
                  Nuestros shows crean momentos únicos donde la música une a las
                  personas. Cada presentación es diseñada para generar una
                  experiencia memorable.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonios" className="py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">
                Lo que Dicen de{' '}
                <span className="text-yellow-400">Nosotros</span>
              </h2>
              <p className="text-xl text-gray-300">
                La opinión de quienes han trabajado con Le Pharè
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-gray-800 p-8 rounded-lg">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                      />
                    ))}
                  </div>
                  <p className="text-gray-300 mb-6 italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className="font-bold text-yellow-400">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-400">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-yellow-500 to-yellow-600">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ¿Listo para una Experiencia Musical Única?
            </h2>
            <p className="text-xl text-gray-800 mb-8 max-w-2xl mx-auto">
              Contrata a Le Pharè para tu próximo evento y ofrece a tu audiencia
              la mejor música rock indie pop de Bogotá.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/573215935341"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold hover:bg-gray-800 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                aria-label="Contactar por WhatsApp para contratar"
              >
                <Phone className="w-6 h-6" />
                Contactar Ahora
              </a>
              <a
                href="mailto:jeank1415@gmail.com"
                className="border-2 border-gray-900 text-gray-900 px-8 py-4 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all transform hover:scale-105 flex items-center justify-center gap-3"
                aria-label="Enviar email para más información"
              >
                <Mail className="w-6 h-6" />
                Enviar Email
              </a>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contacto" className="py-20 bg-gray-800">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">
                  Hablemos de <span className="text-yellow-400">Música</span>
                </h2>
                <p className="text-lg text-gray-300 mb-8">
                  Ya sea que representes un venue, organices eventos, o
                  simplemente quieras conocer más sobre nuestra música, estamos
                  aquí para conversar.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                      <Phone className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold">WhatsApp</div>
                      <a
                        href="https://wa.me/573215935341"
                        className="text-yellow-400 hover:underline"
                      >
                        +57 321 593 5341
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                      <Mail className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Email</div>
                      <a
                        href="mailto:jeank1415@gmail.com"
                        className="text-yellow-400 hover:underline"
                      >
                        jeank1415@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="bg-yellow-500/20 p-3 rounded-lg">
                      <Instagram className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <div className="font-semibold">Instagram</div>
                      <a
                        href="https://www.instagram.com/le_phare_"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-400 hover:underline"
                      >
                        @le_phare_
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1729829307611-3ea11e4797d1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxtdXNpYyUyMHN0dWRpbyUyMHJlY29yZGluZyUyMGVxdWlwbWVudCUyMG1pY3JvcGhvbmUlMjB5ZWxsb3clMjBhbWJpZW50fGVufDF8MXx8fDE3NjM3NTU1Nzl8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Estudio de grabación con micrófono y ambiente amarillo"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-4">
                Le Pharè
              </div>
              <p className="text-gray-400">
                Rock indie pop desde Bogotá para el mundo. Música original,
                shows inolvidables.
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4">Contacto</h4>
              <div className="space-y-2 text-gray-400">
                <div>WhatsApp: +57 321 593 5341</div>
                <div>Email: jeank1415@gmail.com</div>
                <div>Instagram: @le_phare_</div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-4">Servicios</h4>
              <div className="space-y-2 text-gray-400">
                <div>Shows en vivo</div>
                <div>Eventos privados</div>
                <div>Música original</div>
                <div>Presentaciones corporativas</div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Le Pharè. Todos los derechos reservados.</p>
            <p className="mt-2 text-sm">
              Fotos de Skyler Gerald, Alex Jones, Dung Anh y Linus Belanger en
              Unsplash
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Website;
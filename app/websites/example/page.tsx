'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, X, Music, ShoppingBag, Users, Calendar, Star, ChevronLeft, ChevronRight } from 'lucide-react';

const Website = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => setShowPopup(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('[id]');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const concertImages = [
    {
      url: "https://images.unsplash.com/photo-1522694013927-350c454fa94b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0cyUyMHJvbWFudGljJTIwYXRtb3NwaGVyZXxlbnwxfDB8fHwxNzYzNzYwNDc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Le Phare en concierto con luces románticas"
    },
    {
      url: "https://images.unsplash.com/photo-1671117507838-103b9f1bb432?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxpbmRpZSUyMHJvY2slMjBjb25jZXJ0JTIwY3Jvd2QlMjB5b3VuZyUyMGF1ZGllbmNlJTIwcm9tYW50aWMlMjBsaWdodGluZ3xlbnwxfDB8fHwxNzYzNzYwNDc1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      alt: "Audiencia joven disfrutando concierto de Le Phare"
    }
  ];

  const albums = [
    {
      title: "Corazones Rebeldes",
      type: "Álbum",
      year: "2024",
      songs: 12,
      image: "https://images.unsplash.com/photo-1711109492213-ccc5b151546e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBhbGJ1bSUyMGNvdmVycyUyMHJvbWFudGljJTIwcm9jayUyMG11c2ljJTIwaW5kaWUlMjBhZXN0aGV0aWN8ZW58MXwyfHx8MTc2Mzc2MDQ3NXww&ixlib=rb-4.1.0&q=80&w=1080"
    },
    {
      title: "Noches de Fuego",
      type: "EP",
      year: "2023",
      songs: 6,
      image: "https://images.unsplash.com/photo-1711109492213-ccc5b151546e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHx2aW55bCUyMHJlY29yZHMlMjBhbGJ1bSUyMGNvdmVycyUyMHJvbWFudGljJTIwcm9jayUyMG11c2ljJTIwaW5kaWUlMjBhZXN0aGV0aWN8ZW58MXwyfHx8MTc2Mzc2MDQ3NXww&ixlib=rb-4.1.0&q=80&w=1080"
    }
  ];

  const allAlbums = [
    { title: "Corazones Rebeldes", year: "2024", type: "Álbum" },
    { title: "Noches de Fuego", year: "2023", type: "EP" },
    { title: "Primeros Latidos", year: "2022", type: "Álbum" },
    { title: "Susurros", year: "2021", type: "EP" }
  ];

  const merchandise = [
    { name: "Camiseta Le Phare", price: "$45.000", image: "https://images.unsplash.com/photo-1714070700737-24acfe6b957c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxiYW5kJTIwbWVyY2hhbmRpc2UlMjB0LXNoaXJ0cyUyMHN0aWNrZXJzJTIwcm9jayUyMG11c2ljJTIweW91dGglMjBjdWx0dXJlfGVufDF8Mnx8fDE3NjM3NjA0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Pack de Stickers", price: "$15.000", image: "https://images.unsplash.com/photo-1714070700737-24acfe6b957c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxiYW5kJTIwbWVyY2hhbmRpc2UlMjB0LXNoaXJ0cyUyMHN0aWNrZXJzJTIwcm9jayUyMG11c2ljJTIweW91dGglMjBjdWx0dXJlfGVufDF8Mnx8fDE3NjM3NjA0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" },
    { name: "Hoodie Oficial", price: "$85.000", image: "https://images.unsplash.com/photo-1714070700737-24acfe6b957c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxiYW5kJTIwbWVyY2hhbmRpc2UlMjB0LXNoaXJ0cyUyMHN0aWNrZXJzJTIwcm9jayUyMG11c2ljJTIweW91dGglMjBjdWx0dXJlfGVufDF8Mnx8fDE3NjM3NjA0NzV8MA&ixlib=rb-4.1.0&q=80&w=1080" }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % concertImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + concertImages.length) % concertImages.length);
  };

  return (
    <>
      {/* Popup del nuevo álbum */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative animate-pulse">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              aria-label="Cerrar popup"
            >
              <X size={24} />
            </button>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-br from-[#8C1F28] to-[#D92525] rounded-lg flex items-center justify-center">
                <Music className="text-white" size={48} />
              </div>
              <h3 className="text-2xl font-bold text-[#8C1F28] mb-2">¡Nuevo Álbum!</h3>
              <p className="text-gray-600 mb-4">"Corazones Rebeldes" ya está disponible</p>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-[#8C1F28] text-white px-6 py-2 rounded-lg hover:bg-[#591C21] transition-colors"
                aria-label="Escuchar nuevo álbum"
              >
                Escuchar Ahora
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#044040] to-black text-white">
        {/* Header */}
        <header className="fixed top-0 w-full bg-black bg-opacity-90 backdrop-blur-sm z-40 border-b border-[#8C1F28]">
          <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="text-2xl font-bold text-[#D92525]">Le Phare</div>
            <div className="hidden md:flex space-x-6">
              <a href="#inicio" className="hover:text-[#D92525] transition-colors">Inicio</a>
              <a href="#conciertos" className="hover:text-[#D92525] transition-colors">Conciertos</a>
              <a href="#musica" className="hover:text-[#D92525] transition-colors">Música</a>
              <a href="#tienda" className="hover:text-[#D92525] transition-colors">Tienda</a>
              <a href="#contacto" className="hover:text-[#D92525] transition-colors">Contacto</a>
            </div>
          </nav>
        </header>

        <main>
          {/* Hero Section */}
          <section id="inicio" className={`min-h-screen flex items-center justify-center relative overflow-hidden ${isVisible.inicio ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="absolute inset-0">
              <Image
                src="https://images.unsplash.com/photo-1522694013927-350c454fa94b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w4MzI1NTF8MHwxfHNlYXJjaHwxfHxyb2NrJTIwYmFuZCUyMGNvbmNlcnQlMjBzdGFnZSUyMGxpZ2h0cyUyMHJvbWFudGljJTIwYXRtb3NwaGVyZXxlbnwxfDB8fHwxNzYzNzYwNDc1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Banda de rock en concierto con luces románticas y atmosfera juvenil"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#8C1F28] via-transparent to-[#044040] opacity-80"></div>
            </div>
            <div className="relative z-10 text-center px-4 max-w-4xl">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#D92525] to-white bg-clip-text text-transparent">
                Le Phare
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200">
                Rock romántico que enciende corazones jóvenes
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-[#D92525] hover:bg-[#8C1F28] px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105" aria-label="Escuchar música de Le Phare">
                  <Play className="inline mr-2" size={20} />
                  Escuchar Ahora
                </button>
                <button className="border-2 border-[#D92525] hover:bg-[#D92525] px-8 py-4 rounded-lg text-lg font-semibold transition-all" aria-label="Ver próximos conciertos">
                  Próximos Shows
                </button>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className={`py-20 bg-[#591C21] ${isVisible.stats ? 'animate-slide-up' : 'opacity-0'}`} id="stats">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl font-bold text-[#D92525] mb-2">50K+</div>
                  <div className="text-gray-300">Fans</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#D92525] mb-2">25</div>
                  <div className="text-gray-300">Conciertos</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#D92525] mb-2">4</div>
                  <div className="text-gray-300">Álbumes</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-[#D92525] mb-2">2M+</div>
                  <div className="text-gray-300">Reproducciones</div>
                </div>
              </div>
            </div>
          </section>

          {/* Carrusel de Conciertos */}
          <section id="conciertos" className={`py-20 ${isVisible.conciertos ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#D92525]">Nuestros Conciertos</h2>
              <div className="relative max-w-4xl mx-auto">
                <div className="overflow-hidden rounded-lg">
                  <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
                    {concertImages.map((image, index) => (
                      <div key={index} className="w-full flex-shrink-0">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          width={1080}
                          height={600}
                          className="w-full h-96 object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={prevSlide}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-[#8C1F28] hover:bg-[#D92525] p-2 rounded-full transition-colors"
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-[#8C1F28] hover:bg-[#D92525] p-2 rounded-full transition-colors"
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </section>

          {/* Sección EP y Álbum Destacados */}
          <section id="musica" className={`py-20 bg-gradient-to-r from-[#044040] to-[#591C21] ${isVisible.musica ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#D92525]">Nuestra Música</h2>
              <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {albums.map((album, index) => (
                  <div key={index} className="bg-black bg-opacity-50 rounded-lg p-6 hover:bg-opacity-70 transition-all transform hover:scale-105">
                    <Image
                      src={album.image}
                      alt={`Portada del ${album.type.toLowerCase()} ${album.title}`}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-2xl font-bold mb-2 text-[#D92525]">{album.title}</h3>
                    <p className="text-gray-300 mb-2">{album.type} • {album.year}</p>
                    <p className="text-gray-400 mb-4">{album.songs} canciones</p>
                    <button className="bg-[#D92525] hover:bg-[#8C1F28] px-6 py-2 rounded-lg transition-colors" aria-label={`Escuchar ${album.title}`}>
                      <Play className="inline mr-2" size={16} />
                      Escuchar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Todos los Álbumes */}
          <section className={`py-20 ${isVisible.discografia ? 'animate-fade-in' : 'opacity-0'}`} id="discografia">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#D92525]">Discografía Completa</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {allAlbums.map((album, index) => (
                  <div key={index} className="bg-[#591C21] rounded-lg p-4 hover:bg-[#8C1F28] transition-colors">
                    <div className="w-full h-32 bg-gradient-to-br from-[#D92525] to-[#8C1F28] rounded-lg mb-4 flex items-center justify-center">
                      <Music size={32} className="text-white" />
                    </div>
                    <h3 className="font-bold mb-1">{album.title}</h3>
                    <p className="text-sm text-gray-300">{album.type} • {album.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Mercancía */}
          <section id="tienda" className={`py-20 bg-[#044040] ${isVisible.tienda ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#D92525]">Mercancía Oficial</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {merchandise.map((item, index) => (
                  <div key={index} className="bg-black bg-opacity-50 rounded-lg overflow-hidden hover:bg-opacity-70 transition-all transform hover:scale-105">
                    <Image
                      src={item.image}
                      alt={`${item.name} - Mercancía oficial de Le Phare`}
                      width={400}
                      height={300}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                      <p className="text-2xl font-bold text-[#D92525] mb-4">{item.price}</p>
                      <button className="w-full bg-[#D92525] hover:bg-[#8C1F28] py-2 rounded-lg transition-colors" aria-label={`Comprar ${item.name}`}>
                        <ShoppingBag className="inline mr-2" size={16} />
                        Comprar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonios */}
          <section className={`py-20 ${isVisible.testimonios ? 'animate-fade-in' : 'opacity-0'}`} id="testimonios">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#D92525]">Lo que dicen nuestros fans</h2>
              <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                <div className="bg-[#591C21] p-6 rounded-lg">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-[#D92525] fill-current" size={20} />
                    ))}
                  </div>
                  <p className="mb-4">"Le Phare logra combinar la intensidad del rock con letras que llegan al corazón. Su música es perfecta para nuestra generación."</p>
                  <p className="text-[#D92525] font-semibold">- María, 22 años</p>
                </div>
                <div className="bg-[#591C21] p-6 rounded-lg">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-[#D92525] fill-current" size={20} />
                    ))}
                  </div>
                  <p className="mb-4">"Cada concierto es una experiencia única. La conexión que tienen con el público es increíble."</p>
                  <p className="text-[#D92525] font-semibold">- Carlos, 25 años</p>
                </div>
                <div className="bg-[#591C21] p-6 rounded-lg">
                  <div className="flex mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-[#D92525] fill-current" size={20} />
                    ))}
                  </div>
                  <p className="mb-4">"Su último álbum 'Corazones Rebeldes' no sale de mi playlist. Cada canción cuenta una historia."</p>
                  <p className="text-[#D92525] font-semibold">- Ana, 20 años</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Final */}
          <section className={`py-20 bg-gradient-to-r from-[#8C1F28] to-[#D92525] ${isVisible.cta ? 'animate-slide-up' : 'opacity-0'}`} id="cta">
            <div className="container mx-auto px-4 text-center">
              <h2 className="text-4xl font-bold mb-6">Únete a la Revolución Musical</h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto">
                Sé parte de la comunidad Le Phare y vive la experiencia del rock romántico que está conquistando corazones jóvenes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-[#8C1F28] hover:bg-gray-100 px-8 py-4 rounded-lg text-lg font-semibold transition-all transform hover:scale-105" aria-label="Seguir a Le Phare en redes sociales">
                  <Users className="inline mr-2" size={20} />
                  Síguenos
                </button>
                <button className="border-2 border-white hover:bg-white hover:text-[#8C1F28] px-8 py-4 rounded-lg text-lg font-semibold transition-all" aria-label="Ver calendario de conciertos">
                  <Calendar className="inline mr-2" size={20} />
                  Próximos Shows
                </button>
              </div>
            </div>
          </section>

          {/* Contacto */}
          <section id="contacto" className={`py-20 bg-black ${isVisible.contacto ? 'animate-fade-in' : 'opacity-0'}`}>
            <div className="container mx-auto px-4">
              <h2 className="text-4xl font-bold text-center mb-12 text-[#D92525]">Contacto</h2>
              <div className="max-w-2xl mx-auto">
                <div className="grid md:grid-cols-2 gap-8 mb-8">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 text-[#D92525]">Email</h3>
                    <a href="mailto:jeank1415@gmail.com" className="text-gray-300 hover:text-white transition-colors">
                      jeank1415@gmail.com
                    </a>
                  </div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-4 text-[#D92525]">WhatsApp</h3>
                    <a 
                      href="https://wa.me/573215935341" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      +57 321 593 5341
                    </a>
                  </div>
                </div>
                <form className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Tu nombre"
                      className="w-full px-4 py-3 bg-[#591C21] border border-[#8C1F28] rounded-lg focus:outline-none focus:border-[#D92525] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder="Tu email"
                      className="w-full px-4 py-3 bg-[#591C21] border border-[#8C1F28] rounded-lg focus:outline-none focus:border-[#D92525] text-white placeholder-gray-400"
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder="Tu mensaje"
                      rows={4}
                      className="w-full px-4 py-3 bg-[#591C21] border border-[#8C1F28] rounded-lg focus:outline-none focus:border-[#D92525] text-white placeholder-gray-400 resize-none"
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#D92525] hover:bg-[#8C1F28] py-3 rounded-lg font-semibold transition-colors"
                    aria-label="Enviar mensaje a Le Phare"
                  >
                    Enviar Mensaje
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-[#591C21] py-8 border-t border-[#8C1F28]">
          <div className="container mx-auto px-4 text-center">
            <div className="text-2xl font-bold text-[#D92525] mb-4">Le Phare</div>
            <p className="text-gray-300 mb-4">Rock romántico que enciende corazones jóvenes</p>
            <div className="flex justify-center space-x-6 mb-4">
              <a href="mailto:jeank1415@gmail.com" className="text-gray-300 hover:text-[#D92525] transition-colors">Email</a>
              <a href="https://wa.me/573215935341" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-[#D92525] transition-colors">WhatsApp</a>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 Le Phare. Todos los derechos reservados.
            </p>
            <p className="text-xs text-gray-500 mt-2">
              Fotos de Dominic Hampton y Valentin Lacoste en Unsplash
            </p>
          </div>
        </footer>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
      `}</style>
    </>
  );
};

export default Website;
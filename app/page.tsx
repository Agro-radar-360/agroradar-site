'use client';

import { useState } from 'react';

interface Article {
  id: string;
  title: string;
  summary: string;
  category: string;
  image: string;
  date: string;
  author: string;
  readTime: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: 'Safra de Soja 2024 atinge recorde histórico',
    summary: 'Produção de soja bate novo recorde com 140 milhões de toneladas. Clima favorável e tecnologia agrícola impulsionam resultado.',
    category: 'Grãos',
    image: 'https://images.pexels.com/photos/4249210/pexels-photo-4249210.jpeg?w=800&q=80',
    date: '22 de Dezembro, 2024',
    author: 'João Silva',
    readTime: '5 min',
  },
  {
    id: '2',
    title: 'Preços do milho sobem 15% em dezembro',
    summary: 'Redução de oferta global faz preços do milho alcançarem maior nível em 6 meses. Agricultores aguardam melhor momento para venda.',
    category: 'Mercado',
    image: 'https://images.pexels.com/photos/5632640/pexels-photo-5632640.jpeg?w=800&q=80',
    date: '21 de Dezembro, 2024',
    author: 'Maria Santos',
    readTime: '4 min',
  },
  {
    id: '3',
    title: 'Drones revolucionam o plantio de precisão',
    summary: 'Novas tecnologias de drones reduzem desperdício de insumos em até 30%. Agricultura 4.0 avança no Brasil.',
    category: 'Tecnologia',
    image: 'https://images.pexels.com/photos/5632649/pexels-photo-5632649.jpeg?w=800&q=80',
    date: '20 de Dezembro, 2024',
    author: 'Carlos Oliveira',
    readTime: '6 min',
  },
  {
    id: '4',
    title: 'Agronegócio cresce 12% em 2024',
    summary: 'Setor registra melhor desempenho em 5 anos com exportações de commodities em alta. Perspectivas positivas para 2025.',
    category: 'Economia',
    image: 'https://images.pexels.com/photos/533189/pexels-photo-533189.jpeg?w=800&q=80',
    date: '19 de Dezembro, 2024',
    author: 'Ana Costa',
    readTime: '7 min',
  },
  {
    id: '5',
    title: 'Agricultura orgânica avança no Brasil',
    summary: 'Produção de alimentos orgânicos cresce 18% anualmente. Consumidores buscam cada vez mais alimentos sustentáveis.',
    category: 'Sustentabilidade',
    image: 'https://images.pexels.com/photos/6745164/pexels-photo-6745164.jpeg?w=800&q=80',
    date: '18 de Dezembro, 2024',
    author: 'Roberto Ferreira',
    readTime: '5 min',
  },
  {
    id: '6',
    title: 'Nova variedade de trigo resiste à seca',
    summary: 'Cientistas desenvolvem variedade de trigo que reduz consumo de água em 40%. Potencial revolucionário para regiões áridas.',
    category: 'Grãos',
    image: 'https://images.pexels.com/photos/4201994/pexels-photo-4201994.jpeg?w=800&q=80',
    date: '17 de Dezembro, 2024',
    author: 'Lucia Martins',
    readTime: '6 min',
  },
];

const categories = ['Todos', 'Grãos', 'Mercado', 'Tecnologia', 'Economia', 'Sustentabilidade'];

function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {article.category}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
          {article.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {article.summary}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-2">
            <span>{article.author}</span>
            <span>•</span>
            <span>{article.readTime}</span>
          </div>
          <span>{article.date}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const filteredArticles =
    selectedCategory === 'Todos'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-500 text-white py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌾</span>
            <h1 className="text-4xl font-bold">AGRO-RADAR 360</h1>
          </div>
          <p className="text-green-100">
            Notícias e análises do agronegócio em tempo real
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Category Filter */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categorias</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-semibold transition-colors duration-200 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-green-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            {selectedCategory === 'Todos' ? 'Todas as notícias' : `Notícias - ${selectedCategory}`}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhum artigo encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-white font-bold mb-3">AGRO-RADAR 360</h3>
              <p className="text-sm">
                Sua fonte confiável de notícias e análises do agronegócio.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Links Rápidos</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-green-400">Home</a></li>
                <li><a href="#" className="hover:text-green-400">Sobre</a></li>
                <li><a href="#" className="hover:text-green-400">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Redes Sociais</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-green-400">Twitter</a></li>
                <li><a href="#" className="hover:text-green-400">LinkedIn</a></li>
                <li><a href="#" className="hover:text-green-400">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2024 AGRO-RADAR 360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

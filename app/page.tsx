

'use client';

import { useEffect, useMemo, useState } from 'react';

interface Article {
  id?: string;
  title?: string;
  summary?: string;
  category?: string;
  image?: string;
  date?: string;
  author?: string;
  readTime?: string;
}

// categorias serão derivadas dinamicamente a partir dos artigos

function ArticleCard({ article }: { article: Article }) {
  const imageSrc =
    article.image ||
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAQAIBRAAA';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
      <div className="relative h-48 overflow-hidden bg-gray-200">
        <img
          src={imageSrc}
          alt={article.title || 'Artigo'}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 right-3">
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {article.category || 'Agronegócio'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
          {article.title || 'Sem título'}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2 mb-3">
          {article.summary || 'Sem resumo disponível.'}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex gap-2">
            <span>{article.author || 'Autor desconhecido'}</span>
            <span>•</span>
            <span>{article.readTime || '—'}</span>
          </div>
          <span>{article.date || ''}</span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    for (const a of articles) {
      if (a?.category) set.add(a.category);
    }
    return ['Todos', ...Array.from(set).sort()];
  }, [articles]);

  useEffect(() => {
    const controller = new AbortController();
    let canceled = false;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://agro-radar-360-3-0.onrender.com';

        const res = await fetch(`${BACKEND_URL}/api/articles?limit=10`, {
          signal: controller.signal,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) {
          throw new Error(`Falha ao carregar artigos (status ${res.status})`);
        }

        const json = await res.json();
        const apiArticles = Array.isArray(json?.articles)
          ? json.articles.map((a: any) => ({
              id: a.id,
              title: a.title,
              summary: a.content
                ? a.content.substring(0, 150) + (a.content.length > 150 ? '...' : '')
                : 'Sem resumo',
              category: a.category || 'Agronegócio',
              image: a.image,
              date: a.published_at
                ? new Date(a.published_at).toLocaleDateString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit',
                  })
                : '',
              author: 'AGRO-RADAR',
              readTime: '3 min',
            }))
          : [];
        if (!canceled) {
          setArticles(apiArticles as Article[]);
        }
      } catch (err: any) {
        if (!canceled && err?.name !== 'AbortError') {
          setError(err?.message || 'Erro ao carregar artigos');
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      canceled = true;
      controller.abort();
    };
  }, []);

  const filteredArticles =
    selectedCategory === 'Todos'
      ? articles
      : articles.filter((a) => a.category === selectedCategory);

  useEffect(() => {
    if (selectedCategory !== 'Todos' && !categories.includes(selectedCategory)) {
      setSelectedCategory('Todos');
    }
  }, [categories, selectedCategory]);

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

        {/* Estados de carregamento/erro */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Carregando artigos...</p>
          </div>
        )}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

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
          {!loading && !error && filteredArticles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhum artigo disponível no momento.
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

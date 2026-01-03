'use client';

import { useEffect, useState } from 'react';

interface Article {
  id: number;
  title: string;
  content: string;
  url: string;
  source: string;
  category: string;
  tags: string;
  image: string;
  published_at: string;
  urgency: "high" | "medium" | "low";
  relevance_score: number;
  position: "hero" | "latest";
}

function HeroArticle({ article }: { article: Article }) {
  return (
    <div className="mb-12 bg-white rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-shadow duration-300">
      <div className="relative h-96">
        <img 
          src={article.image} 
          alt={article.title}
          className="w-full h-full object-cover"
        />
        {article.urgency === 'high' && (
          <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-2 rounded-full font-bold shadow-lg">
            🔥 URGENTE
          </div>
        )}
        <div className="absolute top-4 right-4 bg-green-600 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
          {article.category}
        </div>
      </div>
      <div className="p-8">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h2>
        <p className="text-gray-700 text-lg mb-6 leading-relaxed">
          {article.content.substring(0, 350)}...
        </p>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            <span className="font-semibold">{article.source}</span>
            {' • '}
            <span>{new Date(article.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}</span>
          </div>
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Ler notícia completa →
          </a>
        </div>
      </div>
    </div>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <a 
      href={article.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block group"
    >
      <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden h-full">
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img 
            src={article.image} 
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {article.urgency === 'high' && (
            <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
              🔥 URGENTE
            </div>
          )}
          <div className="absolute top-2 right-2 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold shadow">
            {article.category}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-green-600 transition-colors">
            {article.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-3 mb-3 leading-relaxed">
            {article.content}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-medium">{article.source}</span>
            <span>{new Date(article.published_at).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit'
            })}</span>
          </div>
          {article.tags && (
            <div className="mt-2 text-xs text-gray-400 line-clamp-1">
              🏷️ {article.tags}
            </div>
          )}
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const [hero, setHero] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const API_URL = 'https://agro-radar-360-3-0.onrender.com/api/output';
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    fetch(API_URL, {
      signal: controller.signal,
      headers: { Accept: 'application/json' }
    })
      .then(res => {
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`API retornou status ${res.status}`);
        return res.json();
      })
      .then(data => {
        const heroArticle = data.articles.find((a: Article) => a.position === 'hero');
        const latestArticles = data.articles
          .filter((a: Article) => a.position === 'latest')
          .sort((a, b) => b.relevance_score - a.relevance_score);
        
        setHero(heroArticle || null);
        setArticles(latestArticles);
        setLoading(false);
      })
      .catch(err => {
        clearTimeout(timeoutId);
        console.error('Erro ao carregar artigos:', err);
        setError('Não foi possível carregar as notícias. Tente novamente mais tarde.');
        setLoading(false);
      });

    return () => {
      controller.abort();
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-green-700 to-green-500 text-white py-8 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">🌾</span>
            <h1 className="text-4xl font-bold">AGRO-RADAR 360</h1>
          </div>
          <p className="text-green-100 text-lg">
            Notícias e análises do agronegócio em tempo real
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            <p className="text-gray-600 mt-4 text-lg">Carregando notícias...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚠️</div>
            <p className="text-red-600 text-lg font-semibold">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Hero Article */}
            {hero && <HeroArticle article={hero} />}

            {/* Latest Articles */}
            {articles.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-gray-900 mb-8">
                  📰 Últimas Notícias
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {articles.map(article => (
                    <ArticleCard key={article.id} article={article} />
                  ))}
                </div>
              </>
            )}

            {!hero && articles.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📭</div>
                <p className="text-gray-600 text-lg">
                  Nenhum artigo disponível no momento.
                </p>
              </div>
            )}
          </>
        )}
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
                <li><a href="#" className="hover:text-green-400 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-3">Redes Sociais</h3>
              <ul className="text-sm space-y-2">
                <li><a href="#" className="hover:text-green-400 transition-colors">Twitter</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-green-400 transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 AGRO-RADAR 360. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

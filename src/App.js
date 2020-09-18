import React, { useEffect, useState } from 'react';
import Tmdb from './Tmdb';

import Header from './components/Header';
import FeaturedMovie from './components/FeaturedMovie';
import MovieRow from './components/MovieRow';

import './App.css';

export default () => {

  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setblackHeader] = useState(false);

  useEffect(() => {
    const loadAll = async () => {
      // pegar a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);


      // pegar destaque
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
      
    }

    loadAll();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if(window.scrollY > 10) {
        setblackHeader(true);
      } else {
        setblackHeader(false);
      }
    }

    window.addEventListener('scroll', scrollListener);

    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, []);

  return (
    <div className="page">

      <Header black={blackHeader} />

      {featuredData &&
        <FeaturedMovie item={featuredData} />
      }

      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow  key={key} title={item.title} items={item.items} />
        ))}
      </section>


      <footer>
        Feito com <span role="img" aria-label="coffe">☕</span> e sono por Matheus Gabriel A. Aguiar<br/>
        Direitos de imagem Netflix<br/>
        API: Themoviedb.org
      </footer>

      
      {movieList.length <= 0 &&
        <div className="loading">
          <img src="http://cdn.lowgif.com/full/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="carregando"/>
        </div>
      }

      {/* Header
      Destaque
      Listas
      Rodapé */}
    </div>
  );
}
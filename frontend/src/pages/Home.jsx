import React from 'react';
import Header from '../components/Header';
import Bloglist from '../components/BlogList';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <Bloglist />
      <Newsletter />
      <Footer />
    </>
  );
};

export default Home;

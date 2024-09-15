import React from 'react';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import TextSection from '../../components/TextSection/TextSection';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <Banner />
      <TextSection />
      <VideoPlayer />
      <Footer />
      {/* Add more components or content below the banner */}
    </>
  );
};

export default Home;
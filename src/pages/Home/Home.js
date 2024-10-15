import React from 'react';
import Header from '../../components/Header/Header';
import Banner from '../../components/Banner/Banner';
import VideoPlayer from '../../components/VideoPlayer/VideoPlayer';
import TextSection from '../../components/TextSection/TextSection';
import Footer from '../../components/Footer/Footer';

const Home = () => {
  const heading = 'Welcome';
  const paragraph = 'This paragraph is passed as a prop to the TextSection component.';
  const requestBody = { key: 'value' }; // Replace with actual request body

  return (
    <>
      <Header />
      <Banner />
      <TextSection
        heading={heading} 
        paragraph={paragraph}
      />
      <VideoPlayer />
      <Footer />
      {/* Add more components or content below the banner */}
    </>
  );
};

export default Home;

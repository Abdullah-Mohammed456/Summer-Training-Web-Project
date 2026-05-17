import IntroOverlay from '../components/IntroOverlay';
import Hero from '../components/Hero';
import CarCarousel from '../components/CarCarousel';
import TrendVehicles from '../components/TrendVehicles';
import MotionSection from '../components/MotionSection';
import FutureSection from '../components/FutureSection';
import CollectionSection from '../components/CollectionSection';
import AdvantageSection from '../components/AdvantageSection';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <>
      <IntroOverlay />
      <Hero />
      <CarCarousel />
      <TrendVehicles />
      <MotionSection />
      <FutureSection />
      <CollectionSection />
      <AdvantageSection />
      <Footer />
    </>
  );
};

export default Home;

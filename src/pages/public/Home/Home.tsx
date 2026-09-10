import HeroSection from './components/HeroSection';
import FeaturesSection from '../../../components/FeaturesSection';
import PlatformHighlights from './components/PlatformHighlights';
import HowItWorks from './components/HowItWorks';
import FeaturedCourses from './components/FeaturedCourses';
import AnnouncementsPreview from './components/AnnouncementsPreview';
import PortalStats from './components/PortalStats';

const Home = () => {
  return (
    <>
      <HeroSection />
    <FeaturesSection />
      <PlatformHighlights />
      <HowItWorks />
      <FeaturedCourses />
      <AnnouncementsPreview />
      <PortalStats />
    </>
  );
};

export default Home;

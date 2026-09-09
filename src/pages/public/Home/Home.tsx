import HeroSection from './components/HeroSection';
import PlatformHighlights from './components/PlatformHighlights';
import FeaturedCourses from './components/FeaturedCourses';
import AnnouncementsPreview from './components/AnnouncementsPreview';
import PortalStats from './components/PortalStats';

const Home = () => {
  return (
    <>
      <HeroSection />
      <PlatformHighlights />
      <FeaturedCourses />
      <AnnouncementsPreview />
      <PortalStats />
    </>
  );
};

export default Home;

import HeroSection from '../components/homePage/HeroSection.tsx';
import SystemInfoSection from '../components/homePage/SystemInfo.tsx'
import FeaturesSection from '../components/homePage/FeaturesSection.tsx'
import FrequentAskedQuestionSection from '../components/homePage/FrequentlyAsked.tsx'
import CustomerReviewSection from '../components/homePage/CustomerReview.tsx';
import { useEffect } from 'react';
const Home = () => {
  useEffect(() => {   
    document.title = "Home - Resume Analyzer";
  }, []); 
  return (
    <div className='overflow-x-hidden'>
      <HeroSection></HeroSection>
      <FeaturesSection></FeaturesSection>
      <CustomerReviewSection></CustomerReviewSection>
      <SystemInfoSection></SystemInfoSection>
      <FrequentAskedQuestionSection></FrequentAskedQuestionSection>
    </div>
  )
}

export default Home
import React from 'react';

import QuesapienceHeader from '../../quesapience/QuesapienceHeader';
import QuesapienceFooter from '../../quesapience/QuesapienceFooter';
import HeroSection from '../../quesapience/HeroSection';
import NearbyBookclubsSection from '../../quesapience/NearbyBookclubsSection';
import FeaturedBookclubsSection from '../../quesapience/FeaturedBookclubsSection';
import HowItWorksSection from '../../quesapience/HowItWorksSection';
import WhyPeopleNeedThisSection from '../../quesapience/WhyPeopleNeedThisSection';
import ForWhomSection from '../../quesapience/ForWhomSection';
import ArchiveSection from '../../quesapience/ArchiveSection';
import KnowledgeAssetEngineSection from '../../quesapience/KnowledgeAssetEngineSection';
import KnowledgeAssetProgressSection from '../../quesapience/KnowledgeAssetProgressSection';
import TodayQuestionSection from '../../quesapience/TodayQuestionSection';
import GiantsSection from '../../quesapience/GiantsSection';

export default function HomePageLayout() {
  return (
    <div className="min-h-screen bg-white">
      <QuesapienceHeader />
      <main id="main">
        <HeroSection />
        <NearbyBookclubsSection />
        <FeaturedBookclubsSection />
        <HowItWorksSection />
        <WhyPeopleNeedThisSection />
        <ForWhomSection />
        <ArchiveSection />
        <KnowledgeAssetEngineSection />
        <KnowledgeAssetProgressSection />
        <TodayQuestionSection />
        <GiantsSection />
      </main>
      <QuesapienceFooter />
    </div>
  );
}

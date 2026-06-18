import React from 'react';

import QuesapienceHeader from '../../quesapience/QuesapienceHeader';
import QuesapienceFooter from '../../quesapience/QuesapienceFooter';
import HeroSection from '../../quesapience/HeroSection';
import NearbyBookclubsSection from '../../quesapience/NearbyBookclubsSection';
import FeaturedBookclubsSection from '../../quesapience/FeaturedBookclubsSection';
import HowItWorksSection from '../../quesapience/HowItWorksSection';
import WhyPeopleNeedThisSection from '../../quesapience/WhyPeopleNeedThisSection';
import ArchiveSection from '../../quesapience/ArchiveSection';
import KnowledgeAssetEngineSection from '../../quesapience/KnowledgeAssetEngineSection';
import TodayQuestionSection from '../../quesapience/TodayQuestionSection';
import GiantsSection from '../../quesapience/GiantsSection';
import QuestionAskersSection from '../../quesapience/QuestionAskersSection';

export default function HomePageLayout() {
  return (
    <div className="min-h-screen bg-white">
      <QuesapienceHeader />
      <main id="main">
        <HeroSection />
        <NearbyBookclubsSection />
        <FeaturedBookclubsSection />
        <HowItWorksSection />
        <QuestionAskersSection />
        <WhyPeopleNeedThisSection />
        <ArchiveSection />
        <KnowledgeAssetEngineSection />
        <TodayQuestionSection />
        <GiantsSection />
      </main>
      <QuesapienceFooter />
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { Template, CategoryId, CelebrationData } from "./types";
import { TEMPLATES } from "./data/mockData";
import { ToastProvider } from "./components/common/Toast";
import { Navbar } from "./components/common/Navbar";
import { Footer } from "./components/common/Footer";
import { LoginModal } from "./components/common/LoginModal";
import { TemplatePreviewModal } from "./components/templates/TemplatePreviewModal";
import { PersonalizationWizard } from "./components/wizard/PersonalizationWizard";
import { CelebrationPage } from "./components/celebration/CelebrationPage";
import { HomeView } from "./views/HomeView";
import { ExploreView } from "./views/ExploreView";
import { SuccessView } from "./views/SuccessView";
import { MyCelebrationsView } from "./views/MyCelebrationsView";
import { PricingView } from "./views/PricingView";
import { HowItWorksView } from "./views/HowItWorksView";
import { motion, AnimatePresence } from "motion/react";
export default function App() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [templates] = useState<Template[]>(TEMPLATES);
  const [celebrations, setCelebrations] = useState<CelebrationData[]>([]);
  useEffect(() => {
    fetch("/api/celebrations")
      .then((res) => res.json())
      .then((data) => setCelebrations(data))
      .catch((err) => console.error("Failed to fetch celebrations:", err));
  }, []);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">(
    "all",
  );
  const [generatedCelebration, setGeneratedCelebration] =
    useState<CelebrationData | null>(null);
  const [activeCelebrationView, setActiveCelebrationView] =
    useState<CelebrationData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false); // Trigger Demo Modal const handleViewDemo = (template: Template) => { setSelectedTemplate(template); setIsPreviewModalOpen(true); }; // Trigger Personalization Wizard const handleUseTemplate = (template: Template) => { setSelectedTemplate(template); setIsPreviewModalOpen(false); setActiveTab('wizard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }; // Handle Category Click from Home const handleSelectCategory = (cat: CategoryId) => { setSelectedCategory(cat); setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }; // Handle Generated Celebration const handleCelebrationGenerated = (celebration: CelebrationData) => { setCelebrations((prev) => [celebration, ...prev]); setGeneratedCelebration(celebration); setActiveTab('success'); window.scrollTo({ top: 0, behavior: 'smooth' }); }; // Open Full Screen Generated Celebration Page const handleOpenCelebrationPage = (celebration: CelebrationData) => { fetch(`/api/celebrations/${celebration.id}/view`, { method: 'PATCH' }).catch(console.error); // Increment view count setCelebrations((prev) => prev.map((c) => (c.id === celebration.id ? { ...c, viewsCount: (c.viewsCount || 0) + 1 } : c)) ); setActiveCelebrationView(celebration); setActiveTab('celebration'); window.scrollTo({ top: 0, behavior: 'smooth' }); }; const handleDeleteCelebration = (id: string) => { fetch(`/api/celebrations/${id}`, { method: 'DELETE' }).catch(console.error); setCelebrations((prev) => prev.filter((c) => c.id !== id)); }; // Full-Screen Standalone Celebration Page View if (activeTab === 'celebration' && activeCelebrationView) { return ( <ToastProvider> <CelebrationPage celebration={activeCelebrationView} onBackToHome={() => { setActiveCelebrationView(null); setActiveTab('home'); }} onCreateNew={() => { setActiveCelebrationView(null); setActiveTab('explore'); }} /> </ToastProvider> ); } return ( <ToastProvider> <div className="min-h-screen bg-transparent text-[#4e220f] flex flex-col justify-between selection:bg-[#9d6638] selection:text-[#f7f1de] transition-colors"> {/* Navigation Bar */} <Navbar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onOpenLogin={() => setIsLoginModalOpen(true)} onStartCreate={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /> {/* Main Body Pages */} <main className="flex-1"> <AnimatePresence mode="wait"> <motion.div key={activeTab} initial={{ opacity: 0, y: 10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -10, scale: 0.98 }} transition={{ type: 'spring', bounce: 0.4, duration: 0.5 }} className="h-full" > {activeTab === 'home' && ( <HomeView templates={templates} onViewDemo={handleViewDemo} onUseTemplate={handleUseTemplate} onExplore={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onSelectCategory={handleSelectCategory} onStartCreate={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /> )} {activeTab === 'explore' && ( <ExploreView templates={templates} onViewDemo={handleViewDemo} onUseTemplate={handleUseTemplate} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} /> )} {activeTab === 'wizard' && selectedTemplate && ( <PersonalizationWizard template={selectedTemplate} onBack={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onGenerated={handleCelebrationGenerated} /> )} {activeTab === 'success' && generatedCelebration && ( <SuccessView celebration={generatedCelebration} onOpenCelebration={handleOpenCelebrationPage} onCreateAnother={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} onViewMyCelebrations={() => { setActiveTab('my-celebrations'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /> )} {activeTab === 'my-celebrations' && ( <MyCelebrationsView celebrations={celebrations} onOpenCelebration={handleOpenCelebrationPage} onEditCelebration={(item) => { const tpl = templates.find((t) => t.id === item.templateId) || templates[0]; handleUseTemplate(tpl); }} onDeleteCelebration={handleDeleteCelebration} onCreateNew={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /> )} {activeTab === 'pricing' && ( <PricingView onSelectPlan={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /> )} {activeTab === 'how-it-works' && ( <HowItWorksView onStartExplore={() => { setActiveTab('explore'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} /> )} </motion.div> </AnimatePresence> </main> {/* Footer */} <Footer setActiveTab={setActiveTab} onOpenLogin={() => setIsLoginModalOpen(true)} /> {/* Global Modals */} <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} /> <TemplatePreviewModal isOpen={isPreviewModalOpen} onClose={() => setIsPreviewModalOpen(false)} template={selectedTemplate} onUseTemplate={handleUseTemplate} /> </div> </ToastProvider> );
}

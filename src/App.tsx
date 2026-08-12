import React, { useState, useEffect } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import AdminRoutes from "./admin/routes";
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
import { useAuth } from "./lib/AuthContext";
import {
  fetchUserCelebrations,
  deleteCelebration,
  incrementViewCount,
  fetchTemplates,
} from "./lib/celebrations";
import InteractiveChallengePage from "./components/interactive/InteractiveChallengePage";
import InteractiveSurpriseCreator from "./components/interactive/InteractiveSurpriseCreator";

// Wrapper that reads :id from URL and renders the challenge player
function UnlockRouteWrapper() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <div className="min-h-screen bg-[#0f0f14] flex items-center justify-center text-white">Invalid link</div>;
  return <InteractiveChallengePage instanceId={id} />;
}

export default function App() {
  const { currentUser } = useAuth();

  const [activeTab, setActiveTab] = useState<string>("home");
  const [templates, setTemplates] = useState<Template[]>(TEMPLATES);
  const [celebrations, setCelebrations] = useState<CelebrationData[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | "all">("all");
  const [generatedCelebration, setGeneratedCelebration] = useState<CelebrationData | null>(null);
  const [activeCelebrationView, setActiveCelebrationView] = useState<CelebrationData | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  // Load templates from Firestore on mount (seeds if empty)
  useEffect(() => {
    fetchTemplates()
      .then((data) => {
        // Filter out archived templates for regular users
        const activeTemplates = data.filter(t => t.status !== 'archived');
        setTemplates(activeTemplates);
      })
      .catch((err) => console.error("Failed to load templates:", err));
  }, []);

  // Load celebrations from Firestore/localStorage when user logs in/out or as guest or switches tabs
  useEffect(() => {
    const uid = currentUser ? currentUser.uid : "guest";
    fetchUserCelebrations(uid)
      .then(setCelebrations)
      .catch((err) => console.error("Failed to fetch celebrations:", err));
  }, [currentUser, activeTab]);

  const handleViewDemo = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(true);
  };

  const handleUseTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setIsPreviewModalOpen(false);
    setActiveTab("wizard");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectCategory = (cat: CategoryId) => {
    setSelectedCategory(cat);
    setActiveTab("explore");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCelebrationGenerated = (celebration: CelebrationData) => {
    setCelebrations((prev) => [celebration, ...prev]);
    setGeneratedCelebration(celebration);
    setActiveTab("success");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenCelebrationPage = (celebration: CelebrationData) => {
    // Increment view in Firestore (best-effort, don't block UI)
    incrementViewCount(celebration.id).catch(console.error);
    setCelebrations((prev) =>
      prev.map((c) =>
        c.id === celebration.id ? { ...c, viewsCount: (c.viewsCount || 0) + 1 } : c
      )
    );
    setActiveCelebrationView(celebration);
    setActiveTab("celebration");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteCelebration = (id: string) => {
    // Delete from Firestore (best-effort)
    deleteCelebration(id).catch(console.error);
    setCelebrations((prev) => prev.filter((c) => c.id !== id));
  };

  const navigateTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Full-screen celebration page
  if (activeTab === "celebration" && activeCelebrationView) {
    return (
      <ToastProvider>
        <CelebrationPage
          celebration={activeCelebrationView}
          onBackToHome={() => {
            setActiveCelebrationView(null);
            navigateTo("home");
          }}
          onCreateNew={() => {
            setActiveCelebrationView(null);
            navigateTo("explore");
          }}
        />
      </ToastProvider>
    );
  }

return (
  <Routes>
    <Route path="/admin/*" element={<AdminRoutes />} />
    <Route path="/unlock/:id" element={<UnlockRouteWrapper />} />
    <Route path="/w/:slug" element={<CelebrationPage />} />
    <Route path="*" element={
      <ToastProvider>
        <div className="min-h-screen bg-transparent text-[#4e220f] flex flex-col justify-between selection:bg-[#9d662f] selection:text-[#f7f1de] transition-colors">
          {/* Navigation Bar */}
          <Navbar
            activeTab={activeTab}
            setActiveTab={navigateTo}
            onOpenLogin={() => setIsLoginModalOpen(true)}
            onStartCreate={() => navigateTo("explore")}
            currentUser={currentUser}
          />

          {/* Main Content */}
          <main className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.98 }}
                transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
                className="h-full"
              >
                {activeTab === "home" && (
                  <HomeView
                    templates={templates}
                    onViewDemo={handleViewDemo}
                    onUseTemplate={handleUseTemplate}
                    onExplore={() => navigateTo("explore")}
                    onSelectCategory={handleSelectCategory}
                    onStartCreate={() => navigateTo("explore")}
                  />
                )}

                {activeTab === "explore" && (
                  <ExploreView
                    templates={templates}
                    onViewDemo={handleViewDemo}
                    onUseTemplate={handleUseTemplate}
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                    onCreateSurpriseChallenge={() => {
                      setIsCreatorOpen(true);
                    }}
                  />
                )}

                {activeTab === "wizard" && selectedTemplate && (
                  <PersonalizationWizard
                    template={selectedTemplate}
                    onBack={() => navigateTo("explore")}
                    onGenerated={handleCelebrationGenerated}
                  />
                )}

                {activeTab === "success" && generatedCelebration && (
                  <SuccessView
                    celebration={generatedCelebration}
                    onOpenCelebration={handleOpenCelebrationPage}
                    onCreateAnother={() => navigateTo("explore")}
                    onViewMyCelebrations={() => navigateTo("my-celebrations")}
                  />
                )}

                {activeTab === "my-celebrations" && (
                  <MyCelebrationsView
                    celebrations={celebrations}
                    onOpenCelebration={handleOpenCelebrationPage}
                    onEditCelebration={(item) => {
                      const tpl = templates.find((t) => t.id === item.templateId) || templates[0];
                      handleUseTemplate(tpl);
                    }}
                    onDeleteCelebration={handleDeleteCelebration}
                    onCreateNew={() => navigateTo("explore")}
                    isLoggedIn={!!currentUser}
                    onOpenLogin={() => setIsLoginModalOpen(true)}
                  />
                )}

                {activeTab === "pricing" && (
                  <PricingView onSelectPlan={() => navigateTo("explore")} />
                )}

                {activeTab === "how-it-works" && (
                  <HowItWorksView onStartExplore={() => navigateTo("explore")} />
                )}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Footer */}
          <Footer
            setActiveTab={setActiveTab}
            onOpenLogin={() => setIsLoginModalOpen(true)}
          />

          {/* Global Modals */}
          <LoginModal
            isOpen={isLoginModalOpen}
            onClose={() => setIsLoginModalOpen(false)}
            onSuccess={() => {
              // After login, navigate to My Celebrations if they were trying to access it
            }}
          />
          <TemplatePreviewModal
            isOpen={isPreviewModalOpen}
            onClose={() => setIsPreviewModalOpen(false)}
            template={selectedTemplate}
            onUseTemplate={handleUseTemplate}
          />
          {isCreatorOpen && (
            <InteractiveSurpriseCreator onClose={() => setIsCreatorOpen(false)} />
          )}
        </div>
      </ToastProvider>
    } />
  </Routes>
);

}

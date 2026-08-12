import React, { useState } from "react";
import { PRICING_PLANS, FAQS } from "../data/mockData";
import {
  Check,
  Sparkles,
  ChevronDown,
  ChevronUp,
  HelpCircle,
} from "lucide-react";
import { useToast } from "../components/common/Toast";
interface PricingViewProps {
  onSelectPlan: (planId: string) => void;
}
export const PricingView: React.FC<PricingViewProps> = ({ onSelectPlan }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { showToast } = useToast();
  const handlePlanClick = (planName: string, planId: string) => {
    showToast(
      `Selected ${planName} Plan! 🎉`,
      "Enjoy crafting digital wish pages.",
    );
    onSelectPlan(planId);
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {" "}
      {/* Header */}{" "}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        {" "}
        <span className="text-xs font-bold text-[#9d6638] uppercase tracking-widest">
          {" "}
          Transparent Pricing{" "}
        </span>{" "}
        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#4e220f] tracking-tight">
          {" "}
          Simple Plans for Every Celebration{" "}
        </h1>{" "}
        <p className="text-sm sm:text-base text-[#4e220f] ">
          {" "}
          Start for free or upgrade to Pro for custom music, password
          protection, and unlimited photo galleries.{" "}
        </p>{" "}
      </div>{" "}
      {/* Pricing Cards Grid */}{" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {" "}
        {PRICING_PLANS.map((plan) => (
          <div
            key={plan.id}
            className={`relative rounded-3xl p-8 border flex flex-col justify-between transition-all ${plan.isPopular ? "bg-[#1A1A1A] text-white border-[#b0ba99] shadow-2xl scale-105 z-10" : "bg-white/60 text-[#4e220f] border-[#b0ba99] shadow-sm"}`}
          >
            {" "}
            {plan.isPopular && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#9d6638] text-white text-xs font-bold shadow-md flex items-center gap-1">
                {" "}
                <Sparkles className="w-3.5 h-3.5" />{" "}
                <span>{plan.badge}</span>{" "}
              </div>
            )}{" "}
            <div className="space-y-6">
              {" "}
              <div>
                {" "}
                <h3 className="text-xl font-bold">{plan.name}</h3>{" "}
                <p
                  className={`text-xs mt-1 ${plan.isPopular ? "text-[#4e220f]" : "text-[#4e220f]"}`}
                >
                  {" "}
                  {plan.description}{" "}
                </p>{" "}
              </div>{" "}
              <div className="flex items-baseline gap-1">
                {" "}
                <span className="text-4xl font-black tracking-tight">
                  {plan.price}
                </span>{" "}
                <span
                  className={`text-xs ${plan.isPopular ? "text-[#4e220f]" : "text-[#4e220f]"}`}
                >
                  {" "}
                  / {plan.period}{" "}
                </span>{" "}
              </div>{" "}
              {/* Feature list */}{" "}
              <ul className="space-y-3 pt-4 border-t border-[#b0ba99] text-xs">
                {" "}
                {plan.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    {" "}
                    <Check
                      className={`w-4 h-4 shrink-0 ${plan.isPopular ? "text-[#9d6638]" : "text-[#9d6638]"}`}
                    />{" "}
                    <span className="leading-snug">{feat}</span>{" "}
                  </li>
                ))}{" "}
              </ul>{" "}
            </div>{" "}
            <button
              onClick={() => handlePlanClick(plan.name, plan.id)}
              className={`mt-8 w-full py-3.5 px-4 rounded-xl font-bold text-xs shadow-md transition-all ${plan.isPopular ? "bg-[#9d6638] hover:bg-[#6D28D9] text-white hover:scale-[1.02]" : "bg-white/60/60 text-white hover:bg-black"}`}
            >
              {" "}
              {plan.ctaText}{" "}
            </button>{" "}
          </div>
        ))}{" "}
      </div>{" "}
      {/* FAQs Section */}{" "}
      <div className="max-w-3xl mx-auto space-y-6 pt-10">
        {" "}
        <div className="text-center space-y-2">
          {" "}
          <div className="inline-flex items-center gap-1 text-xs font-bold text-[#9d6638] uppercase tracking-widest">
            {" "}
            <HelpCircle className="w-4 h-4" /> <span>Got Questions?</span>{" "}
          </div>{" "}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#4e220f] ">
            {" "}
            Frequently Asked Questions{" "}
          </h2>{" "}
        </div>{" "}
        <div className="space-y-3">
          {" "}
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white/60 rounded-2xl border border-[#b0ba99] overflow-hidden shadow-sm"
              >
                {" "}
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm text-[#4e220f] flex items-center justify-between gap-4"
                >
                  {" "}
                  <span>{faq.question}</span>{" "}
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#9d6638] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#4e220f] shrink-0" />
                  )}{" "}
                </button>{" "}
                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-[#4e220f] leading-relaxed border-t border-[#b0ba99] pt-3">
                    {" "}
                    {faq.answer}{" "}
                  </div>
                )}{" "}
              </div>
            );
          })}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
};

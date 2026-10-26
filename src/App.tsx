import { useState, useEffect } from 'react';
import { STEPS } from './data';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';
import Step5 from './steps/Step5';
import Step6 from './steps/Step6';
import Step7 from './steps/Step7';
import Step8 from './steps/Step8';
import Step9 from './steps/Step9';
import Step10 from './steps/Step10';

export default function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);
  const [showCheatSheet, setShowCheatSheet] = useState(false);

  // Mark step completed
  useEffect(() => {
    setCompletedSteps((prev) => (prev.includes(currentStep) ? prev : [...prev, currentStep]));
  }, [currentStep]);

  const activeStepConfig = STEPS.find((s) => s.id === currentStep) || STEPS[0];
  const progressPercent = Math.round((currentStep / STEPS.length) * 100);

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep((c) => c + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((c) => c - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setCompletedSteps([1]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 border-b border-navy-800 bg-navy-950/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl filter drop-shadow">🎃</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-tight text-white sm:text-base">
                  From $66 to $0
                </h1>
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 font-mono hidden sm:inline-block">
                  Breaking the Coupon Flow
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Intigriti October 2026 Challenge Lab</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCheatSheet(!showCheatSheet)}
              className="px-3 py-1.5 rounded-lg border border-navy-700 bg-navy-900 text-xs text-slate-300 hover:text-white hover:border-navy-600 transition-colors flex items-center gap-1.5"
            >
              <span>📋</span>
              <span className="hidden sm:inline">Cheat Sheet</span>
            </button>
            <button
              onClick={handleRestart}
              className="px-3 py-1.5 rounded-lg border border-navy-700 bg-navy-900 text-xs text-slate-400 hover:text-slate-200 hover:border-navy-600 transition-colors flex items-center gap-1.5"
              title="Restart Walkthrough"
            >
              <span>↺</span>
              <span className="hidden sm:inline">Restart</span>
            </button>
          </div>
        </div>

        {/* Global Progress Line */}
        <div className="w-full bg-navy-900 h-1">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </header>

      {/* Quick Cheatsheet Slide-over Modal / Drawer */}
      {showCheatSheet && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-navy-900 border-l border-navy-700 p-6 overflow-y-auto space-y-5 animate-slide-in">
            <div className="flex items-center justify-between border-b border-navy-800 pb-3">
              <h3 className="font-bold text-white flex items-center gap-2">
                <span>📋</span> Challenge Cheatsheet
              </h3>
              <button
                onClick={() => setShowCheatSheet(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 space-y-1">
                <span className="text-slate-400 block font-sans font-semibold">Target Environment</span>
                <div className="text-cyan-300 select-all">https://challenge-1026.challenges.intigriti.io</div>
              </div>

              <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 space-y-1">
                <span className="text-slate-400 block font-sans font-semibold">User Balance &amp; Target Item</span>
                <div>Initial Credit: <span className="text-emerald-400 font-bold">€66.00</span> (6600 cents)</div>
                <div>Midnight Vault: <span className="text-rose-400 font-bold">€666.00</span> (66600 cents)</div>
                <div>Price Deficit: <span className="text-amber-400">€600.00</span></div>
              </div>

              <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 space-y-2">
                <span className="text-slate-400 block font-sans font-semibold">Discovered Coupon Codes</span>
                <div className="flex justify-between items-center py-1 border-b border-navy-900">
                  <span className="text-white font-bold">NIGHT20</span>
                  <span className="text-cyan-400">20% discount (Banner code)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-white font-bold">NEWS30</span>
                  <span className="text-cyan-400">30% discount (Newsletter code)</span>
                </div>
              </div>

              <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 space-y-1">
                <span className="text-slate-400 block font-sans font-semibold">Vulnerability Taxonomy</span>
                <div className="text-slate-300">CWE-840: Business Logic Errors (Coupon Alternation &amp; Stacking Flaw)</div>
                <div className="text-slate-300">CWE-672: Improper State Tracking Across Coupon Swaps</div>
              </div>

              <div className="p-3 bg-navy-950 rounded-lg border border-navy-800 space-y-1">
                <span className="text-slate-400 block font-sans font-semibold">Official Flag</span>
                <div className="text-emerald-400 select-all font-bold">INTIGRITI&#123;094638e6-ba2f-4c50-8bb4-41ced0d5debd&#125;</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 w-full space-y-8">
        {/* Step Navigation Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Step {currentStep} of {STEPS.length}
            </span>
            <span>{progressPercent}% Complete</span>
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-thin">
            {STEPS.map((step) => {
              const isCurrent = step.id === currentStep;
              const isPast = completedSteps.includes(step.id) && !isCurrent;
              return (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`flex-1 min-w-[70px] sm:min-w-[85px] py-2 px-1.5 rounded-lg border text-center transition-all ${
                    isCurrent
                      ? 'border-cyan-500 bg-cyan-950/60 text-white shadow-sm shadow-cyan-900/50 ring-1 ring-cyan-500/50'
                      : isPast
                      ? 'border-emerald-800/60 bg-emerald-950/20 text-emerald-400 hover:border-emerald-700'
                      : 'border-navy-800 bg-navy-900/40 text-slate-500 hover:border-navy-700 hover:text-slate-400'
                  }`}
                >
                  <div className="text-base mb-0.5">{step.icon}</div>
                  <div className="text-[10px] font-mono font-bold truncate">Step {step.id}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step Heading Card */}
        <div className="p-6 rounded-2xl border border-navy-700/80 bg-gradient-to-r from-navy-900/90 via-navy-900/60 to-charcoal-900/90 backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-2xl shadow-inner">
              {activeStepConfig.icon}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 rounded bg-cyan-900/40 border border-cyan-700/50 text-[10px] font-bold text-cyan-300 uppercase tracking-widest">
                  {activeStepConfig.subtitle}
                </span>
                <span className="text-xs text-slate-500">Estimated: ~2 min</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Step {activeStepConfig.id}: {activeStepConfig.title}
              </h2>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <section className="bg-navy-900/40 border border-navy-800/80 rounded-2xl p-6 sm:p-8 backdrop-blur-xs shadow-xl">
          {currentStep === 1 && <Step1 />}
          {currentStep === 2 && <Step2 />}
          {currentStep === 3 && <Step3 />}
          {currentStep === 4 && <Step4 />}
          {currentStep === 5 && <Step5 />}
          {currentStep === 6 && <Step6 />}
          {currentStep === 7 && <Step7 />}
          {currentStep === 8 && <Step8 />}
          {currentStep === 9 && <Step9 />}
          {currentStep === 10 && <Step10 />}
        </section>

        {/* Bottom Pagination Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-navy-800">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
              currentStep === 1
                ? 'border-navy-800 bg-navy-950 text-slate-600 cursor-not-allowed'
                : 'border-navy-700 bg-navy-900 text-slate-300 hover:text-white hover:bg-navy-800'
            }`}
          >
            ← Previous Step
          </button>

          <span className="text-xs text-slate-500 hidden sm:inline">
            Use the buttons or top stepper to navigate freely
          </span>

          {currentStep < STEPS.length ? (
            <button
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold shadow-lg shadow-cyan-950/50 transition-all flex items-center gap-2"
            >
              Next Step →
            </button>
          ) : (
            <button
              onClick={handleRestart}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2"
            >
              ↺ Restart Walkthrough
            </button>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-navy-800 bg-navy-950/80 py-6 mt-12 text-center text-xs text-slate-500">
        <p className="max-w-xl mx-auto px-4">
          Built for the <strong className="text-slate-400">Intigriti October 2026 Community Challenge</strong>.
          An interactive case study in web application security, business logic flaws, and concurrency testing.
        </p>
      </footer>
    </div>
  );
}

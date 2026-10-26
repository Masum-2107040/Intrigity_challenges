import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, CodeBlock, Badge } from '../components/ui';

export default function Step10() {
  const [selectedFix, setSelectedFix] = useState<'set' | 'authoritative' | 'caps'>('set');

  // Mini quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number | null>>({ 1: null, 2: null });
  const [showQuizResults, setShowQuizResults] = useState(false);

  const quizQuestions = [
    {
      id: 1,
      question: 'Why did alternating between NIGHT20 and NEWS30 bypass the "Coupon already applied" check?',
      options: [
        'The server only checked if the requested coupon was identical to the currently active code, forgetting previous ones upon swapping',
        'The browser cached the coupon codes and sent fake HTTP requests',
        'NIGHT20 and NEWS30 had conflicting MD5 hashes in the database',
        'The coupons expired after 5 seconds',
      ],
      correctIndex: 0,
      explanation: 'The server tracked only `lastAppliedCoupon` or checked the currently active promotion instead of maintaining an immutable historical Set of all coupons ever applied during the cart session.',
    },
    {
      id: 2,
      question: 'What is the most secure method for calculating cart totals with promotions?',
      options: [
        'Continuously subtract discounts from the mutable running total in the session',
        'Recompute total authoritatively from the original base price: Base × (1 - Best Promo %)',
        'Check that the client sends a valid coupon header',
        'Allow unlimited coupon stacking as long as they come from different sources',
      ],
      correctIndex: 1,
      explanation: 'Authoritative recalculation re-derives the final price from scratch using trusted server-side base prices and applicable rules, preventing compounding calculation errors.',
    },
  ];

  const handleSelectOption = (qId: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        We summarize the defensive engineering principles that protect e-commerce platforms from <strong className="text-cyan-400">coupon alternation</strong>,
        <strong className="text-amber-400"> improper state clearing</strong>, and <strong className="text-white">compounding discount vulnerabilities</strong>.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        Business logic flaws can be completely eliminated with rigorous design patterns.
        By replacing mutable variables with immutable history sets and calculating prices authoritatively, these flaws cannot recur.
      </Callout>

      <SectionLabel icon="🛡️">Actionable Remediations</SectionLabel>

      {/* Tabs */}
      <div className="flex border-b border-navy-700 gap-4 mb-4">
        <button
          onClick={() => setSelectedFix('set')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            selectedFix === 'set'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          1. Immutable Redeemed Coupon Set
        </button>
        <button
          onClick={() => setSelectedFix('authoritative')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            selectedFix === 'authoritative'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          2. Authoritative Recalculation
        </button>
        <button
          onClick={() => setSelectedFix('caps')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            selectedFix === 'caps'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          3. Stacking Policy &amp; Caps
        </button>
      </div>

      <Card>
        {selectedFix === 'set' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Track Full Historical Redemptions</h4>
              <Badge color="emerald">State Integrity</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Never check only the previous or active coupon. Maintain an append-only historical Set of all applied coupons.
            </p>
            <CodeBlock language="typescript">
{`// Secure Cart State Model
interface CartSession {
  items: CartItem[];
  activeCoupon: string | null;
  redeemedCouponsHistory: Set<string>; // Persistent set across entire session
}

function applyCoupon(cart: CartSession, code: string) {
  // Reject if the code was EVER applied in this cart session
  if (cart.redeemedCouponsHistory.has(code)) {
    throw new Error("This coupon has already been redeemed in this session.");
  }

  // Record into persistent history
  cart.redeemedCouponsHistory.add(code);
  cart.activeCoupon = code;
  recalculateCart(cart);
}`}
            </CodeBlock>
          </div>
        )}

        {selectedFix === 'authoritative' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Authoritative Recalculation From Base</h4>
              <Badge color="cyan">Deterministic Pricing</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Do not modify running total incrementally. Recalculate directly from catalog base prices on every request.
            </p>
            <CodeBlock language="typescript">
{`// Authoritative Cart Pricing Engine
function recalculateCart(cart: CartSession) {
  // 1. Authoritative base sum from trusted product catalog
  const subtotal = cart.items.reduce((sum, item) => {
    const product = ProductCatalog.get(item.id);
    return sum + (product.price * item.quantity);
  }, 0);

  // 2. Only allow single active coupon or valid promotion
  let discountAmount = 0;
  if (cart.activeCoupon) {
    const promo = PromoCatalog.get(cart.activeCoupon);
    discountAmount = Math.round(subtotal * (promo.percent / 100));
  }

  // 3. Final total is strictly bounded
  cart.subtotal = subtotal;
  cart.discount = discountAmount;
  cart.total = Math.max(0, subtotal - discountAmount);
}`}
            </CodeBlock>
          </div>
        )}

        {selectedFix === 'caps' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-white">Global Business Caps &amp; Non-Stacking</h4>
              <Badge color="amber">Commercial Guardrail</Badge>
            </div>
            <p className="text-xs text-slate-400">
              Enforce explicit policies regarding whether coupons stack and set hard maximum percentage ceilings.
            </p>
            <CodeBlock language="typescript">
{`// Defensive Promotion Safeguards
const MAX_TOTAL_DISCOUNT_PERCENT = 30; // Max 30% savings allowed
const ALLOW_MULTIPLE_PROMOTIONS = false;

function validatePromotions(promotions: Promotion[]) {
  if (!ALLOW_MULTIPLE_PROMOTIONS && promotions.length > 1) {
    throw new Error("Coupons cannot be combined. Highest value coupon applied.");
  }

  const totalDiscount = promotions.reduce((acc, p) => acc + p.percent, 0);
  return Math.min(totalDiscount, MAX_TOTAL_DISCOUNT_PERCENT);
}`}
            </CodeBlock>
          </div>
        )}
      </Card>

      <SectionLabel icon="📝">Interactive Knowledge Check</SectionLabel>
      <Card className="space-y-5">
        <div>
          <h4 className="font-semibold text-white">Test Your Understanding</h4>
          <p className="text-xs text-slate-400">Confirm the key takeaways from the coupon swap case study.</p>
        </div>

        <div className="space-y-5">
          {quizQuestions.map((q) => (
            <div key={q.id} className="p-4 rounded-lg bg-navy-950/70 border border-navy-800 space-y-3">
              <p className="text-sm font-semibold text-slate-200">
                <span className="text-cyan-400 font-mono mr-2">Q{q.id}.</span>{q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, idx) => {
                  const isSelected = quizAnswers[q.id] === idx;
                  const isCorrect = idx === q.correctIndex;
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(q.id, idx)}
                      className={`w-full text-left p-3 rounded text-xs transition-all flex items-center justify-between ${
                        isSelected
                          ? showQuizResults
                            ? isCorrect
                              ? 'bg-emerald-950/60 border border-emerald-500 text-emerald-300'
                              : 'bg-red-950/60 border border-red-500 text-red-300'
                            : 'bg-cyan-950/50 border border-cyan-500 text-cyan-200'
                          : showQuizResults && isCorrect
                          ? 'bg-emerald-950/40 border border-emerald-700/60 text-emerald-400'
                          : 'bg-navy-900 border border-navy-800 text-slate-400 hover:border-navy-700'
                      }`}
                    >
                      <span>{opt}</span>
                      {showQuizResults && isCorrect && <span className="text-emerald-400 font-bold ml-2">✓ Correct</span>}
                    </button>
                  );
                })}
              </div>

              {showQuizResults && (
                <div className="p-3 bg-navy-900 rounded border border-navy-800 text-xs text-slate-300">
                  <span className="text-cyan-400 font-bold mr-1">Explanation:</span> {q.explanation}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={() => setShowQuizResults(!showQuizResults)}
            className="px-5 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors"
          >
            {showQuizResults ? 'Hide Answers' : 'Check Answers'}
          </button>
        </div>
      </Card>

      <RevealBlock label="Show summary takeaways">
        <div className="space-y-4">
          <Callout tone="success" title="Core Takeaway: State Integrity">
            <ul className="list-disc list-inside space-y-1.5 text-slate-300 text-sm">
              <li><strong>Track historical redemptions in a persistent Set</strong>, not a single ephemeral variable.</li>
              <li><strong>Always recalculate totals authoritatively</strong> directly from trusted product catalog pricing.</li>
              <li><strong>Enforce hard discount caps</strong> to prevent unexpected combinations from zeroing out cart amounts.</li>
              <li><strong>Validate all business rules server-side</strong> prior to order placement.</li>
            </ul>
          </Callout>
        </div>
      </RevealBlock>
    </div>
  );
}

import { Card, Callout, SectionLabel } from '../components/ui';
import SimulatedCart from '../components/SimulatedCart';
import { PRODUCT, formatEuro, CREDIT } from '../data';

export default function Step1() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        Before testing anything, a security researcher examines the application to understand its features,
        constraints, and business rules. This is <strong className="text-white">reconnaissance</strong> — the
        foundation of any security assessment.
      </p>

      <Callout tone="info" title="The scenario">
        A Halloween-themed candy store offers a premium product called <strong>The Midnight Collection</strong>,
        priced at <strong className="text-white">{formatEuro(PRODUCT.price)}</strong>. Your account has only{' '}
        <strong className="text-white">{formatEuro(CREDIT)}</strong> in store credit. The challenge: find a way
        to purchase this product.
      </Callout>

      <SectionLabel icon="🧪">Try it yourself</SectionLabel>
      <p className="text-sm text-slate-400 mb-3">
        Inspect the simulated product and cart below. Notice the gap between the price and your available credit.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Card */}
        <Card>
          <div className="flex items-start justify-between mb-4">
            <div>
              <span className="inline-block px-2 py-0.5 rounded-full bg-amber-900/40 text-amber-400 text-xs font-semibold border border-amber-700/50 mb-2">
                {PRODUCT.badge}
              </span>
              <h3 className="text-lg font-bold text-white">{PRODUCT.name}</h3>
              <p className="text-sm text-slate-400 mt-0.5">{PRODUCT.subtitle}</p>
            </div>
            <span className="text-2xl font-bold font-mono text-red-400">{formatEuro(PRODUCT.price)}</span>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed">{PRODUCT.description}</p>
          <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
            <span>📦 {PRODUCT.weight}</span>
            <span>🏷️ {PRODUCT.category}</span>
          </div>
        </Card>

        {/* Cart Preview */}
        <SimulatedCart coupons={[]} showCheckout />
      </div>

      <SectionLabel icon="📝">What we observe</SectionLabel>
      <div className="space-y-3">
        <div className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 text-cyan-400">▸</span>
          <p className="text-slate-300">The product costs <strong className="text-white">10× more</strong> than the available credit.</p>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 text-cyan-400">▸</span>
          <p className="text-slate-300">Checkout is blocked: the button says <em>"Still needed: €600.00"</em>.</p>
        </div>
        <div className="flex items-start gap-3 text-sm">
          <span className="mt-0.5 text-cyan-400">▸</span>
          <p className="text-slate-300">The store has a coupon input field, an announcement banner mentioning <code className="bg-navy-700 px-1.5 py-0.5 rounded text-cyan-400 text-xs">NIGHT20</code>, and a newsletter signup in the footer.</p>
        </div>
      </div>

      <SectionLabel icon="🔑">Security takeaway</SectionLabel>
      <Callout tone="info">
        Reconnaissance is not about finding a vulnerability immediately. It's about mapping the
        application's attack surface: inputs, features, business rules, and trust boundaries. Every
        interactive element — coupons, newsletter signups, cart operations — is a potential target
        for testing.
      </Callout>
    </div>
  );
}

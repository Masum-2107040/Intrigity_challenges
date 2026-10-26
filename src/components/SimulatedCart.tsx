import { PRODUCT, formatEuro, type Coupon } from '../data';

interface Props {
  coupons: Coupon[];
  subtotal?: number;
  credit?: number;
  showCheckout?: boolean;
  checkedOut?: boolean;
  compact?: boolean;
}

export default function SimulatedCart({
  coupons,
  subtotal = PRODUCT.price,
  credit = 6600,
  showCheckout = false,
  checkedOut = false,
  compact = false,
}: Props) {
  let totalDiscount = 0;
  for (const c of coupons) {
    totalDiscount += Math.round(subtotal * (c.percent / 100));
  }
  const total = Math.max(0, subtotal - totalDiscount);
  const canCheckout = total <= credit;

  return (
    <div className={`rounded-xl border border-navy-700 bg-charcoal-900 overflow-hidden ${compact ? 'text-sm' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-navy-700 bg-charcoal-800">
        <div className="flex items-center gap-2">
          <span className="text-base">🛒</span>
          <span className="font-semibold text-slate-300">Order Summary</span>
        </div>
        {checkedOut && (
          <span className="px-2 py-0.5 rounded-full bg-emerald-900/50 text-emerald-400 text-xs font-bold border border-emerald-700/50">
            ✓ Completed
          </span>
        )}
      </div>

      <div className="p-4 space-y-3">
        {/* Product */}
        <div className="flex justify-between items-start">
          <div>
            <p className="font-medium text-slate-200">{PRODUCT.name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{PRODUCT.weight} · {PRODUCT.category}</p>
          </div>
          <span className="font-mono font-semibold text-slate-300">{formatEuro(subtotal)}</span>
        </div>

        <div className="border-t border-navy-700" />

        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Subtotal</span>
          <span className="font-mono text-slate-300">{formatEuro(subtotal)}</span>
        </div>

        {/* Coupons */}
        {coupons.length > 0 && (
          <div className="space-y-2">
            {coupons.map((c, i) => {
              const amount = Math.round(subtotal * (c.percent / 100));
              return (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {c.code} ({c.percent}% off)
                  </span>
                  <span className="font-mono text-emerald-400">-{formatEuro(amount)}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Discount total */}
        {totalDiscount > 0 && (
          <>
            <div className="border-t border-navy-700" />
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Total discount</span>
              <span className="font-mono text-emerald-400 font-semibold">-{formatEuro(totalDiscount)}</span>
            </div>
          </>
        )}

        <div className="border-t border-navy-700" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="font-semibold text-slate-200">Total</span>
          <span className={`font-mono text-lg font-bold ${total === 0 ? 'text-emerald-400' : total <= credit ? 'text-cyan-400' : 'text-red-400'}`}>
            {formatEuro(total)}
          </span>
        </div>

        {/* Credit */}
        <div className="flex justify-between text-sm">
          <span className="text-slate-400">Available credit</span>
          <span className="font-mono text-slate-300">{formatEuro(credit)}</span>
        </div>

        {/* Checkout */}
        {showCheckout && (
          <>
            <div className="border-t border-navy-700" />
            {checkedOut ? (
              <div className="text-center py-2">
                <p className="text-emerald-400 font-semibold">✓ Order completed successfully</p>
                <p className="text-xs text-slate-500 mt-1">Paid with store credit</p>
              </div>
            ) : canCheckout ? (
              <div className="text-center py-1">
                <div className="px-4 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold text-sm cursor-default">
                  Complete order
                </div>
                <p className="text-xs text-emerald-400/70 mt-1.5">Total covered by credit</p>
              </div>
            ) : (
              <div className="text-center py-1">
                <div className="px-4 py-2.5 rounded-lg bg-navy-700 text-slate-500 font-semibold text-sm cursor-not-allowed">
                  Still needed: {formatEuro(Math.max(0, total - credit))}
                </div>
                <p className="text-xs text-red-400/70 mt-1.5">Insufficient credit</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

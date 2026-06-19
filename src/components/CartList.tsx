import { ShoppingBag, X, Trash2, Plus, Minus, Tag, Check, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { CartItem } from '../types';

interface CartListProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQty: (productId: string, weight: string, newQty: number) => void;
  onRemoveItem: (productId: string, weight: string) => void;
  couponApplied: { code: string; discountType: string; value: number } | null;
  onApplyCoupon: (coupon: any) => void;
  onRemoveCoupon: () => void;
  onTriggerCheckoutTab: () => void;
}

export default function CartList({
  isOpen,
  onClose,
  cartItems,
  onUpdateQty,
  onRemoveItem,
  couponApplied,
  onApplyCoupon,
  onRemoveCoupon,
  onTriggerCheckoutTab,
}: CartListProps) {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculatings
  const calculateSubtotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();

  // Discount calculation
  let discount = 0;
  if (couponApplied) {
    if (couponApplied.discountType === 'percentage') {
      discount = Math.round((subtotal * couponApplied.value) / 100);
    } else {
      discount = couponApplied.value;
    }
  }

  const tax = Math.round((subtotal - discount) * 0.05); // 5% GST
  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 5; // Free delivery above $50
  const total = Math.max(0, subtotal - discount + tax + deliveryFee);

  const handleApplyCouponClick = async () => {
    setCouponError(null);
    if (!couponCodeInput.trim()) return;

    try {
      const response = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: couponCodeInput.toUpperCase(),
          cartSubtotal: subtotal,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        onApplyCoupon(data.coupon);
        setCouponCodeInput('');
      } else {
        setCouponError(data.error || "Invalid coupon validation");
      }
    } catch (err) {
      setCouponError("Coupon service temporarily unresponsive.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans" id="sweet-delights-cart-list-drawer">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] dark:bg-stone-950 shadow-2xl flex flex-col h-full border-l border-brand-brown/10">
          
          {/* Cart Header */}
          <div className="px-4 sm:px-6 py-5 bg-brand-brown text-white flex items-center justify-between border-b border-brand-gold/10">
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-5 h-5 text-brand-gold-light" />
              <h2 className="text-base sm:text-lg font-serif font-black tracking-wide text-[#FAF7F2]">
                My Shopping Basket
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 px-3 rounded-full text-brand-gold-light hover:bg-[#FAF7F2]/10 text-xs font-mono cursor-pointer uppercase transition-colors"
            >
              CLOSE
            </button>
          </div>

          {/* Cart List Items scroll */}
          <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 bg-white/45 dark:bg-stone-950/20">
            {cartItems.length === 0 ? (
              <div className="text-center py-20 flex flex-col items-center justify-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-brand-gold/10 text-brand-gold flex items-center justify-center">
                  <ShoppingBag className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-black text-brand-brown dark:text-brand-cream">Your Basket is Empty</h3>
                <p className="text-xs text-brand-brown/70 dark:text-brand-cream/70 max-w-xs leading-relaxed font-light">
                   Indulge in our exquisite fresh-baked Ecuadorian cocoa cakes, ghee-fried sweets, and crumbly butter puffs now!
                </p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown rounded-full font-bold text-xs uppercase tracking-wider hover:scale-102 transition-all cursor-pointer"
                >
                  Indulge inside Collections
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.weight}`}
                  className="p-4 bg-white/70 dark:bg-stone-900/60 hover:shadow-sm rounded-2xl border border-brand-brown/5 shadow-xs flex items-center gap-3 relative animate-in fade-in slide-in-from-right-4 transition-all"
                >
                  <img
                    src={item.image}
                    alt={item.productName}
                    className="w-14 h-14 object-cover rounded-xl border border-brand-brown/5"
                  />
                  
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="font-serif font-bold text-brand-brown dark:text-brand-cream text-xs sm:text-sm truncate">
                      {item.productName}
                    </h4>
                    <span className="text-[10px] font-mono text-brand-gold font-bold uppercase block mt-0.5">
                      Portion: {item.weight}
                    </span>
                    <span className="text-xs font-mono font-bold block text-brand-brown/85 dark:text-brand-cream/85 mt-1">
                      ${item.price} x {item.quantity} = ${item.price * item.quantity}
                    </span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="flex items-center gap-1.5 border border-brand-brown/10 dark:border-stone-800 rounded-full bg-white dark:bg-stone-900 px-1 py-0.5">
                      <button
                        onClick={() => onUpdateQty(item.productId, item.weight, item.quantity - 1)}
                        className="p-1 text-stone-500 hover:text-brand-brown dark:hover:text-brand-gold cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-black text-brand-brown dark:text-brand-cream">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQty(item.productId, item.weight, item.quantity + 1)}
                        className="p-1 text-stone-500 hover:text-brand-brown dark:hover:text-brand-gold cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(item.productId, item.weight)}
                      className="p-1 text-stone-400 hover:text-rose-600 dark:hover:text-red-400 cursor-pointer transition-colors"
                      title="Delete from Basket"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pricing Checkout Summaries bottom */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-6 border-t border-brand-brown/10 bg-white dark:bg-stone-950 shadow-md space-y-4">
              
              {/* Promo input */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter Coupon (SWEET10, DELIGHTS20)"
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="flex-1 text-xs border border-brand-brown/10 dark:border-stone-800 rounded-full px-4 py-2.5 bg-stone-50/50 dark:bg-stone-900 focus:outline-none focus:border-brand-gold dark:text-stone-100 uppercase"
                  />
                  <button
                    onClick={handleApplyCouponClick}
                    className="py-2.5 px-4.5 bg-brand-brown text-white dark:bg-brand-gold dark:text-brand-brown rounded-full font-bold text-xs uppercase tracking-wider hover:scale-102 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Tag className="w-3 h-3" /> Apply
                  </button>
                </div>

                {couponError && (
                  <span className="block text-[10px] text-rose-500 font-mono pl-3">{couponError}</span>
                )}

                {couponApplied && (
                  <div className="flex justify-between items-center bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-full px-3 py-1 text-[11px] font-mono font-bold mt-1.5 border border-emerald-500/20">
                    <span>🎉 Coupon Applied: {couponApplied.code}</span>
                    <button onClick={onRemoveCoupon} className="text-[10px] text-rose-500 hover:underline">
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {/* Invoice calculation breakdown */}
              <div className="space-y-2 text-xs font-mono border-b border-brand-brown/10 pb-3">
                <div className="flex justify-between">
                  <span className="text-brand-brown/60 dark:text-stone-400">Cart Subtotal:</span>
                  <span className="text-brand-brown dark:text-stone-200 font-bold">${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Coupon Discount:</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-brand-brown/60 dark:text-stone-400">Insulated Packing GST Tax (5%):</span>
                  <span className="text-brand-brown dark:text-stone-200 font-bold">${tax}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-brand-brown/60 dark:text-stone-400">Insulation Courier Delivery:</span>
                  <span className="text-brand-brown dark:text-stone-200 font-bold">
                    {deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline">
                <span className="font-serif font-black text-brand-brown dark:text-stone-100 text-sm">Amount Due:</span>
                <span className="font-serif text-2xl sm:text-3xl font-black text-brand-gold">
                  ${total}
                </span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onTriggerCheckoutTab();
                }}
                className="w-full py-3.5 bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full hover:scale-[1.01] active:scale-95 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
              >
                Proceed to Secure Billing
              </button>
              
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

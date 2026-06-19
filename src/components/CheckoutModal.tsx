import React, { useState, useEffect } from 'react';
import { CreditCard, Truck, ShieldCheck, CheckCircle2, FileText, ArrowLeft, Download } from 'lucide-react';
import { CartItem, User, Order } from '../types';

interface CheckoutModalProps {
  user: User | null;
  authToken: string | null;
  cartItems: CartItem[];
  couponApplied: { code: string; discountType: string; value: number } | null;
  onClearCart: () => void;
  onNavigateToTab: (tab: string) => void;
}

export default function CheckoutModal({
  user,
  authToken,
  cartItems,
  couponApplied,
  onClearCart,
  onNavigateToTab,
}: CheckoutModalProps) {
  // Billing details
  const [fullName, setFullName] = useState(user?.name || '');
  const [emailAddress, setEmailAddress] = useState(user?.email || '');
  const [contactPhone, setContactPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');

  // simulated Credit Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Process State
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Auto fill address if user has default addresses
  useEffect(() => {
    if (user && user.addresses.length > 0) {
      const def = user.addresses.find((a) => a.isDefault) || user.addresses[0];
      setStreetAddress(def.street);
      setCity(def.city);
      setZipCode(def.postalCode);
      setContactPhone(def.phone);
    }
  }, [user]);

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  
  let discount = 0;
  if (couponApplied) {
    if (couponApplied.discountType === 'percentage') {
      discount = Math.round((subtotal * couponApplied.value) / 100);
    } else {
      discount = couponApplied.value;
    }
  }

  const tax = Math.round((subtotal - discount) * 0.05);
  const deliveryFee = subtotal > 50 || subtotal === 0 ? 0 : 5;
  const total = Math.max(0, subtotal - discount + tax + deliveryFee);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !emailAddress || !streetAddress || !city || !zipCode) {
      alert("Please fill in all standard delivery locations metadata.");
      return;
    }

    if (paymentMethod === 'CARD') {
      if (cardNumber.length < 12 || cardExpiry.length < 4 || cardCvv.length < 3) {
        alert("Please complete simulated card parameters. (Tip: Enter card sandbox credentials)");
        return;
      }
    }

    setIsPlacing(true);
    const orderPayload = {
      items: cartItems.map((c) => ({
        productId: c.productId,
        productName: c.productName,
        weight: c.weight,
        quantity: c.quantity,
        price: c.price,
      })),
      couponApplied: couponApplied?.code || null,
      discountAmount: discount,
      taxAmount: tax,
      deliveryFee: deliveryFee,
      subtotal: subtotal,
      total: total,
      paymentMethod: paymentMethod,
      deliveryAddress: {
        id: "checkout-addr",
        street: streetAddress,
        city: city,
        postalCode: zipCode,
        phone: contactPhone,
        isDefault: false,
      },
      userName: fullName,
      email: emailAddress,
    };

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();
      if (data.success) {
        setPlacedOrder(data.order);
        onClearCart();
      } else {
        alert(data.error || "Order dispatch request failed.");
      }
    } catch (err) {
      alert("Connection checkout failed.");
    } finally {
      setIsPlacing(false);
    }
  };

  const downloadInvoiceReceipt = (order: Order) => {
    const textStr = `
=========================================
       SWEET DELIGHTS Luxury Bakery
       Digital Purchase Invoice Receipt
=========================================
Invoice Ref:  ${order.id}
Date Issued:  ${order.createdAt.split('T')[0]}
Recipient:    ${order.userName}
Email:        ${order.email}
-----------------------------------------
DELIVERY LOGISTIC ADDRESS:
-----------------------------------------
${order.deliveryAddress.street}
${order.deliveryAddress.city}, PIN: ${order.deliveryAddress.postalCode}
Contact:      ${order.deliveryAddress.phone}
-----------------------------------------
ITEMS ORDERED SPREADSHEEET:
-----------------------------------------
${order.items.map((it: any) => `• ${it.productName} (${it.weight}) x${it.quantity} - $${it.price * it.quantity}`).join('\n')}
-----------------------------------------
BILLING DETAILS SUMMARY:
-----------------------------------------
Gross Subtotal:     $${order.subtotal}
Applied Promo:      ${order.couponApplied || 'None'}
Discount Saved:    -$${order.discountAmount}
Insulated GST 5%:   $${order.taxAmount}
Express Delivery:   $${order.deliveryFee === 0 ? '0 (FREE)' : `${order.deliveryFee}`}
-----------------------------------------
GRAND NET AMOUNT DUE: $${order.total} USD
-----------------------------------------
Status Flag:        ${order.paymentMethod} ${order.paymentStatus}
Expected Dispatch:  Insulated air-cooled dispatch within 4-12 hours.
=========================================
  Thank you for celebrating with us!
  Artisanal bakers at Sweet Delights
`;
    const blob = new Blob([textStr], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sweet_delights_invoice_${order.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  // RENDER: COMPLETED INVOICE SCREEN
  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto my-10 px-4 font-sans" id="sweet-delights-purchase-finalized">
        <div className="bg-white/80 dark:bg-stone-900/80 border border-brand-brown/10 p-6 sm:p-8 rounded-2xl shadow-xl text-center space-y-6">
          
          <div className="w-16 h-16 bg-brand-gold/10 text-brand-gold rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#FAF7F2] bg-brand-brown px-3 py-1 rounded-full uppercase">
              Payment Confirmed & Settled
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-black text-brand-brown dark:text-[#FAF7F2] italic">
              Order Placed Successfully!
            </h2>
            <p className="text-xs text-brand-brown/70 dark:text-stone-400 max-w-sm mx-auto leading-relaxed">
              Chef Varshini and the kitchen team are prepping your warm, fresh insulated celebration box! Expected delivery in 4 hours.
            </p>
          </div>

          {/* Virtual Receipt structure */}
          <div className="text-left bg-[#FAF7F2]/50 dark:bg-stone-950/40 border border-brand-brown/10 rounded-xl p-5 space-y-4 font-mono text-xs text-brand-brown dark:text-stone-300">
            <div className="flex justify-between items-center border-b border-brand-brown/10 pb-2">
              <span className="font-bold text-brand-brown dark:text-stone-100">Sweet Delights Receipt</span>
              <span className="text-brand-gold font-bold">{placedOrder.id}</span>
            </div>
            
            <div className="space-y-1">
              <p>👤 <strong>Recipient:</strong> {placedOrder.userName}</p>
              <p>📍 <strong>Deliver:</strong> {placedOrder.deliveryAddress.street}, {placedOrder.deliveryAddress.city}</p>
              <p>📦 <strong>Package items:</strong></p>
              {placedOrder.items.map((it: any, idx) => (
                <p key={idx} className="pl-3 text-brand-brown/75 dark:text-stone-400">
                  - {it.productName} ({it.weight}) x{it.quantity}
                </p>
              ))}
            </div>

            <div className="border-t border-brand-brown/10 pt-2 flex justify-between items-baseline text-sm">
              <span className="font-serif text-brand-brown dark:text-brand-cream">Total Amount Due Paid:</span>
              <span className="font-black font-serif text-lg text-brand-gold">${placedOrder.total}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={() => downloadInvoiceReceipt(placedOrder)}
              className="py-2.5 px-6 rounded-full bg-brand-brown text-[#FAF7F2] dark:bg-brand-gold dark:text-brand-brown text-xs font-bold uppercase tracking-wider hover:scale-102 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Official Invoice
            </button>
            <button
              onClick={() => onNavigateToTab('dashboard')}
              className="py-2.5 px-6 rounded-full border border-brand-brown/10 text-brand-brown dark:text-stone-300 text-xs font-bold hover:bg-brand-brown/5 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <FileText className="w-4 h-4" /> View in My Portal
            </button>
          </div>

        </div>
      </div>
    );
  }

  // RENDER: SECURE BILLING FORM
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans" id="sweet-delights-secure-checkout-page">
      
      <button
        onClick={() => onNavigateToTab('menu')}
        className="mb-6 text-xs sm:text-sm text-brand-brown/60 hover:text-brand-brown font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Menu Collection
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Delivery Details Form */}
        <form onSubmit={handlePlaceOrder} className="lg:col-span-7 bg-white/70 dark:bg-stone-900/60 border border-brand-brown/10 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-serif font-black text-brand-brown dark:text-brand-cream flex items-center gap-2 border-b border-brand-brown/10 pb-3">
            <Truck className="w-5 h-5 text-brand-gold" /> Secure Billing details
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Full Name Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950 dark:text-stone-200 focus:outline-none focus:border-brand-gold text-xs sm:text-sm"
                placeholder="e.g. Varshini Gold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Email Address (Receipt recipient)
              </label>
              <input
                type="email"
                required
                value={emailAddress}
                onChange={(e) => setEmailAddress(e.target.value)}
                className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950 dark:text-stone-200 focus:outline-none focus:border-brand-gold text-xs sm:text-sm"
                placeholder="recipient@email.com"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  Street Delivery details
                </label>
                <input
                  type="text"
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950 dark:text-stone-200 text-xs focus:outline-none focus:border-brand-gold"
                  placeholder="Street details"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  City (Bengaluru Area)
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950 dark:text-stone-200 text-xs focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. Bengaluru"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  Postal Zone ZIP
                </label>
                <input
                  type="text"
                  required
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950 dark:text-stone-200 text-xs focus:outline-none focus:border-brand-gold"
                  placeholder="e.g. 560001"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  Contact Phone
                </label>
                <input
                  type="text"
                  required
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full border border-brand-brown/10 dark:border-stone-800 p-2.5 rounded-lg bg-stone-50/50 dark:bg-stone-950 dark:text-stone-200 text-xs focus:outline-none focus:border-brand-gold"
                  placeholder="+91 99999 99999"
                />
              </div>
            </div>
          </div>

          {/* Payment Method select */}
          <div className="space-y-3.5 border-t border-brand-brown/10 dark:border-stone-850 pt-5">
            <label className="block text-xs font-bold text-brand-brown dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
              Choose Payment Mode
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('COD')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                  paymentMethod === 'COD' ? 'border-brand-brown bg-brand-brown/5 text-brand-brown font-bold shadow-xs' : 'border-brand-brown/10 dark:border-stone-850 text-stone-500'
                }`}
              >
                <Truck className="w-5 h-5 mb-1 text-brand-gold" />
                Cash on Delivery (COD)
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('CARD')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-xs cursor-pointer ${
                  paymentMethod === 'CARD' ? 'border-brand-brown bg-brand-brown/5 text-brand-brown font-bold shadow-xs' : 'border-brand-brown/10 dark:border-stone-850 text-stone-500'
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1 text-brand-gold" />
                Credit/Debit Card (Razorpay)
              </button>
            </div>

            {/* CARD FORM SUBPANEL */}
            {paymentMethod === 'CARD' && (
              <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-brand-brown/10 rounded-xl space-y-3 text-xs leading-none">
                <div>
                  <label className="block text-[10px] font-bold text-brand-brown dark:text-stone-400 mb-1 font-mono uppercase">
                    Simulated Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full border border-brand-brown/10 dark:border-stone-800 p-2 rounded-lg bg-white dark:bg-stone-900 dark:text-stone-200 text-xs font-mono focus:outline-none focus:border-brand-gold"
                    placeholder="4111 2222 3333 4444 [Sandbox]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-brown dark:text-stone-400 mb-1 font-mono uppercase">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full border border-brand-brown/10 dark:border-stone-800 p-2 rounded-lg bg-white dark:bg-stone-900 dark:text-stone-200 text-xs font-mono focus:outline-none focus:border-brand-gold"
                      placeholder="MM / YY"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-brand-brown dark:text-stone-400 mb-1 font-mono uppercase">
                      CVV Code
                    </label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full border border-brand-brown/10 dark:border-stone-800 p-2 rounded-lg bg-white dark:bg-stone-900 dark:text-stone-200 text-xs font-mono focus:outline-none focus:border-brand-gold"
                      placeholder="•••"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isPlacing}
            className="w-full py-3.5 rounded-full bg-brand-brown text-white dark:bg-brand-gold dark:text-brand-brown text-xs sm:text-sm font-bold uppercase tracking-wider hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <ShieldCheck className="w-5 h-5 text-brand-gold" />
            {isPlacing ? 'Placing Order...' : `Pay & Settle: $${total} USD`}
          </button>
        </form>

        {/* Right Side: Simple Order Item breakdown */}
        <div className="lg:col-span-5 bg-white/70 dark:bg-stone-900/60 border border-brand-brown/10 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-serif font-black text-brand-brown dark:text-[#FAF7F2] border-b border-brand-brown/10 pb-2.5">
             Order Items Summary
          </h3>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
            {cartItems.map((item) => (
              <div key={`${item.productId}-${item.weight}`} className="flex justify-between items-center text-xs pb-2 border-b border-stone-100/40">
                <div>
                  <span className="font-bold text-brand-brown dark:text-stone-200 block">{item.productName}</span>
                  <span className="text-[10px] text-brand-brown/60 dark:text-stone-400 font-mono">Size: {item.weight} x{item.quantity}</span>
                </div>
                <span className="font-mono text-brand-brown dark:text-stone-250 font-bold">${item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          {/* Settle info block */}
          <div className="space-y-2 border-t border-brand-brown/10 pt-4 text-xs font-mono">
            <div className="flex justify-between">
              <span className="text-brand-brown/60 dark:text-stone-400">Subtotal:</span>
              <span className="font-bold text-brand-brown dark:text-stone-200">${subtotal}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon Saved:</span>
                <span>-${discount}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-brand-brown/60 dark:text-stone-400">GST Insulated Tax (5%):</span>
              <span className="font-bold text-brand-brown dark:text-stone-200">${tax}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-brand-brown/60 dark:text-stone-400">Insulation delivery:</span>
              <span className="font-bold text-brand-brown dark:text-stone-200">
                {deliveryFee === 0 ? 'FREE' : `$${deliveryFee}`}
              </span>
            </div>

            <div className="flex justify-between text-sm pt-2 border-t border-brand-brown/10 font-serif">
              <span className="font-black text-brand-brown dark:text-stone-100">Grand Total due:</span>
              <span className="font-black text-brand-gold text-lg">${total}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

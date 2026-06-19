import React, { useState, useEffect } from 'react';
import { Calendar, Users, Briefcase, FileDown, Heart, Sparkles, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { PlannerRequest, User } from '../types';

interface EventPlannerProps {
  user: User | null;
  authToken: string | null;
  onNavigateToTab: (tab: string) => void;
  savedRequests: PlannerRequest[];
  fetchSavedRequests: () => void;
}

export default function EventPlanner({
  user,
  authToken,
  onNavigateToTab,
  savedRequests,
  fetchSavedRequests,
}: EventPlannerProps) {
  // Form State
  const [eventType, setEventType] = useState('Birthday Party');
  const [eventDate, setEventDate] = useState('');
  const [guests, setGuests] = useState(50);
  const [cakeRequirement, setCakeRequirement] = useState('Chocolate Truffle flavour with custom naming plaque');
  const [sweetRequirement, setSweetRequirement] = useState('Kaju Katli and Rasgulla assorted platters');
  const [savouriesRequirement, setSavouriesRequirement] = useState('Paneer Puffs and Samosas pieces');
  const [themeSelection, setThemeSelection] = useState('Royal Ivory & Gold');
  const [customNotes, setCustomNotes] = useState('');
  const [budgetRange, setBudgetRange] = useState('Premium Luxury');
  const [deliveryAddress, setDeliveryAddress] = useState('');

  // AI Recommendation State
  const [aiSuggestions, setAiSuggestions] = useState({
    recommendedCake: '3 Kg Chocolate Truffle Cake',
    recommendedSweets: '100 Sweets (Assorted)',
    recommendedSavouries: '80 Savoury items',
    estimatedPrice: 320,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  // Auto calculate baseline estimates or trigger AI suggestions
  useEffect(() => {
    const triggerEstimate = async () => {
      setIsGenerating(true);
      try {
        const response = await fetch('/api/planner/generate-suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            guests,
            budgetRange,
            eventType,
          }),
        });
        const data = await response.json();
        setAiSuggestions(data);
      } catch (e) {
        // Safe mathematical fallbacks
        const calcCake = Math.max(1, Math.round((guests * 0.08) * 10) / 10);
        setAiSuggestions({
          recommendedCake: `${calcCake} Kg custom celebration cake (Theme-aligned)`,
          recommendedSweets: `${Math.round(guests * 1.5)} premium sweets pieces`,
          recommendedSavouries: `${Math.round(guests * 1.2)} standard savory puffs`,
          estimatedPrice: Math.round(calcCake * 45 + guests * 1.5 * 3 + guests * 1.2 * 4),
        });
      } finally {
        setIsGenerating(false);
      }
    };

    // Debounce slider updates slightly
    const dTimer = setTimeout(() => {
      triggerEstimate();
    }, 400);

    return () => clearTimeout(dTimer);
  }, [guests, budgetRange, eventType]);

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventDate || !deliveryAddress) {
      alert("Please select a date and enter a delivery address.");
      return;
    }

    try {
      const response = await fetch('/api/planner-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { 'Authorization': `Bearer ${authToken}` } : {}),
        },
        body: JSON.stringify({
          eventType,
          eventDate,
          guests,
          cakeRequirement,
          sweetRequirement,
          savouriesRequirement,
          themeSelection,
          customNotes,
          budgetRange,
          deliveryAddress,
          aiSuggestions,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setBookingStatus("Your luxury event plan proposal is saved successfully! An administrator will contact you shortly to confirm design blueprints.");
        fetchSavedRequests();
        // Clear some form elements
        setCustomNotes('');
      } else {
        alert(data.error || "Submission failed.");
      }
    } catch (err) {
      alert("Submission failed. Please check connection.");
    }
  };

  const handleDownloadQuotation = (req: PlannerRequest) => {
    // Generate text-based virtual quotation for luxury feel
    const element = document.createElement("a");
    const receiptText = `
========================================
       SWEET DELIGHTS Luxury Bakery
       Custom Event Celebration Quote
========================================
Reference Code: ${req.id}
Event Category: ${req.eventType}
Planned Date:   ${req.eventDate}
Guest Registry: ${req.guests} Attendees
Theme Selected: ${req.themeSelection}
Budget Profile: ${req.budgetRange}
----------------------------------------
PROPOSAL BLUEPRINT DETAILS:
----------------------------------------
Cake Focus:     ${req.cakeRequirement}
Sweets Platter: ${req.sweetRequirement}
Savouries Set:  ${req.savouriesRequirement}
----------------------------------------
EXECUTIVE CHEF AI SUGGESTIONS:
----------------------------------------
* Recommended Cake Weight: ${req.aiSuggestions.recommendedCake}
* Suggested Sweet Count:   ${req.aiSuggestions.recommendedSweets}
* Suggested Savouries Set: ${req.aiSuggestions.recommendedSavouries}
----------------------------------------
ESTIMATED TOTAL BUDGET: $${req.aiSuggestions.estimatedPrice} USD
----------------------------------------
* Note: This is an organic quotation estimate. Actual charges
may slightly vary based on custom ingredient selections.
========================================
 Thank you for placing your trust in us!
`;
    const file = new Blob([receiptText], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `sweet_delights_quote_${req.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const themes = [
    { name: 'Royal Ivory & Gold', bg: 'bg-[#fffcf4]', border: 'border-amber-300', desc: 'Classic white tiers dusted in real gold leaves and pearescent sugar pearls.' },
    { name: 'Saffron Crimson Cascade', bg: 'bg-[#fffaeb]', border: 'border-amber-500', desc: 'Warm ethnic shades, kashmiri saffron glaze, and royal silver foils (vark).' },
    { name: 'Warm Caramel & Lace', bg: 'bg-[#fbf4eb]', border: 'border-amber-600', desc: 'Rich brown toffee tones, spun sugar structures, and elegant lace frosting.' },
    { name: 'Midnight Cocoa & Berries', bg: 'bg-[#f5e6da]', border: 'border-stone-900', desc: 'Seductive dark belgian chocolate ganache with glazed fresh crimson cherries.' },
    { name: 'Pastel Fantasy Unicorn', bg: 'bg-[#fdf2f8]', border: 'border-pink-300', desc: 'Playful rainbow cream swirls, sweet sprinkles, and fluffy custom birthday plaques.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans" id="event-function-planner-page">
      
      {/* Editorial Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold px-3 py-1 rounded-full text-xs uppercase tracking-wider mb-2 font-mono">
          <Sparkles className="w-3.5 h-3.5" />
          Elite Celebrations
        </div>
        <h1 className="font-serif text-3.5xl md:text-5xl font-black text-stone-900 dark:text-amber-100 tracking-tight">
          Event & Function Planner
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-sm md:text-base mt-2">
          Design bespoke dessert courses and custom culinary blueprints. Our executive **Gâteau-AI** engine calculates precise counts immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Custom Configuration Form */}
        <form onSubmit={handleSubmitBooking} className="lg:col-span-7 bg-white dark:bg-stone-900 p-6 md:p-8 rounded-2xl border border-amber-500/10 shadow-lg space-y-6">
          <h2 className="text-xl font-serif font-black text-stone-900 dark:text-amber-300 border-b border-stone-100 dark:border-stone-850 pb-3">
             Configure Your Celebration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                Event Category
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="w-full text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-950 focus:border-amber-500 focus:outline-none dark:text-stone-200"
              >
                <option>Birthday Party</option>
                <option>Wedding Celebration</option>
                <option>Baby Shower</option>
                <option>Corporate Event</option>
                <option>Graduation Celebration</option>
                <option>Family Gathering</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                Planned Date
              </label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-950 focus:border-amber-500 focus:outline-none dark:text-stone-200"
              />
            </div>
          </div>

          {/* Guest Count Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider font-mono">
                Expected Guests count
              </label>
              <span className="text-sm font-black bg-amber-500/10 text-amber-700 dark:text-amber-300 px-3 py-0.5 rounded-full font-mono">
                {guests} Guests
              </span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value))}
              className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>Min: 10</span>
              <span>Intimate: 100</span>
              <span>Grand Gala: 500+</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                Budget Level
              </label>
              <select
                value={budgetRange}
                onChange={(e) => setBudgetRange(e.target.value)}
                className="w-full text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-950 focus:border-amber-500 focus:outline-none dark:text-stone-200"
              >
                <option>Premium Luxury</option>
                <option>Gourmet Elite</option>
                <option>Standard Smart</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1.5 font-mono">
                Theme Visual style
              </label>
              <select
                value={themeSelection}
                onChange={(e) => setThemeSelection(e.target.value)}
                className="w-full text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2.5 bg-stone-50 dark:bg-stone-950 focus:border-amber-500 focus:outline-none dark:text-stone-200"
              >
                {themes.map((t, idx) => (
                  <option key={idx} value={t.name}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Detailed requirements */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Cake Specifications
              </label>
              <input
                type="text"
                value={cakeRequirement}
                onChange={(e) => setCakeRequirement(e.target.value)}
                placeholder="e.g. Red Velvet tiered cake with script plaques"
                className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2 bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  Sweets Preferences
                </label>
                <input
                  type="text"
                  value={sweetRequirement}
                  onChange={(e) => setSweetRequirement(e.target.value)}
                  placeholder="e.g. Saffron Kaju Katli trays"
                  className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2 bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                  Savoury Preferences
                </label>
                <input
                  type="text"
                  value={savouriesRequirement}
                  onChange={(e) => setSavouriesRequirement(e.target.value)}
                  placeholder="e.g. Assorted spicy paneer puffs"
                  className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2 bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Delivery Address & Contact
              </label>
              <input
                type="text"
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Ensurse climate-controlled delivery pin location"
                className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2 bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-1 font-mono">
                Custom Blueprints / Ingredient Notes (Optional)
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                rows={2}
                placeholder="Mention allergies, custom sugar tiers or script wording requests..."
                className="w-full text-xs sm:text-sm border border-stone-200 dark:border-stone-800 rounded-lg p-2 bg-stone-50 dark:bg-stone-950 dark:text-stone-200"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-full bg-gradient-to-tr from-stone-950 to-stone-800 text-amber-400 dark:from-amber-600 dark:to-amber-500 dark:text-stone-950 text-sm font-bold tracking-wider hover:scale-[1.02] active:scale-95 transition-all text-center flex items-center justify-center gap-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            Submit Booking & Quote Request
          </button>

          {bookingStatus && (
            <div className="p-3 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs leading-relaxed flex items-start gap-2 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{bookingStatus}</span>
            </div>
          )}
        </form>

        {/* Right Side: Gâteau-AI Smart Recommendations and Past Requests */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* AI Quotation Box */}
          <div className="bg-gradient-to-br from-[#1c130c] to-[#0d0905] text-stone-100 p-6 rounded-2xl border border-amber-500/20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500 text-stone-950">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-black text-amber-400 uppercase tracking-wider">
                    Gâteau-AI Blueprint Recommendation
                  </h3>
                  <span className="text-[9px] text-stone-400 font-mono">Immediate custom calculation</span>
                </div>
              </div>
              <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded ${isGenerating ? 'bg-amber-500/20 text-amber-300 animate-pulse' : 'bg-stone-800 text-stone-300'}`}>
                {isGenerating ? 'Recalculating...' : 'Ready'}
              </span>
            </div>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="border-b border-stone-850 pb-3">
                <span className="block text-[10px] text-amber-500/80 font-bold uppercase tracking-wider font-mono">
                  Recommended Cake Size
                </span>
                <p className="mt-1 text-stone-200 font-serif font-bold text-base">
                  {aiSuggestions.recommendedCake}
                </p>
              </div>

              <div className="border-b border-stone-850 pb-3">
                <span className="block text-[10px] text-amber-500/80 font-bold uppercase tracking-wider font-mono">
                  Sweets Assortment Suggested
                </span>
                <p className="mt-1 text-stone-200 leading-relaxed">
                  {aiSuggestions.recommendedSweets}
                </p>
              </div>

              <div className="border-b border-stone-850 pb-3">
                <span className="block text-[10px] text-amber-500/80 font-bold uppercase tracking-wider font-mono">
                  Savoury Plates Required
                </span>
                <p className="mt-1 text-stone-200 leading-relaxed">
                  {aiSuggestions.recommendedSavouries}
                </p>
              </div>

              <div>
                <span className="block text-[10px] text-amber-500/80 font-bold uppercase tracking-wider font-mono">
                  Estimated Total Quotation
                </span>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-3xl font-serif font-black text-amber-400">
                    ${aiSuggestions.estimatedPrice}
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">USD Approx</span>
                </div>
                <span className="block text-[9px] text-stone-500 mt-1 italic font-sans dark:text-stone-400/60 leading-tight">
                  * Based on clean whole-ingredients cost indices, subject to design complexity.
                </span>
              </div>
            </div>
          </div>

          {/* Saved Requests list */}
          <div className="bg-white dark:bg-stone-900 border border-amber-500/10 p-6 rounded-2xl shadow-md">
            <h3 className="font-serif text-lg font-black text-stone-900 dark:text-amber-100 flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-amber-500" />
              My Stored Event Blueprints
            </h3>

            {!authToken ? (
              <div className="text-center py-6 text-stone-400 dark:text-stone-500 text-xs">
                <p>Log in or Register to view and save your historical quotes.</p>
                <button
                  type="button"
                  onClick={() => onNavigateToTab('dashboard')}
                  className="mt-3 text-xs bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold px-4 py-1.5 rounded-full hover:bg-amber-500/25 transition-all cursor-pointer"
                >
                  Configure Profile Sync
                </button>
              </div>
            ) : savedRequests.length === 0 ? (
              <p className="text-center py-6 text-stone-400 dark:text-stone-500 text-xs italic">
                No requested celebration bookings found. Create one now!
              </p>
            ) : (
              <div className="space-y-3.5 max-h-[290px] overflow-y-auto pr-1">
                {savedRequests.map((req) => (
                  <div key={req.id} className="p-3.5 rounded-xl bg-stone-50 dark:bg-stone-950 border border-stone-200/40 dark:border-stone-800 text-xs flex flex-col gap-2 shadow-sm">
                    <div className="flex items-center justify-between border-b border-stone-200/20 pb-2">
                      <div>
                        <span className="font-bold text-stone-800 dark:text-stone-200">{req.eventType}</span>
                        <span className="block text-[10px] font-mono text-stone-500 mt-0.5">{req.eventDate}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full font-mono text-[9px] font-bold uppercase ${
                        req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-600' :
                        req.status === 'Declined' ? 'bg-rose-500/10 text-rose-600' : 'bg-amber-500/10 text-amber-600'
                      }`}>
                        {req.status}
                      </span>
                    </div>
                    <div className="space-y-1 text-stone-600 dark:text-stone-400 text-[11px] leading-relaxed">
                      <p>👥 <strong>Guests:</strong> {req.guests} | 🏛️ <strong>Theme:</strong> {req.themeSelection}</p>
                      <p>🍰 {req.aiSuggestions.recommendedCake}</p>
                      <p>💵 <strong>Estimates Quote:</strong> <span className="text-amber-600 dark:text-amber-400 font-black font-serif">${req.aiSuggestions.estimatedPrice}</span></p>
                    </div>
                    <button
                      onClick={() => handleDownloadQuotation(req)}
                      className="w-full mt-1.5 py-1.5 rounded-lg border border-amber-500/20 text-amber-800 dark:text-amber-300 font-bold hover:bg-amber-500/10 transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer text-[10px]"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                      Download Blueprint PDF Quote
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

import { CognitiveBias, DarkPattern, PurchaseLogItem, QuizQuestion } from '../types/behavior';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "When are you most likely to initiate an online shopping session?",
    context: "Understanding the emotional catalyst behind opening an e-commerce tab.",
    options: [
      {
        label: "Direct Need Search",
        description: "I know exactly what replacement item or tool I need, search for it, and compare specs.",
        scores: { impulse: 10, threshold: 30, research: 90, returnFriction: 30, scarcity: 20 }
      },
      {
        label: "Late-Night Decompression",
        description: "In bed between 10 PM and 1 AM, scrolling recommendations as a relaxing unwind.",
        scores: { impulse: 95, threshold: 60, research: 25, returnFriction: 60, scarcity: 80 }
      },
      {
        label: "Flash Sale / Email Ping",
        description: "An email notification announces a 40% VIP drop or 24-hour members-only markdown.",
        scores: { impulse: 85, threshold: 80, research: 40, returnFriction: 50, scarcity: 90 }
      },
      {
        label: "Boredom & Social Feeds",
        description: "Seeing a product featured in a short video or social post and clicking the shop link.",
        scores: { impulse: 90, threshold: 40, research: 20, returnFriction: 70, scarcity: 70 }
      }
    ]
  },
  {
    id: 2,
    question: "You see 'Only 2 items left at this price!' on a product page. What is your reaction?",
    context: "Testing susceptibility to artificial stock scarcity and countdown timers.",
    options: [
      {
        label: "Immediate Checkout Spike",
        description: "I feel an urgent rush of anxiety that I will lose the item if I don't buy right now.",
        scores: { impulse: 90, threshold: 50, research: 15, returnFriction: 40, scarcity: 95 }
      },
      {
        label: "Cautious Hesitation",
        description: "It pressures me, but I check other tabs or sellers to see if it's actually rare.",
        scores: { impulse: 40, threshold: 40, research: 75, returnFriction: 30, scarcity: 50 }
      },
      {
        label: "Skeptical Resistance",
        description: "I assume it's an algorithmic script designed to rush me; I deliberately slow down.",
        scores: { impulse: 15, threshold: 20, research: 80, returnFriction: 20, scarcity: 15 }
      },
      {
        label: "Cart Parking",
        description: "I add it to my cart to 'hold' it, then wander off to do other things.",
        scores: { impulse: 50, threshold: 30, research: 60, returnFriction: 40, scarcity: 40 }
      }
    ]
  },
  {
    id: 3,
    question: "Your cart total is $42. Free shipping starts at $50. Shipping costs $5.99. What do you do?",
    context: "The ubiquitous 'Free Shipping Threshold' psychological trap.",
    options: [
      {
        label: "The $15 Filler Trap",
        description: "I spend 20 minutes searching the store and add a $15-$20 item I wasn't planning on buying.",
        scores: { impulse: 80, threshold: 100, research: 50, returnFriction: 60, scarcity: 40 }
      },
      {
        label: "Pay the $5.99 Flat Fee",
        description: "I recognize that spending $15 more to save $6 is a net loss of $9, so I pay shipping.",
        scores: { impulse: 15, threshold: 10, research: 60, returnFriction: 20, scarcity: 10 }
      },
      {
        label: "Total Abandonment",
        description: "I get frustrated by the surprise shipping fee and close the entire browser window.",
        scores: { impulse: 30, threshold: 85, research: 40, returnFriction: 30, scarcity: 30 }
      },
      {
        label: "Stockpile Staple Consumables",
        description: "I add everyday household essentials I know with 100% certainty I will use next month.",
        scores: { impulse: 25, threshold: 40, research: 85, returnFriction: 20, scarcity: 15 }
      }
    ]
  },
  {
    id: 4,
    question: "How long do non-essential items typically sit in your digital cart before purchase?",
    context: "Measuring intentional cart incubation vs frictionless impulsive checkouts.",
    options: [
      {
        label: "Instant (< 5 minutes)",
        description: "Apple Pay or 1-Click checkout. Found it, wanted it, purchased it in the same session.",
        scores: { impulse: 95, threshold: 60, research: 20, returnFriction: 50, scarcity: 85 }
      },
      {
        label: "Incubation (24 to 72 hours)",
        description: "I park it to see if the emotional desire fades by tomorrow morning.",
        scores: { impulse: 20, threshold: 25, research: 70, returnFriction: 30, scarcity: 20 }
      },
      {
        label: "Perpetual Wishlist Cart",
        description: "I have 40 items in my cart across 5 websites that I treat like a digital vision board.",
        scores: { impulse: 45, threshold: 40, research: 60, returnFriction: 40, scarcity: 25 }
      },
      {
        label: "Coupon Waiting Strategy",
        description: "I intentionally leave it abandoned for 2 days to trigger the retailer's 10% retargeting coupon.",
        scores: { impulse: 25, threshold: 30, research: 90, returnFriction: 20, scarcity: 15 }
      }
    ]
  },
  {
    id: 5,
    question: "How do you evaluate customer reviews before buying a $25-$50 product?",
    context: "Measuring review exhaustion and decision paralysis.",
    options: [
      {
        label: "Filter Directly to 1-3 Stars",
        description: "I skip 5-star hype and scan 1-3 star reviews to identify recurring product defects.",
        scores: { impulse: 15, threshold: 20, research: 90, returnFriction: 20, scarcity: 10 }
      },
      {
        label: "Glance at Star Average Only",
        description: "If it has 4.4+ stars and over 500 ratings, I assume it's good and buy quickly.",
        scores: { impulse: 70, threshold: 45, research: 25, returnFriction: 40, scarcity: 60 }
      },
      {
        label: "Paralysis by Analysis",
        description: "I spend 2 hours cross-referencing Reddit, YouTube reviews, and 5 alternative models.",
        scores: { impulse: 10, threshold: 30, research: 100, returnFriction: 25, scarcity: 15 }
      },
      {
        label: "Aesthetic / Photo Scanning",
        description: "I scroll customer photos to see what it actually looks like outside studio lighting.",
        scores: { impulse: 40, threshold: 35, research: 70, returnFriction: 35, scarcity: 30 }
      }
    ]
  },
  {
    id: 6,
    question: "When offered 'Pay in 4 interest-free installments of $25' on a $100 purchase:",
    context: "Testing Buy-Now-Pay-Later (BNPL) payment decoupling psychology.",
    options: [
      {
        label: "It Lowers My Guard",
        description: "It makes the purchase feel small and painless, making me much more likely to check out.",
        scores: { impulse: 90, threshold: 70, research: 20, returnFriction: 50, scarcity: 70 }
      },
      {
        label: "Mental Red Flag",
        description: "I avoid BNPL because I know micro-commitments cloud true cashflow awareness.",
        scores: { impulse: 10, threshold: 15, research: 80, returnFriction: 15, scarcity: 10 }
      },
      {
        label: "Strictly Cashflow Utility",
        description: "I only use it if I already have the full amount in cash in my checking account.",
        scores: { impulse: 30, threshold: 30, research: 70, returnFriction: 20, scarcity: 25 }
      },
      {
        label: "Rarely Notice It",
        description: "I default to regular credit card for points and ignore installment prompts.",
        scores: { impulse: 35, threshold: 25, research: 50, returnFriction: 30, scarcity: 30 }
      }
    ]
  },
  {
    id: 7,
    question: "How do you feel 48 hours after receiving an online delivery?",
    context: "Assessing post-purchase cognitive dissonance and dopamine drop.",
    options: [
      {
        label: "Sustained Utility & Joy",
        description: "I'm genuinely excited, integrate the item into daily life, and have no remorse.",
        scores: { impulse: 15, threshold: 15, research: 80, returnFriction: 15, scarcity: 10 }
      },
      {
        label: "Mild Dopamine Crash",
        description: "The thrill was in the tracking and anticipation; now it's just sitting in the box.",
        scores: { impulse: 85, threshold: 65, research: 30, returnFriction: 60, scarcity: 75 }
      },
      {
        label: "Subtle Financial Guilt",
        description: "I wonder if I should have saved that money or if I really needed another variant.",
        scores: { impulse: 75, threshold: 60, research: 35, returnFriction: 50, scarcity: 65 }
      },
      {
        label: "Immediate Return Consideration",
        description: "It didn't match the studio imagery or fit properly, so I immediately contemplate returning it.",
        scores: { impulse: 45, threshold: 40, research: 50, returnFriction: 80, scarcity: 40 }
      }
    ]
  },
  {
    id: 8,
    question: "An item arrives and it doesn't fit or live up to expectations. What happens next?",
    context: "The 'Return Inertia' barrier where customer friction becomes merchant retention.",
    options: [
      {
        label: "Immediate Same-Week Return",
        description: "I print the label, repack it, and drop it off within 48 hours without fail.",
        scores: { impulse: 20, threshold: 20, research: 60, returnFriction: 10, scarcity: 15 }
      },
      {
        label: "The Closet Quarantine Trap",
        description: "I intend to return it, leave it by the door for 30 days, miss the window, and keep it.",
        scores: { impulse: 65, threshold: 50, research: 30, returnFriction: 95, scarcity: 45 }
      },
      {
        label: "The 'Too Small To Bother' Barrier",
        description: "If it cost under $25, the cognitive friction of printing and packaging isn't worth it.",
        scores: { impulse: 60, threshold: 60, research: 25, returnFriction: 85, scarcity: 35 }
      },
      {
        label: "Re-Gifting / Donating",
        description: "I give it to a friend or donate it to charity rather than deal with return logistics.",
        scores: { impulse: 45, threshold: 40, research: 40, returnFriction: 70, scarcity: 25 }
      }
    ]
  }
];

export const COGNITIVE_BIASES: CognitiveBias[] = [
  {
    id: 'free-shipping-mirage',
    title: 'The Free Shipping Mirage',
    subtitle: 'Zero-Cost Fallacy & Threshold Escalation',
    category: 'Pricing',
    scientificPrinciple: 'Human brains overweight "free" ($0) as an emotional reward rather than a numerical subtraction (Shampanier & Ariely, 2007). Consumers willingly spend $20 on unneeded items to avoid a visible $4.99 shipping fee.',
    retailerGoal: 'Increase Average Order Value (AOV) by setting minimum thresholds 15-25% higher than typical basket values.',
    customerVulnerability: 'We perceive the shipping fee as pure "waste", while goods in the basket feel like tangible "assets", blinding us to the net cash deficit.',
    realWorldExample: 'You have a $38 shirt. Shipping is $6. Free shipping at $50. You add a $16 pair of socks. You just paid $10 extra to "save" $6.',
    interactiveType: 'threshold',
    counterStrategy: 'Treat shipping as a legitimate logistics convenience fee. Never spend more than the shipping fee itself on items you had not planned to buy before reaching checkout.'
  },
  {
    id: 'anchor-pricing',
    title: 'Anchor Pricing & Phantom Markdowns',
    subtitle: 'Reference Dependence & Fabricated Value',
    category: 'Pricing',
    scientificPrinciple: 'Tversky & Kahneman\'s Anchoring Effect: the first price seen sets the mental baseline. When a retailer shows "$120 ~~$300~~", our brain calculates "I gained $180" rather than "I spent $120".',
    retailerGoal: 'Artificially inflate MSRP or "Original" prices so regular retail prices look like emergency clearances.',
    customerVulnerability: 'We confuse "size of discount" with "quality of investment". A 70% discount on an item you do not use is still 100% wasted capital.',
    realWorldExample: 'Outlet stores and flash-sale marketplaces that manufacture products specifically for "sale" pricing, meaning the anchor MSRP was never paid by anyone in history.',
    interactiveType: 'anchor',
    counterStrategy: 'Cover the strikethrough price with your thumb. Ask: "If this item had no markdown banner and simply cost $X, would I buy it today?"'
  },
  {
    id: 'artificial-scarcity',
    title: 'Artificial Scarcity & Countdown Stress',
    subtitle: 'Urgency Heuristic & Loss Aversion',
    category: 'Urgency',
    scientificPrinciple: 'Perceived scarcity triggers sympathetic nervous system arousal (fight-or-flight). Amygdala activity surges while prefrontal critical evaluation shuts down to prevent perceived loss.',
    retailerGoal: 'Compress decision time so the shopper cannot compare competitors, check personal budgets, or sleep on the decision.',
    customerVulnerability: 'Fear of Missing Out (FOMO). We feel the pain of losing an opportunity 2.5x more intensely than the pleasure of equivalent gain.',
    realWorldExample: '"Sale ends in 00:14:32" countdown clocks that reset when you clear browser cookies or open an incognito window.',
    interactiveType: 'scarcity',
    counterStrategy: 'If an item is truly unique, it will still exist or an equivalent will be available tomorrow. Never buy under an active timer.'
  },
  {
    id: 'choice-overload',
    title: 'The Paradox of Choice & Review Exhaustion',
    subtitle: 'Cognitive Depletion & Maximizer Anxiety',
    category: 'Cognitive Load',
    scientificPrinciple: 'Barry Schwartz\'s Paradox of Choice: having 200 options causes decision paralysis, cognitive exhaustion, and elevated regret after purchasing because of all the foregone alternatives.',
    retailerGoal: 'Keep users on-site longer through endless scroll and algorithmic "related items" grids, maximizing overall ad and browsing impressions.',
    customerVulnerability: 'Shoppers spend 3 hours comparing $18 phone cases, generating stress and post-purchase doubt ("Did I pick the wrong color?").',
    realWorldExample: 'Spending an entire Sunday evening reading 140 reviews for kitchen tongs across four open browser tabs.',
    interactiveType: 'friction',
    counterStrategy: 'Adopt "Satisficing": define 3 non-negotiable criteria before searching. Buy the first item that satisfies all three and close the tab.'
  },
  {
    id: 'payment-decoupling',
    title: 'Frictionless Payment Decoupling',
    subtitle: 'The Anesthetic Effect of Digital Money',
    category: 'Pricing',
    scientificPrinciple: 'Prelec & Loewenstein (1998): Physical cash triggers neural pain signals in the insular cortex. Biometrics (FaceID), Apple Pay, and Buy-Now-Pay-Later (BNPL) eliminate this sensory friction, making spending feel abstract.',
    retailerGoal: 'Reduce checkout friction to 0 seconds, removing the pause where rational second thoughts occur.',
    customerVulnerability: 'Installments ($25/mo for 4 months) feel mentally equivalent to $25 total, fragmenting debt awareness across multiple platforms.',
    realWorldExample: 'A customer who would hesitate at a $100 checkout cheerfully buys it because Klarna breaks it into four $25 payments.',
    interactiveType: 'friction',
    counterStrategy: 'Deliberately maintain friction: avoid saving card credentials in browsers and disable one-click checkout.'
  },
  {
    id: 'endowment-effect',
    title: 'The Virtual Cart Endowment Effect',
    subtitle: 'Psychological Ownership Before Transaction',
    category: 'Cognitive Load',
    scientificPrinciple: 'Thaler (1980): Once an object is in our mental possession, we value it substantially higher than before. Placing an item into an online cart creates premature psychological ownership.',
    retailerGoal: 'Get shoppers to click "Add to Cart" as early as possible with micro-animations and positive feedback sounds.',
    customerVulnerability: 'Removing an item from your cart feels like giving up something you already own, triggering acute loss aversion.',
    realWorldExample: 'Leaving an item in a cart for 3 days and feeling like you are "losing your jacket" if you click "Remove".',
    interactiveType: 'scarcity',
    counterStrategy: 'Use browser bookmarks instead of retailer carts. Treat the retailer cart strictly as a final checkout conveyor belt, not a closet.'
  },
  {
    id: 'sunk-cost-research',
    title: 'The Sunk Cost of Product Research',
    subtitle: 'Effort Justification & Forced Purchasing',
    category: 'Cognitive Load',
    scientificPrinciple: 'Arkes & Blumer: When individuals invest time or cognitive effort into an endeavor, they feel compelled to continue to justify the past expenditure, even if the optimal outcome is walking away empty-handed.',
    retailerGoal: 'Engage shoppers in deep customization tools, 3D viewers, and quiz funnels to maximize time investment on page.',
    customerVulnerability: '"I just spent 2 hours researching winter coats. If I close this tab without buying, I wasted my evening."',
    realWorldExample: 'Buying a mediocre product because you feel too exhausted to restart the search and refuse to walk away with "nothing to show".',
    interactiveType: 'friction',
    counterStrategy: 'Walking away empty-handed after research is a victory: you saved 100% of your money. Research is a sunk cost regardless.'
  },
  {
    id: 'return-friction-inertia',
    title: 'Return Friction Inertia',
    subtitle: 'The "Hassle Tax" on Defective Purchases',
    category: 'Post-Purchase',
    scientificPrinciple: 'Hyperbolic discounting & status quo bias: The immediate cognitive hassle of printing a label, taping a box, and driving to a drop-off center outweighs the delayed benefit of a refund.',
    retailerGoal: 'Make buying effortless (1-click) and returns multi-step (print paper labels, repackage in original box, specific courier depots).',
    customerVulnerability: 'Over 60% of items bought with the reassuring thought "I can always return it" remain unreturned and clutter the home.',
    realWorldExample: 'A $35 sweater that is two sizes too small sits on a bedroom chair for 45 days until the 30-day return window silently expires.',
    interactiveType: 'friction',
    counterStrategy: 'Assume all online purchases are 100% final sale. If you wouldn\'t buy it knowing returns are impossible, do not buy it.'
  }
];

export const DARK_PATTERNS: DarkPattern[] = [
  {
    id: 'confirmshaming',
    name: 'Confirmshaming',
    severity: 'High',
    description: 'Guilt-tripping or emotionally manipulating the shopper into opting into a discount, subscription, or email list.',
    howItWorks: 'The primary button is bright and positive ("Yes! Send my 20% discount"), while the opt-out link uses derogatory phrasing.',
    customerHarm: 'Exploits social shame and negative self-talk to extract consent and marketing access.',
    detectionTip: 'Watch for tiny grey text underneath email popups that insults your intelligence or financial goals.',
    liveExample: {
      headline: 'Unlock 15% Off Your First Order Right Now!',
      deceptiveElement: 'Claim My Exclusive VIP Discount',
      normalOption: 'No thanks, I prefer paying full price and wasting money'
    }
  },
  {
    id: 'sneak-into-basket',
    name: 'Sneak into Basket (Pre-Checked Add-ons)',
    severity: 'Severe',
    description: 'Silently adding an unrequested item, extended warranty, donation, or subscription to the customer\'s order during checkout.',
    howItWorks: 'Retailer includes a pre-ticked box for "$3.99 Shipping Protection" or "$1.99 Carbon Offset" buried between the address and payment steps.',
    customerHarm: 'Customers pay for unwanted micro-services they never requested, often noticing only after reviewing credit card statements.',
    detectionTip: 'Always expand the final order breakdown on the payment confirmation screen and inspect every line item.',
    liveExample: {
      headline: 'Order Summary & Protection',
      deceptiveElement: '✓ Add Lifetime Accidental Damage Protection ($8.99/yr - Recommended)',
      normalOption: 'Standard checkout without add-ons'
    }
  },
  {
    id: 'phantom-social-proof',
    name: 'Phantom Social Proof & Activity Bots',
    severity: 'High',
    description: 'Displaying synthetic popups claiming other shoppers are viewing or buying the same product in real time.',
    howItWorks: 'Automated notification tickers say "Sarah from Seattle just bought this 2 minutes ago!" or "34 people are viewing this right now".',
    customerHarm: 'Manufactures artificial herd behavior and false social validation to pressure immediate checkout.',
    detectionTip: 'Check if the names repeat or if the "number of viewers" never changes regardless of the time of night.',
    liveExample: {
      headline: 'Popular Item Alert',
      deceptiveElement: '🔥 42 people are looking at this item right now in your city',
      normalOption: 'Standard neutral product description'
    }
  },
  {
    id: 'roosting-subscription',
    name: 'Disguised Recurring Continuity',
    severity: 'Severe',
    description: 'Framing a recurring subscription as a one-time purchase or defaulting to a "Subscribe & Save" option.',
    howItWorks: 'The subscription option is highlighted by default with a lower price, while the one-time purchase option is greyed out or hidden in a sub-menu.',
    customerHarm: 'Unwitting shoppers find recurring $30-$50 monthly charges for months after what they believed was a single trial.',
    detectionTip: 'Always verify if the price has a "/month" or "every 30 days" cadence attached before submitting payment.',
    liveExample: {
      headline: 'Select Delivery Cadence',
      deceptiveElement: '● Auto-Ship Every 30 Days ($24.00 - Save 20% Today)',
      normalOption: '○ One-time delivery only ($30.00)'
    }
  },
  {
    id: 'urgency-resets',
    name: 'Phantom Countdown Clocks',
    severity: 'Moderate',
    description: 'Dynamic countdown clocks claiming a deal ends in minutes, which simply reset when the page is refreshed or cache is cleared.',
    howItWorks: 'A simple JavaScript timer counts down from 15:00 to 00:00. Once it hits zero, it loops back to 15:00 or refreshes tomorrow with the exact same offer.',
    customerHarm: 'Forces hasty, unvetted purchases under false pretenses of immediate expiry.',
    detectionTip: 'Open the URL in an incognito window or inspect page source to see if the timer starts over from the same minute mark.',
    liveExample: {
      headline: 'Flash Deal Expiry',
      deceptiveElement: '⏳ Special Price Ends In: 08m 42s (Price increases after)',
      normalOption: 'Regular everyday catalogue pricing'
    }
  },
  {
    id: 'hidden-costs-drip',
    name: 'Drip Pricing & Surprise Surcharges',
    severity: 'Severe',
    description: 'Incrementally revealing compulsory fees throughout the checkout funnel after the customer has invested significant time.',
    howItWorks: 'The listing states $40. At stage 2, an $8 "service fee" appears. At stage 3, a mandatory $7 "handling fee" appears. The true price is $55.',
    customerHarm: 'Exploits the customer\'s sunk-cost effort in filling out personal information to force acceptance of unexpected surcharges.',
    detectionTip: 'Compare the advertised listing price directly against the final credit card authorization number before tapping pay.',
    liveExample: {
      headline: 'Payment Step 3 of 3',
      deceptiveElement: 'Subtotal: $40.00 + Logistics Fee: $6.50 + Processing: $3.25 = $49.75',
      normalOption: 'Upfront transparent all-inclusive pricing'
    }
  }
];

export const EMPIRICAL_RESEARCH_BENCHMARKS = {
  abandonmentRate: 70.19, // Baymard Institute average
  abandonmentReasons: [
    { reason: 'Extra costs too high (shipping, taxes, fees)', percentage: 48, customerInsight: 'Surprise fee at checkout breaks the mental price contract' },
    { reason: 'Site wanted me to create an account', percentage: 24, customerInsight: 'Forced friction & password fatigue creates barrier to exit' },
    { reason: 'Delivery was too slow', percentage: 22, customerInsight: 'Instant gratification expectation unmet' },
    { reason: 'Checkout process was too long / complicated', percentage: 17, customerInsight: 'Too many form fields allows prefrontal second-guessing' },
    { reason: 'Didn\'t trust the site with credit card info', percentage: 18, customerInsight: 'Security red flags & unfamiliar merchant interfaces' },
    { reason: 'Just browsing / researching / saving for later', percentage: 58, customerInsight: 'Cart used as a temporary wishlist or emotional buffer' }
  ],
  timeOfDayImpulseShare: [
    { hour: '06:00', label: '6 AM', impulseShare: 8, intentionalShare: 92, state: 'High cognitive control & work preparation' },
    { hour: '10:00', label: '10 AM', impulseShare: 14, intentionalShare: 86, state: 'Focused utility & desktop product comparison' },
    { hour: '14:00', label: '2 PM', impulseShare: 22, intentionalShare: 78, state: 'Midday slump & brief micro-breaks' },
    { hour: '18:00', label: '6 PM', impulseShare: 35, intentionalShare: 65, state: 'Commute & relaxation transition' },
    { hour: '21:00', label: '9 PM', impulseShare: 58, intentionalShare: 42, state: 'Evening couch scrolling & retail therapy' },
    { hour: '23:00', label: '11 PM', impulseShare: 76, intentionalShare: 24, state: 'Peak ego depletion, late-night dopamine seeking' },
    { hour: '02:00', label: '2 AM', impulseShare: 84, intentionalShare: 16, state: 'Severe fatigue, impaired risk assessment' }
  ],
  categoryRegretRates: [
    { category: 'Fast Fashion & Apparel', regretRate: 64, returnRate: 24.4, averageTimeToRegret: '1-3 days', driver: 'Studio lighting vs reality, impulse fit errors' },
    { category: 'Beauty & Skincare Trends', regretRate: 52, returnRate: 11.2, averageTimeToRegret: '5-7 days', driver: 'Social media hype, duplicate drawer clutter' },
    { category: 'Novelty Kitchen Gadgets', regretRate: 48, returnRate: 8.5, averageTimeToRegret: '14 days', driver: 'Single-use fantasies (e.g. spiralizers, mini-waffle makers)' },
    { category: 'Electronics & Hardware', regretRate: 22, returnRate: 9.8, averageTimeToRegret: '30+ days', driver: 'Higher pre-purchase technical scrutiny' },
    { category: 'Books & Educational Tools', regretRate: 14, returnRate: 3.1, averageTimeToRegret: 'Rarely regretted', driver: 'Clear intrinsic personal development value' }
  ]
};

export const INITIAL_PURCHASE_LOGS: PurchaseLogItem[] = [
  {
    id: 'log-1',
    date: '2026-09-28',
    itemName: 'Merino Wool Minimalist Overshirt',
    category: 'Fashion',
    price: 110.00,
    originalPrice: 160.00,
    type: 'Planned',
    emotionalStateAtPurchase: 'Thoughtful / Planned',
    utilityRating: 5,
    stillUsed: true,
    notes: 'Researched for 3 weeks to replace a worn-out jacket. Worn 4 days a week since delivery.'
  },
  {
    id: 'log-2',
    date: '2026-09-21',
    itemName: 'Dual-Blade Avocado Slicer & Pit Remover',
    category: 'Kitchen Gadgets',
    price: 14.50,
    originalPrice: 22.00,
    type: 'Threshold Filler',
    emotionalStateAtPurchase: 'Bored / Scrolling',
    utilityRating: 1,
    stillUsed: false,
    notes: 'Added to cart to hit the $50 free shipping cutoff. A regular butter knife is 10x faster to clean.'
  },
  {
    id: 'log-3',
    date: '2026-09-14',
    itemName: 'Ergonomic Vertical Wireless Mouse',
    category: 'Electronics',
    price: 48.00,
    originalPrice: 65.00,
    type: 'Planned',
    emotionalStateAtPurchase: 'Calm & Intentional',
    utilityRating: 5,
    stillUsed: true,
    notes: 'Completely eliminated wrist strain after 8-hour design workdays.'
  },
  {
    id: 'log-4',
    date: '2026-09-02',
    itemName: 'RGB Magnetic Ambient Desk Light Bar',
    category: 'Home & Decor',
    price: 36.00,
    originalPrice: 75.00,
    type: 'Impulse',
    emotionalStateAtPurchase: 'Late-Night Dopamine',
    utilityRating: 2,
    stillUsed: false,
    notes: 'Looked gorgeous in short social media reel at midnight. Cord is awkward and colors are distracting.'
  },
  {
    id: 'log-5',
    date: '2026-08-19',
    itemName: 'Thermal Insulated Ceramic Travel Mug',
    category: 'Home Goods',
    price: 29.00,
    originalPrice: 34.00,
    type: 'Planned',
    emotionalStateAtPurchase: 'Calm & Intentional',
    utilityRating: 4,
    stillUsed: true,
    notes: 'Saved an estimated $120 on takeaway coffees over the past 6 weeks.'
  }
];

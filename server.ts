import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Initialize Gemini SDK if API key exists
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

// Endpoint for AI-powered shopping psychology & purchase advice
app.post('/api/behavior-advisor', async (req, res) => {
  try {
    const { itemName, price, originalPrice, shippingFee, freeShippingMin, urgencyText, category, reason, shoppingHour, emotionalState } = req.body;

    if (!ai) {
      // Heuristic fallback response when API key is not configured
      const savingsCalc = originalPrice && Number(originalPrice) > Number(price) ? Number(originalPrice) - Number(price) : 0;
      const isLateNight = shoppingHour ? (Number(shoppingHour) >= 21 || Number(shoppingHour) <= 4) : false;
      const hasUrgency = Boolean(urgencyText && urgencyText.trim().length > 0);
      const shippingGap = (freeShippingMin && price) ? Math.max(0, Number(freeShippingMin) - Number(price)) : 0;

      return res.json({
        analysis: {
          deceptionScore: hasUrgency ? 78 : (savingsCalc > 30 ? 64 : 32),
          urgencyReality: hasUrgency 
            ? "The countdown or stock alert is almost certainly an artificial friction trigger designed to induce fight-or-flight checkout before prefrontal scrutiny engages."
            : "No aggressive countdown detected, but visual presentation anchors focus on nominal discounts.",
          regretProbability: isLateNight ? "High (68-80%) due to circadian willpower depletion" : "Moderate (35-45%)",
          psychologicalTriggers: [
            savingsCalc > 0 ? "Anchor Pricing Effect (evaluating 'savings' rather than actual out-of-pocket loss)" : "Direct utility evaluation",
            isLateNight ? "Dopamine reward seeking under late-night ego depletion" : "Active intentional exploration",
            shippingGap > 0 ? `Free shipping threshold trap (risk of spending $${shippingGap.toFixed(2)} extra to save shipping)` : "Standard delivery calculation"
          ],
          customerAdvocateRecommendation: "Enforce a mandatory 24-hour cooling-off window. Bookmark the item or keep it in the cart without checking out. If the desire persists after 24 hours of normal daytime activity, re-evaluate true frequency of use.",
          counterActionQuestions: [
            "Would you buy this right now at this exact price in cash at a physical counter?",
            "If you couldn't return this and couldn't resell it, does it solve a genuine weekly problem?",
            "Are you buying the item, or are you buying the relief of closing the browser tab?"
          ]
        }
      });
    }

    const prompt = `You are a consumer behavioral psychologist and advocate specialized in online shopping behavior and e-commerce dark patterns.
Analyze the following shopping dilemma from the CUSTOMER'S PERSPECTIVE:
- Item: ${itemName || 'Unspecified item'}
- Current Price: $${price || '0'}
- Stated Original/Anchor Price: $${originalPrice || 'None'}
- Category: ${category || 'General'}
- Urgency / Stock Triggers Present: "${urgencyText || 'None'}"
- Shipping Fee: $${shippingFee || '0'} (Free Shipping Threshold: $${freeShippingMin || 'None'})
- Customer's Stated Reason: "${reason || 'Browsing / Saw a deal'}"
- Shopping Time: ${shoppingHour || 'Current hour'}
- Customer Emotional State: ${emotionalState || 'Neutral'}

Respond ONLY with valid JSON with the following structure:
{
  "deceptionScore": <number between 0 and 100 indicating likelihood of psychological manipulation>,
  "urgencyReality": "<2 sentences explaining whether the urgency is authentic or manufactured merchant pressure>",
  "regretProbability": "<Clear risk level like 'Low (15%)', 'Moderate (45%)', or 'High (75%)' with brief behavioral rationale>",
  "psychologicalTriggers": ["<trigger 1 with customer POV explanation>", "<trigger 2>", "<trigger 3>"],
  "customerAdvocateRecommendation": "<Actionable, non-judgmental consumer defense advice>",
  "counterActionQuestions": [
    "<sharp self-inquiry question 1>",
    "<sharp self-inquiry question 2>",
    "<sharp self-inquiry question 3>"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ analysis: parsed });
  } catch (error) {
    console.error('Advisor error:', error);
    return res.status(500).json({ error: 'Failed to generate behavioral analysis' });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

startServer();

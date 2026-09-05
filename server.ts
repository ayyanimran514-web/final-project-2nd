import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Gemini AI Assistant Endpoint
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { message, history, context } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Message string is required.' });
      }

      const apiKey = process.env.GEMINI_API_KEY;

      const systemInstruction = `You are "BUYLY AI Stylist & Store Guide", the intelligent, friendly, and expert shopping assistant for BUYLY (a cutting-edge streetwear and custom merchandise laboratory).
Your role is to guide customers, recommend products, advise on sizing and fabrics, and explain the interactive Custom Studio.

Key Store Knowledge:
- BUYLY features 18+ high-end streetwear and merchandise blanks:
  * Cyber Heavyweight Boxy Tee ($44): 280 GSM ring-spun combed cotton, oversized drop-shoulder cut, workable colors, DTG printable.
  * Sub-Zero Thermal Zip Hoodie ($88): 460 GSM brushed French Terry, double-lined hood, gunmetal zipper.
  * Tactical Matte Snapback Cap ($34): Structured 6-panel A-frame profile with embroidered logo zones.
  * Industrial Matte Ceramic Mug ($22): 14oz double-fired stoneware, dishwasher/microwave safe.
  * Impact Armor MagSafe Phone Case ($36): 10ft drop protection, N52 magnets, tactile aluminum buttons.
  * Heavy Duty 16oz Canvas Tote Bag ($28): Organic duck canvas, holds 35 lbs.
  * Vacuum Insulated Steel Thermo Flask ($32): 32oz 18/8 stainless steel, stays cold 24h.
  * Acrobat Technical Flight Bomber Jacket ($129): MA-1 cut, signal orange lining, utility arm tag.
  * Neo-Cargo Utility Flight Pants ($78): Water-resistant stretch ripstop, articulated knees, magnetic cargo pockets.
  * Acid-Washed 400 GSM Heavy Crewneck ($64): Vintage acid wash, ribbed collar V-insert.
  * Modular Cyber Sling Crossbody ($48): Cordura ballistic weatherproof bag with quick-release buckle.
  * Nomad Tech Waterproof Laptop Sleeve ($39): Memory foam bumper, fits up to 16" laptops.
  * Vessel Modular Weekend Duffle ($98): 42L carry-on with ventilated shoe compartment.
- Custom Studio:
  * Users can select base garments (Tee, Hoodie, Cap, Mug, Phone Case, etc.), change base color with real-time workable lighting, add custom curved/outlined typography, choose from sticker libraries (Cyber Skull, Tokyo Kanji, Flame, Alien, etc.), and order 1-of-1 pieces.
- Customer Service:
  * Sizing: Tees and Hoodies have an oversized streetwear boxy fit. If a customer prefers a slim fit, recommend sizing down one size.
  * Shipping: Free express shipping on orders over $75. Dispatched within 24-48 hours.
  * Returns: 30-day hassle-free return and exchange policy.

Tone & Style:
- Fashion-forward, knowledgeable, concise, warm, and helpful.
- Suggest 1-2 specific items when relevant and explain why they fit the user's inquiry.
- Keep answers formatted with clear, brief paragraphs and bullet points where helpful.`;

      if (apiKey) {
        const ai = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            }
          }
        });

        // Format conversation history if provided
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'user' ? 'user' : 'model',
              parts: [{ text: item.content }]
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.95
          }
        });

        const replyText = response.text || 'I am ready to help you explore BUYLY streetwear and custom blanks!';
        return res.json({ reply: replyText });
      }

      // Smart Fallback when GEMINI_API_KEY is not configured yet
      const lower = message.toLowerCase();
      let fallbackReply = '';

      if (lower.includes('hoodie') || lower.includes('warm') || lower.includes('heavy')) {
        fallbackReply = `The **Sub-Zero Thermal Zip Hoodie ($88)** is our top cold-weather piece! It features 460 GSM brushed French Terry cotton, a double-lined structured hood, and gunmetal hardware. It runs with an oversized streetwear drape. Would you like to check it out in Pitch Black or Bone Cream?`;
      } else if (lower.includes('tee') || lower.includes('t-shirt') || lower.includes('shirt')) {
        fallbackReply = `Our flagship **Cyber Heavyweight Boxy Tee ($44)** is crafted from 280 GSM combed ring-spun cotton. It features drop shoulders, a tight double-stitched collar that never bacon-curls, and comes in 6 workable colors ready for custom graphics in our Studio!`;
      } else if (lower.includes('custom') || lower.includes('studio') || lower.includes('print') || lower.includes('design')) {
        fallbackReply = `Our **Custom Studio** lets you create 1-of-1 pieces! You can pick any base (Tees, Hoodies, Caps, Mugs, or Phone Cases), test authentic workable dyes, type custom typography with font & outline controls, and drop stickers like Tokyo Kanji or Cyber Skulls. Tap the "Custom Studio" tab to start designing!`;
      } else if (lower.includes('size') || lower.includes('fit')) {
        fallbackReply = `Our apparel (Tees, Hoodies, Crewnecks) is designed with a modern **boxy, relaxed streetwear fit**. We recommend taking your usual size for the intended relaxed streetwear drape, or sizing down one size if you prefer a tighter athletic fit.`;
      } else if (lower.includes('price') || lower.includes('cheap') || lower.includes('under 50') || lower.includes('gift')) {
        fallbackReply = `Great budget-friendly picks under $50:
• **Tactical Matte Snapback Cap** ($34) - Structured 6-panel with sweatband
• **Impact Armor MagSafe Phone Case** ($36) - Military 10ft drop protection
• **Industrial Ceramic Mug** ($22) - 14oz double-fired matte stoneware
• **Heavy Duty Canvas Tote** ($28) - 16oz organic canvas holding 35 lbs`;
      } else {
        fallbackReply = `Welcome to BUYLY! I'm your AI Stylist and Store Guide. I can help you find heavyweight hoodies (up to 460 GSM), guide your sizing, recommend colorways, or explain how to create custom merchandise in our interactive 3D studio. What are you looking to style today?`;
      }

      return res.json({ reply: fallbackReply });
    } catch (error: any) {
      console.error('Gemini chat error:', error);
      return res.status(500).json({ 
        error: 'Failed to process AI assistant request',
        details: error?.message || 'Unknown error'
      });
    }
  });

  // Vite middleware in dev or static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BUYLY Server running on port ${PORT}`);
  });
}

startServer();

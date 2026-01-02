import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

async function getCityImage(city: string) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) return null;
  
  try {
    const response = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(city + " travel")}&per_page=1`, {
      headers: {
        Authorization: `Client-ID ${accessKey}`
      }
    });
    const data = await response.json();
    return data.results?.[0]?.urls?.regular || null;
  } catch (error) {
    console.error("Unsplash error:", error);
    return null;
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get(api.travel.search.path, async (req, res) => {
    const { city } = req.query;
    if (!city || typeof city !== 'string') return res.status(400).json({ message: "City is required" });

    try {
      const cityImage = await getCityImage(city);
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          {
            role: "system",
            content: "You are a travel assistant. Return a JSON object with: summary (string), country (string), coordinates ({lat, lon}), and attractions (array of {name, description, rating (number 1-5)}). Do not use unknown as country."
          },
          { role: "user", content: `Tell me about ${city}` }
        ],
        response_format: { type: "json_object" },
      });

      const data = JSON.parse(response.choices[0].message.content || "{}");
      
      // Enrich attractions with images if possible
      const enrichedAttractions = await Promise.all((data.attractions || []).slice(0, 3).map(async (attr: any) => ({
        ...attr,
        image: await getCityImage(`${city} ${attr.name}`)
      })));

      res.json({
        ...data,
        cityImage,
        attractions: enrichedAttractions
      });
    } catch (error) {
      console.error("Travel search error:", error);
      res.status(500).json({ message: "Failed to fetch travel info" });
    }
  });

  app.post(api.chat.send.path, async (req, res) => {
    try {
      const { message } = api.chat.send.input.parse(req.body);
      await storage.createMessage({ role: 'user', content: message });

      const completion = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: "You are a helpful travel assistant. Help users plan their trips and answer questions about destinations." },
          { role: "user", content: message }
        ],
      });

      const aiContent = completion.choices[0].message.content || "I couldn't generate a response.";
      await storage.createMessage({ role: 'assistant', content: aiContent });

      res.json({ role: 'assistant', content: aiContent });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Chat failed" });
    }
  });

  app.get(api.chat.history.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.get(api.itineraries.list.path, async (req, res) => {
    const items = await storage.getItineraries();
    res.json(items);
  });

  app.post(api.itineraries.create.path, async (req, res) => {
    try {
      const input = api.itineraries.create.input.parse(req.body);
      const item = await storage.createItinerary(input);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ message: "Invalid input" });
    }
  });

  app.post(api.itineraries.generate.path, async (req, res) => {
    try {
      const { city, days, preferences } = req.body;
      const prompt = `Create a ${days}-day itinerary for ${city}. Preferences: ${preferences || 'General'}. Return JSON with structure: { destination: "${city}", content: { days: [{day: 1, title: "...", activities: [...]}] } }`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      const saved = await storage.createItinerary({
        destination: city,
        content: result.content
      });

      res.json(saved);
    } catch (error) {
      console.error("Itinerary gen error:", error);
      res.status(500).json({ message: "Failed to generate itinerary" });
    }
  });

  app.get(api.itineraries.get.path, async (req, res) => {
    const item = await storage.getItinerary(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  });

  return httpServer;
}

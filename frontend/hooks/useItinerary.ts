"use client";

import { useState, useCallback } from "react";
import { ChatMessage, ItineraryTab } from "@/types";
import { generateId } from "@/lib/utils";

// ─── Mock AI Responses ────────────────────────────────────────

const AI_RESPONSES: string[] = [
  "Great idea! I've updated your itinerary to include more culinary experiences. Days 2 and 4 now feature a cooking class and a street food tour.",
  "Done! I've swapped the Odaiba visit with a relaxing onsen experience at Oedo-Onsen Monogatari. A perfect way to unwind mid-trip.",
  "I've condensed the itinerary to 5 days, keeping the top highlights: Senso-ji, Shibuya Crossing, TeamLab Borderless, Mt. Fuji, and Akihabara.",
  "The estimated total budget is $2,400 for 2 people over 7 days — roughly $171/person/day. Accommodation takes the largest share at ~41%.",
  "I've adjusted Day 3 and 5 with more family-friendly activities: a visit to DisneySea, the Ghibli Museum (book in advance!), and Ueno Zoo.",
  "No problem! I can make that change. What else would you like to adjust about your Tokyo itinerary?",
];

let responseIndex = 0;
function getNextAIResponse() {
  const response = AI_RESPONSES[responseIndex % AI_RESPONSES.length];
  responseIndex++;
  return response;
}

// ─── Hook ─────────────────────────────────────────────────────

export function useItinerary() {
  const [activeTab, setActiveTab] = useState<ItineraryTab>("itinerary");
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-0",
      role: "assistant",
      content: "I've built your 7-day Tokyo itinerary! Want me to adjust anything? I can swap activities, change the pace, or add more focus on specific interests like food, art, or nightlife.",
      timestamp: new Date(Date.now() - 120000).toISOString(),
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: generateId("msg"),
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMsg: ChatMessage = {
        id: generateId("msg"),
        role: "assistant",
        content: getNextAIResponse(),
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  }, []);

  const scrollToDay = useCallback((dayIndex: number) => {
    setActiveDayIndex(dayIndex);
    setActiveTab("itinerary");
    const el = document.getElementById(`day-${dayIndex + 1}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  return {
    activeTab,
    setActiveTab,
    activeDayIndex,
    setActiveDayIndex,
    scrollToDay,
    chatOpen,
    setChatOpen,
    messages,
    chatInput,
    setChatInput,
    isTyping,
    sendMessage,
  };
}

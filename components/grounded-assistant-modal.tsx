'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  X,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Bot,
  User,
  Info,
  Globe,
} from 'lucide-react';
import { queryHeatAssistant, AssistantResponse, AssistantQueryContext } from '@/lib/assistant-engine';
import { calculateThermalMetrics } from '@/lib/thermal-engine';
import { SupportedLanguage } from '@/lib/localization';

interface GroundedAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: string;
  currentTemp: number;
  currentHumidity: number;
  currentPvs?: number;
  alertLevel?: string;
}

type ChatMessage = {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  structured_data?: Record<string, string | number>;
  timestamp: string;
};

export function GroundedAssistantModal({
  isOpen,
  onClose,
  currentCity,
  currentTemp,
  currentHumidity,
  currentPvs = 68,
  alertLevel = 'Warning',
}: GroundedAssistantModalProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputQuery, setInputQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<SupportedLanguage>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const thermal = calculateThermalMetrics(currentTemp, currentHumidity);

  // Initialize initial greeting once
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          sender: 'assistant',
          text: `Greetings. I am the MoES/NCMRWF Grounded AI Heat Intelligence Assistant for ${currentCity}. I can provide real-time explanations of thermal indices (HTSS ${thermal.htss_score}/100, WBGT ${thermal.wbgt_c}°C), ward vulnerability rankings, hospital readiness directives, What-If weather simulations, and regional language advisories. How can I assist disaster authorities today?`,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }
  }, [currentCity, thermal.htss_score, thermal.wbgt_c, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuery('');

    const context: AssistantQueryContext = {
      current_city: currentCity,
      current_ward: 'Ward 12 - Shivajinagar',
      thermal,
      pvs_score: currentPvs,
      health_risk_score: 75.4,
      alert_level: alertLevel,
      language: selectedLanguage,
    };

    const response: AssistantResponse = queryHeatAssistant(textToSend, context);

    const assistantMsg: ChatMessage = {
      id: `ast-${Date.now()}`,
      sender: 'assistant',
      text: response.answer,
      structured_data: response.structured_data_points,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, assistantMsg]);

    // Optional voice synthesis
    if ('speechSynthesis' in window && isSpeaking) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(response.answer.replace(/•|\*/g, ''));
      if (selectedLanguage === 'hi') utterance.lang = 'hi-IN';
      else if (selectedLanguage === 'mr') utterance.lang = 'mr-IN';
      else if (selectedLanguage === 'kn') utterance.lang = 'kn-IN';
      else utterance.lang = 'en-IN';
      window.speechSynthesis.speak(utterance);
    }
  };

  const samplePrompts = [
    `Why is ${currentCity} at high risk?`,
    'Which wards are currently at extreme risk?',
    'What should authorities do today?',
    'What happens if temperature increases by 2°C?',
    'Which cooling centers are closest to high-risk areas?',
    'Generate a public heat advisory.',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-xs">
      <div className="flex h-[88vh] max-h-[780px] w-full max-w-4xl flex-col overflow-hidden rounded-lg border border-[#000000] bg-white shadow-none animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-[#d9d9d9] bg-white px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">
              <Sparkles className="h-5 w-5 text-[#7ffeb1]" />
            </div>
            <div>
              <div className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#000000]">
                GROUNDED AI ASSISTANT · HEAT INTELLIGENCE
              </div>
              <h3 className="font-bold text-[#000000] text-base uppercase tracking-[0.06em]">
                Operational Telemetry & Decision Support
              </h3>
              <p className="text-xs text-[#595959] tracking-[0.06em]">
                Live telemetry for {currentCity} • MoES / NCMRWF Decision Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 rounded-full border border-[#d9d9d9] bg-white px-3 py-1 text-xs text-[#000000]">
              <Globe className="h-3.5 w-3.5 text-black" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold uppercase tracking-[0.06em] text-[#000000] focus:outline-none cursor-pointer"
              >
                <option value="en">EN</option>
                <option value="hi">हिन्दी</option>
                <option value="mr">मराठी</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
            </div>

            {/* Voice toggle */}
            <button
              onClick={() => {
                if (isSpeaking && 'speechSynthesis' in window) {
                  window.speechSynthesis.cancel();
                }
                setIsSpeaking(!isSpeaking);
              }}
              title={isSpeaking ? 'Mute speech output' : 'Enable voice read-aloud'}
              className={`rounded-full border p-2 transition ${
                isSpeaking
                  ? 'border-black bg-black text-white'
                  : 'border-[#d9d9d9] bg-white text-[#595959] hover:text-black'
              }`}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="rounded-full border border-[#000000] bg-white p-2 text-[#000000] hover:bg-black hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto bg-[#eeeeee] p-5 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                    isBot
                      ? 'border-[#d9d9d9] bg-white text-black'
                      : 'border-black bg-black text-white'
                  }`}
                >
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-lg p-4 text-xs leading-relaxed tracking-[0.06em] ${
                    isBot
                      ? 'border border-[#d9d9d9] bg-white text-[#000000] shadow-none'
                      : 'bg-[#000000] text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Structured Data Attachment if available */}
                  {msg.structured_data && (
                    <div className="mt-3 rounded-md border border-[#d9d9d9] bg-[#eeeeee] p-3 text-black">
                      <div className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#000000] mb-2">
                        GROUNDED APPLICATION TELEMETRY
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(msg.structured_data).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-[#d9d9d9] pb-1">
                            <span className="text-[#595959]">{k}:</span>
                            <strong className="text-black font-mono">{String(v)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`mt-2 block font-mono text-[10px] tracking-[0.06em] text-right ${isBot ? 'text-[#808080]' : 'text-white/60'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-[#d9d9d9] bg-white px-5 py-3">
          <div className="font-mono text-[10px] font-bold uppercase tracking-[0.06em] text-[#595959] mb-2">
            SUGGESTED GROUNDED INQUIRIES:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 rounded-full border border-[#d9d9d9] bg-white px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-[#000000] hover:bg-black hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-[#d9d9d9] bg-white p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2.5"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask anything regarding heat risk, cooling centers, or response action in ${currentCity}...`}
              className="flex-1 rounded-full border border-[#d9d9d9] bg-white px-4 py-2.5 text-xs text-[#000000] placeholder-[#808080] focus:border-[#000000] focus:outline-none transition tracking-[0.06em]"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="flex items-center gap-1.5 rounded-full bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-[0.06em] text-white transition hover:opacity-85 shadow-none disabled:opacity-40 disabled:cursor-not-allowed border border-black"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Query</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

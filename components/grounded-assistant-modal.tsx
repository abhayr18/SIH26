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
  Activity,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 font-sans backdrop-blur-xs">
      <div className="flex h-[88vh] max-h-[760px] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-white shadow-xs">
              <Sparkles className="h-4.5 w-4.5 text-blue-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-blue-600">
                  GROUNDED AI ASSISTANT
                </span>
                <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.2 font-mono text-[9px] text-slate-600">
                  MoES / NCMRWF
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                Operational Heat Telemetry & Decision Support
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-medium text-slate-800 focus:outline-none cursor-pointer"
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
              className={`rounded-lg border p-1.5 transition ${
                isSpeaking
                  ? 'border-blue-600 bg-blue-600 text-white'
                  : 'border-slate-200 bg-white text-slate-500 hover:text-slate-900'
              }`}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto bg-slate-50 p-5 sm:p-6 space-y-3.5">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg border text-xs font-semibold ${
                    isBot
                      ? 'border-slate-200 bg-white text-blue-600 shadow-2xs'
                      : 'border-slate-900 bg-slate-900 text-white shadow-2xs'
                  }`}
                >
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed ${
                    isBot
                      ? 'border border-slate-200 bg-white text-slate-800 shadow-2xs'
                      : 'bg-slate-900 text-white shadow-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Structured Data Attachment if available */}
                  {msg.structured_data && (
                    <div className="mt-2.5 rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-slate-800">
                      <div className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                        GROUNDED APPLICATION TELEMETRY
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(msg.structured_data).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-slate-200/60 pb-0.5">
                            <span className="text-slate-500">{k}:</span>
                            <strong className="text-slate-900 font-mono">{String(v)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className={`mt-1.5 block font-mono text-[9.5px] text-right ${isBot ? 'text-slate-400' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-slate-200 bg-white px-5 py-2.5">
          <div className="font-mono text-[9.5px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            SUGGESTED GROUNDED INQUIRIES:
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-300 px-3 py-1 text-xs text-slate-700 transition font-medium"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 bg-white p-3.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={`Ask anything regarding heat risk, cooling centers, or response action in ${currentCity}...`}
              className="flex-1 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 px-4 py-2 text-xs font-medium text-white transition shadow-xs disabled:opacity-40 disabled:cursor-not-allowed border border-slate-900"
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

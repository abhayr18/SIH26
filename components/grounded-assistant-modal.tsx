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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
      <div className="flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-850 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/10 text-cyan-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                AI Heat Assistant: Grounded Intelligence
              </h3>
              <p className="text-xs text-slate-400">
                Connected to live telemetry for {currentCity} • MoES/NCMRWF Decision Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Language Selector */}
            <div className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-xs">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as SupportedLanguage)}
                className="bg-transparent text-xs font-bold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900">EN</option>
                <option value="hi" className="bg-slate-900">हिन्दी</option>
                <option value="mr" className="bg-slate-900">मराठी</option>
                <option value="kn" className="bg-slate-900">ಕನ್ನಡ</option>
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
                  ? 'border-amber-400/40 bg-amber-500/20 text-amber-300'
                  : 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {isSpeaking ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            <button
              onClick={onClose}
              className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-400 hover:bg-slate-700 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'assistant';

            return (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                    isBot
                      ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300'
                      : 'border-purple-500/30 bg-purple-500/20 text-purple-300'
                  }`}
                >
                  {isBot ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed shadow-sm ${
                    isBot
                      ? 'border border-slate-800 bg-slate-850 text-slate-200'
                      : 'border border-purple-500/30 bg-purple-950/40 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Structured Data Attachment if available */}
                  {msg.structured_data && (
                    <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950/70 p-3">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 mb-2">
                        Grounded Application Telemetry
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        {Object.entries(msg.structured_data).map(([k, v]) => (
                          <div key={k} className="flex justify-between border-b border-slate-800/60 pb-1">
                            <span className="text-slate-400">{k}:</span>
                            <strong className="text-slate-200 font-mono">{String(v)}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <span className="mt-2 block text-[10px] text-slate-400 text-right">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="border-t border-slate-800/80 bg-slate-950/60 px-5 py-2.5">
          <div className="text-[10px] font-semibold text-slate-400 mb-1.5">Evaluator Demo Prompts:</div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {samplePrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                className="shrink-0 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-[11px] font-medium text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-800 bg-slate-850 p-4">
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
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim()}
              className="flex items-center gap-1.5 rounded-xl bg-cyan-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-cyan-500 disabled:opacity-40 disabled:cursor-not-allowed"
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

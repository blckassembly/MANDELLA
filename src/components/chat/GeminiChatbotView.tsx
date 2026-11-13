import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  ShieldCheck,
  ChevronDown,
  Info,
  Sliders,
  Zap,
  Flame,
  Brain,
  MessageSquare,
  Network,
  Cpu,
  Layers,
  Clock,
  Settings
} from 'lucide-react';
import {
  ChatMessage,
  CHAT_PERSONAS,
  MODEL_CONFIGS,
  GeminiModelId,
  ChatRolePersona,
  sendChatMessage
} from '../../services/geminiChatService';
import { Badge, Button } from '../../design-system';

interface GeminiChatbotViewProps {
  initialPersonaId?: string;
  className?: string;
  onClose?: () => void;
}

export const GeminiChatbotView: React.FC<GeminiChatbotViewProps> = ({
  initialPersonaId = 'secops_architect',
  className = '',
  onClose
}) => {
  // Active Persona State
  const [selectedPersona, setSelectedPersona] = useState<ChatRolePersona>(() => {
    return CHAT_PERSONAS.find((p) => p.id === initialPersonaId) || CHAT_PERSONAS[0];
  });

  // Active Model State (gemini-3.8-flash by default for general tasks)
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>('gemini-3.8-flash');

  // Custom System Instruction overrides
  const [systemInstructionText, setSystemInstructionText] = useState<string>(
    selectedPersona.systemInstruction
  );
  const [showSystemConfig, setShowSystemConfig] = useState<boolean>(false);

  // Multi-Turn Message History
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'model',
      content: `Hello! I am your **${selectedPersona.name}** powered by Google Gemini.\n\nI am equipped with authoritative protocol knowledge across GSMA FS.11/FS.19 signaling firewalls, SGP.22 eUICC Ed25519 hardware attestation, and sovereign carrier routing.\n\nHow can I assist your operations today? You can select from the quick prompt chips below or type any question.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
      latencyMs: 120,
      personaId: selectedPersona.id
    }
  ]);

  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of thread
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Update system instruction when persona changes
  const handlePersonaChange = (newPersona: ChatRolePersona) => {
    setSelectedPersona(newPersona);
    setSystemInstructionText(newPersona.systemInstruction);
    setSelectedModel(newPersona.defaultModel);

    // Append role switch notification in thread
    setMessages((prev) => [
      ...prev,
      {
        id: `switch-${Date.now()}`,
        role: 'model',
        content: `*Switched role to **${newPersona.name}** (${newPersona.badge}). System instruction updated to prioritize ${newPersona.description.toLowerCase()}*`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: newPersona.defaultModel,
        personaId: newPersona.id
      }
    ]);
  };

  // Submit message
  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      model: selectedModel,
      personaId: selectedPersona.id
    };

    const updatedThread = [...messages, userMsg];
    setMessages(updatedThread);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await sendChatMessage({
        messages: updatedThread,
        model: selectedModel,
        systemInstruction: systemInstructionText
      });

      const modelMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        content: response.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: response.model,
        latencyMs: response.latencyMs,
        personaId: selectedPersona.id
      };

      setMessages((prev) => [...prev, modelMsg]);
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: 'model',
        content: `**Error communicating with Gemini model**: ${err.message || 'Unknown network error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
        personaId: selectedPersona.id
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `cleared-${Date.now()}`,
        role: 'model',
        content: `Conversation history cleared. Ready for your next query as **${selectedPersona.name}**.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        model: selectedModel,
        personaId: selectedPersona.id
      }
    ]);
  };

  return (
    <div className={`flex flex-col h-full bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl ${className}`}>
      {/* Top Header: Role Persona & Model Selector */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${selectedPersona.avatarColor} flex items-center justify-center text-white shadow-md shadow-emerald-500/10`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">Mandela Telecom AI Copilot</h3>
                <span className="bg-emerald-950 border border-emerald-500/30 text-emerald-400 text-[10px] px-2 py-0.5 rounded-full font-mono font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Gemini
                </span>
              </div>
              <p className="text-xs text-slate-400 line-clamp-1">{selectedPersona.name} · {selectedPersona.badge}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => setShowSystemConfig(!showSystemConfig)}
              className={`p-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center gap-1.5 ${
                showSystemConfig
                  ? 'bg-amber-400/10 border-amber-400/40 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="View / Edit Role System Instruction"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Role Prompt</span>
            </button>

            <button
              onClick={handleClearHistory}
              className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors text-xs"
              title="Clear Conversation History"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white transition-colors text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Persona Selector Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
          {CHAT_PERSONAS.map((persona) => {
            const isSelected = selectedPersona.id === persona.id;
            return (
              <button
                key={persona.id}
                onClick={() => handlePersonaChange(persona)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 border ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500/50 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className={`w-2 h-2 rounded-full bg-gradient-to-tr ${persona.avatarColor}`} />
                <span>{persona.badge}</span>
              </button>
            );
          })}
        </div>

        {/* Model Selector Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs">
          <span className="text-[11px] text-slate-500 font-medium">Model Architecture:</span>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(Object.keys(MODEL_CONFIGS) as GeminiModelId[]).map((mId) => {
              const cfg = MODEL_CONFIGS[mId];
              const isSelected = selectedModel === mId;
              return (
                <button
                  key={mId}
                  onClick={() => setSelectedModel(mId)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all border ${
                    isSelected
                      ? `${cfg.badgeColor} font-bold shadow-sm ring-1 ring-white/10`
                      : 'bg-slate-900/50 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={`${cfg.description} (Best for: ${cfg.bestFor})`}
                >
                  <span className="font-semibold">{cfg.label}</span>
                  <span className="text-[10px] ml-1.5 opacity-80 uppercase tracking-wider">
                    ({cfg.tag})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* System Instruction Drawer (Collapsible) */}
        {showSystemConfig && (
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-2 mt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-amber-300 font-mono">
                System Instruction · {selectedPersona.name}
              </span>
              <button
                onClick={() => setSystemInstructionText(selectedPersona.systemInstruction)}
                className="text-[10px] text-slate-400 hover:text-white underline"
              >
                Reset to Default
              </button>
            </div>
            <textarea
              value={systemInstructionText}
              onChange={(e) => setSystemInstructionText(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-xs font-mono text-slate-300 focus:border-amber-400 focus:outline-none"
            />
            <p className="text-[10px] text-slate-500">
              This prompt is supplied in the <code className="text-slate-400">config.systemInstruction</code> payload to prime Gemini with role-specific domain expertise.
            </p>
          </div>
        )}
      </div>

      {/* Middle: Scrollable Message Thread */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900/40">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white shadow-sm ${
                  isUser
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                    : `bg-gradient-to-tr ${selectedPersona.avatarColor}`
                }`}
              >
                {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
              </div>

              {/* Message Content Bubble */}
              <div
                className={`max-w-[85%] rounded-xl p-3.5 text-xs transition-all ${
                  isUser
                    ? 'bg-amber-400/10 border border-amber-400/30 text-white ml-auto'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-200 shadow-sm'
                }`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between gap-3 pb-1.5 mb-1.5 border-b border-slate-800/60 text-[10px] text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-300">
                      {isUser ? 'You (Telecom Ops)' : selectedPersona.name}
                    </span>
                    {!isUser && msg.model && (
                      <span className="bg-slate-900 px-1.5 py-0.2 rounded font-mono text-slate-400 border border-slate-800">
                        {msg.model}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {msg.latencyMs && (
                      <span className="text-sky-400 font-mono text-[9px]">
                        {msg.latencyMs}ms
                      </span>
                    )}
                    <span>{msg.timestamp}</span>
                    <button
                      onClick={() => handleCopyMessage(msg.id, msg.content)}
                      className="text-slate-500 hover:text-slate-300 ml-1"
                      title="Copy message content"
                    >
                      {copiedMessageId === msg.id ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Rendered Text with Markdown-like styling */}
                <div className="prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed space-y-2 break-words">
                  {msg.content.split('\n\n').map((paragraph, pIdx) => {
                    // Code block
                    if (paragraph.startsWith('```')) {
                      const cleanCode = paragraph.replace(/```[a-z]*\n?/g, '').replace(/```$/g, '');
                      return (
                        <pre key={pIdx} className="bg-slate-900 border border-slate-800 p-2.5 rounded font-mono text-[11px] overflow-x-auto text-emerald-400">
                          <code>{cleanCode}</code>
                        </pre>
                      );
                    }
                    // Heading 3
                    if (paragraph.startsWith('### ')) {
                      return (
                        <h4 key={pIdx} className="font-bold text-amber-300 text-xs mt-2 mb-1">
                          {paragraph.replace('### ', '')}
                        </h4>
                      );
                    }
                    // Bullet list
                    if (paragraph.startsWith('- ') || paragraph.startsWith('* ')) {
                      return (
                        <ul key={pIdx} className="list-disc pl-4 space-y-1">
                          {paragraph.split('\n').map((li, lIdx) => (
                            <li key={lIdx}>
                              {renderFormattedText(li.replace(/^[-*]\s+/, ''))}
                            </li>
                          ))}
                        </ul>
                      );
                    }
                    return <p key={pIdx}>{renderFormattedText(paragraph)}</p>;
                  })}
                </div>
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3">
            <div className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs font-bold text-white bg-gradient-to-tr ${selectedPersona.avatarColor}`}>
              <Bot className="w-3.5 h-3.5 animate-pulse" />
            </div>
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 flex items-center gap-2">
              <span className="flex space-x-1">
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-2 h-2 bg-amber-400 rounded-full animate-bounce"></span>
              </span>
              <span className="font-mono text-[11px] text-slate-400">
                Generating response with {MODEL_CONFIGS[selectedModel].label}...
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800/80">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-[10px] text-slate-500 uppercase font-mono shrink-0 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            Suggested:
          </span>
          {selectedPersona.samplePrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-full border border-slate-800 transition-colors shrink-0 truncate max-w-xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Composer */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="flex items-end gap-2 bg-slate-900 border border-slate-800 rounded-xl p-2 focus-within:border-amber-400/50 transition-colors">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${selectedPersona.name} about telecom security, protocols, or routing... (Enter to send, Shift+Enter for newline)`}
            rows={2}
            className="flex-1 bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none resize-none font-sans"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={!inputPrompt.trim() || isLoading}
            className="p-2 rounded-lg bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 font-bold transition-colors shrink-0"
            title="Send prompt to Gemini"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 px-1 font-mono">
          <span>Active Model: {MODEL_CONFIGS[selectedModel].label} · Multi-Turn Context Enforced</span>
          <span>Shift + Enter for new line</span>
        </div>
      </div>
    </div>
  );
};

// Helper for bold and inline code in message paragraphs
function renderFormattedText(text: string) {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`|\*.*?\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="text-white font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="bg-slate-900 px-1 py-0.5 rounded text-emerald-400 font-mono text-[11px] border border-slate-800">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <em key={i} className="text-slate-300 italic">
          {part.slice(1, -1)}
        </em>
      );
    }
    return part;
  });
}

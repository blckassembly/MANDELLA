import React from 'react';
import { GeminiChatbotView } from './GeminiChatbotView';

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPersonaId?: string;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({
  isOpen,
  onClose,
  initialPersonaId
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-4xl h-[88vh] max-h-[820px] relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <GeminiChatbotView
          initialPersonaId={initialPersonaId}
          onClose={onClose}
          className="h-full"
        />
      </div>
    </div>
  );
};

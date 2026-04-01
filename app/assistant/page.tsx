'use client';

import { useState, useRef, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_PROMPTS = [
  'How can I save more money?',
  'Analyze my spending patterns',
  'Budget recommendations',
  'How to reach my financial goals?',
];

const AI_RESPONSES = {
  'how can i save more money?':
    'Based on your spending, here are some actionable savings tips: 1. Reduce dining out by 20% (could save ~240 ETB/month), 2. Look for cheaper internet/utility providers, 3. Set up automatic savings transfers right after payday.',
  'analyze my spending patterns':
    'Your analysis shows: Rent is your largest expense (38%), followed by food (13%). Your spending has been consistent with a slight uptick in March. Consider negotiating rent or looking for alternative housing to optimize your budget.',
  'budget recommendations':
    'I recommend: Emergency fund (6 months expenses) = 45,000 ETB, Allocate 50% to needs, 30% to wants, 20% to savings. Currently you&apos;re at 39% needs, 12% wants, 39% savings - which is healthy!',
  'how to reach my financial goals?':
    'Your goals are ambitious! Track progress monthly, automate savings, reduce discretionary spending, and consider additional income sources. You&apos;re on track for your laptop goal at 40% completion.',
};

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hello! I&apos;m your AI financial assistant. I can help you analyze your spending, create budgets, and reach your financial goals. What would you like to know?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const lowerInput = input.toLowerCase();
    let responseText = '';

    // Simple pattern matching for demo
    if (
      lowerInput.includes('save') ||
      lowerInput.includes('saving') ||
      lowerInput.includes('spend less')
    ) {
      responseText =
        AI_RESPONSES['how can i save more money?'];
    } else if (
      lowerInput.includes('pattern') ||
      lowerInput.includes('spending') ||
      lowerInput.includes('analyze')
    ) {
      responseText =
        AI_RESPONSES['analyze my spending patterns'];
    } else if (
      lowerInput.includes('budget') ||
      lowerInput.includes('recommend')
    ) {
      responseText =
        AI_RESPONSES['budget recommendations'];
    } else if (
      lowerInput.includes('goal') ||
      lowerInput.includes('reach') ||
      lowerInput.includes('achieve')
    ) {
      responseText =
        AI_RESPONSES['how to reach my financial goals?'];
    } else {
      responseText =
        'That&apos;s a great question! Based on your financial data, I can provide more specific guidance. Try asking about your spending patterns, savings goals, or budget recommendations.';
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: responseText,
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleSuggestedPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Financial Assistant
          </h1>
          <p className="text-muted-foreground">
            Ask me anything about your finances. I&apos;m here to help you make smarter
            financial decisions.
          </p>
        </div>

        {/* Chat Container */}
        <Card className="border-border/30 bg-card flex flex-col h-[600px]">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-sm px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-accent text-accent-foreground rounded-br-none'
                      : 'bg-secondary text-foreground rounded-bl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-foreground px-4 py-2 rounded-lg rounded-bl-none">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Prompts (show if no user messages yet) */}
          {messages.length === 1 && !isLoading && (
            <div className="px-6 py-4 border-t border-border/30">
              <p className="text-xs text-muted-foreground mb-3">
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSuggestedPrompt(prompt)}
                    className="px-3 py-1 text-xs bg-secondary hover:bg-secondary/80 text-foreground rounded-full transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="border-t border-border/30 p-4">
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                placeholder="Ask about your finances..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
                className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Send</span>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

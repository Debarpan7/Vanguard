"use client";

import { FormEvent, useState } from "react";
import {
  answerChat,
  ChatbotSource,
  promptAsk,
} from "@/lib/chatbot";
import { SurfaceCard } from "@/components/surface";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
  sources: readonly ChatbotSource[];
}

/** Example question chips — decided set (ticket 09, answer 2), rendered so
 * a first-time reader can try the chatbot with one click. */
const EXAMPLE_QUESTIONS: readonly string[] = [
  "What is Vanguard's AUM?",
  "AUM trend over 5 years",
  "Compare Vanguard's AUM to BlackRock",
  "What are the improvement opportunities?",
  "Is Vanguard client-owned?",
];

/**
 * Client chat view (ticket 18 — live grounded chatbot). The retrieval engine
 * runs entirely in-browser (ticket 09, decision D5): typing a question
 * produces a grounded answer or a fixed refusal, with sources rendered as
 * real links. No API route, no network.
 */
export function ChatbotView() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<readonly ChatMessage[]>([]);

  const submit = (raw: string) => {
    const question = raw.trim();
    if (!question) return;
    const response = answerChat(question);
    setMessages((previous) => [
      ...previous,
      { role: "user", text: question, sources: [] },
      { role: "assistant", text: response.text, sources: response.sources },
    ]);
    setInput("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(input);
  };

  const assistantGreeting: ChatMessage = {
    role: "assistant",
    text: promptAsk,
    sources: [],
  };
  const isEmpty = messages.length === 0;

  return (
    <div className="mt-6">
      <SurfaceCard
        data-testid="chatbot-messages"
        className="max-h-[28rem] space-y-4 overflow-y-auto bg-navy-50 dark:bg-navy-950"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {isEmpty && (
          <p className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            {assistantGreeting.text}
          </p>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[85%] rounded-lg px-3 py-2 text-sm leading-6 ${
                message.role === "user"
                  ? "bg-zinc-900 text-zinc-50 dark:bg-zinc-100 dark:text-zinc-900"
                  : "border border-zinc-200 bg-white text-zinc-800 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
              }`}
              data-testid={`chat-message-${message.role}`}
            >
              <p>{message.text}</p>
              {message.sources.length > 0 && (
                <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
                  Sources:{" "}
                  {message.sources.map((source, sourceIndex) => (
                    <a
                      key={`${source.name}-${sourceIndex}`}
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-2 hover:text-zinc-700 dark:hover:text-zinc-200"
                    >
                      {source.name}
                    </a>
                  ))}
                </p>
              )}
            </div>
          </div>
        ))}
      </SurfaceCard>

      <div className="mt-4">
        <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Try asking
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {EXAMPLE_QUESTIONS.map((question) => (
            <button
              key={question}
              type="button"
              onClick={() => submit(question)}
              className="rounded-full border border-zinc-300 px-3 py-1 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <label htmlFor="chatbot-input" className="sr-only">
          Your question
        </label>
        <input
          id="chatbot-input"
          data-testid="chatbot-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask about Vanguard's metrics, benchmarking, RoE, or improvement reads"
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100"
        />
        <button
          type="submit"
          data-testid="chatbot-send"
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-50 hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Ask
        </button>
      </form>
    </div>
  );
}

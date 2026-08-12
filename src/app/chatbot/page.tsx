import { ChatbotView } from "@/components/chatbot-view";

/**
 * Chatbot page (ticket 18 — live grounded chatbot). Hosts the client chat
 * view; the retrieval engine runs in-browser (ticket 09, decisions D1/D5).
 */
export default function ChatbotPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
        Chatbot
      </h1>
      <p className="mt-3 leading-7 text-zinc-600 dark:text-zinc-400">
        Ask questions about Vanguard&apos;s metrics, benchmarking, and RoE
        analysis — answers grounded in the fact base with sources. Investment,
        regulatory, and legal advice are out of scope.
      </p>
      <ChatbotView />
    </div>
  );
}

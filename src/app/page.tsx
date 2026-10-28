"use client";

import { useState } from "react";
import rules from "./rules.json";

type Rule = {
  intent: string;
  keywords: string[];
  reply: string;
};

type Message = {
  id: number;
  sender: "bot" | "user";
  text: string;
};

const chatbotRules = rules as Rule[];

const greeting: Message = {
  id: 1,
  sender: "bot",
  text: "Hello, sweet tooth! 🍰 Welcome to Crumb & Co. Ask me about our cakes, cupcakes, brownies, flavors, prices, or custom cakes."
};

const quickQuestions = [
  "Cake Menu",
  "Cupcakes",
  "Prices",
  "Cake Flavors",
  "Custom Cakes",
  "Delivery"
];

function normalizeMessage(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

function getBotReply(message: string): string {
  const normalizedMessage = normalizeMessage(message);

  for (const rule of chatbotRules) {
    const matched = rule.keywords.some((keyword) => {
      const escapedKeyword = normalizeMessage(keyword).replace(
        /[.*+?^${}()|[\]\\]/g,
        "\\$&"
      );

      const pattern = new RegExp(
        `(^|[^a-z0-9])${escapedKeyword}($|[^a-z0-9])`,
        "i"
      );

      return pattern.test(normalizedMessage);
    });

    if (matched) {
      return rule.reply;
    }
  }

  return "Sorry, I couldn't find an answer to that question. 😊 Ask me about our cake menu, flavors, prices, custom cakes, or delivery.";
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([greeting]);
  const [input, setInput] = useState("");

  function sendMessage(text: string = input) {
    const userText = text.trim();

    if (!userText) return;

    const userMessage: Message = {
      id: Date.now(),
      sender: "user",
      text: userText
    };

    const botMessage: Message = {
      id: Date.now() + 1,
      sender: "bot",
      text: getBotReply(userText)
    };

    setMessages((previous) => [
      ...previous,
      userMessage,
      botMessage
    ]);

    setInput("");
  }

  function clearChat() {
    setMessages([{ ...greeting, id: Date.now() }]);
    setInput("");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f1e8] p-4">
      <section className="flex h-[90vh] min-h-[550px] w-full max-w-5xl overflow-hidden rounded-3xl border border-[#e8d9c8] bg-white shadow-2xl">

        <aside className="hidden w-[35%] flex-col justify-between bg-[#543b30] p-8 text-white md:flex">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#e8c9a8]">
              Artisan Bakery
            </p>

            <h1 className="mt-8 text-4xl font-bold leading-tight">
              Happiness is freshly baked.
            </h1>

            <p className="mt-5 text-sm leading-7 text-[#f1dfcf]">
              Discover sweet treats, explore our sample menu, and find
              answers to your bakery questions.
            </p>

            <div className="mt-8 space-y-3">
              {[
                "Cakes & Celebrations",
                "Cupcakes & Cookies",
                "Brownies & Pastries"
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/20 bg-white/10 p-3 text-sm"
                >
                  🧁 {item}
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-[#e8c9a8]">
            CRUMB & CO. · BAKED WITH LOVE
          </p>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex items-center justify-between bg-[#543b30] p-4 text-white sm:p-5 md:bg-white md:text-[#543b30]">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-2xl md:bg-[#f5e9d9]">
                🧁
              </div>

              <div>
                <h2 className="text-xl font-bold">CrumbBot</h2>
                <p className="text-xs opacity-80">
                  Bakery Assistant
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={clearChat}
              className="rounded-lg border border-white/30 px-3 py-2 text-xs transition hover:bg-white/10 md:border-[#e8d9c8] md:hover:bg-[#f8f1e8]"
            >
              Clear Chat
            </button>
          </header>

          <div className="border-y border-[#eee2d4] bg-[#fffaf3] px-4 py-3 text-center text-xs text-[#80624d]">
            🍰 Something sweet is always a good idea.
          </div>

          <div
            className="flex-1 space-y-4 overflow-y-auto bg-[#fcfaf7] p-4 sm:p-6"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {message.sender === "bot" && (
                  <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f3e5d3] text-sm">
                    🧁
                  </div>
                )}

                <div
                  className={`max-w-[85%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.sender === "user"
                      ? "rounded-br-sm bg-[#76513d] text-white"
                      : "rounded-bl-sm border border-[#eee2d4] bg-white text-[#4d3b30] shadow-sm"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-[#e8d9c8] bg-white p-4 sm:p-5">
            <p className="mb-3 text-xs font-semibold text-[#80624d]">
              QUICK QUESTIONS
            </p>

            <div className="mb-4 flex flex-wrap gap-2">
              {quickQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => sendMessage(question)}
                  className="rounded-full border border-[#e8d9c8] bg-[#fffaf3] px-3 py-2 text-xs text-[#654735] transition hover:bg-[#f3e5d3]"
                >
                  {question}
                </button>
              ))}
            </div>

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
              className="flex gap-2"
            >
              <label htmlFor="message" className="sr-only">
                Type your question
              </label>

              <input
                id="message"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about something delicious..."
                autoComplete="off"
                className="min-w-0 flex-1 rounded-xl border border-[#e8d9c8] bg-[#fcfaf7] px-4 py-3 text-sm text-[#4d3b30] outline-none focus:border-[#76513d] focus:ring-2 focus:ring-[#f3e5d3]"
              />

              <button
                type="submit"
                disabled={!input.trim()}
                className="rounded-xl bg-[#76513d] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#543b30] disabled:cursor-not-allowed disabled:opacity-50 sm:px-6"
              >
                Send ➤
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] text-gray-400">
              Rule-based chatbot · No API required
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
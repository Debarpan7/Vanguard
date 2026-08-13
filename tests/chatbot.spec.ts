import { test, expect } from "@playwright/test";
import {
  answerChat,
  refusalAdvice,
  refusalOutOfFactBase,
} from "../src/lib/chatbot";

// Seam 2 — the chatbot grounding engine (ticket 18, engineered per the
// ticket-09 decisions): a deterministic retrieval engine over the fact base
// and analysis data. Five named intents (metric queries, 5-year trend
// queries, benchmarking, RoE-tree/profitability, improvement reads +
// ownership/company context); everything else refused. Answers render facts
// through the fact-base accessors (`seriesFor`/`latestPublishedPoint`/
// `metricMeta`) so every figure and source link is a fact-base literal.
// Expected values are literal facts from the decision record
// (`.scratch/vanguard-intelligence/issues/09-grilling-chatbot-engineering.md`),
// never recomputed from the code under test.

test("advice questions are refused with the fixed advice string, verbatim", () => {
  const response = answerChat("should i invest in vanguard");
  expect(response.text).toBe(refusalAdvice);
  expect(refusalAdvice).toMatch(/can't give investment, regulatory, or legal advice/i);
});

test("out-of-fact-base topics are refused with the fixed string, verbatim", () => {
  const response = answerChat("what is the weather in london");
  expect(response.text).toBe(refusalOutOfFactBase);
  expect(refusalOutOfFactBase).toMatch(/outside the fact base/i);
});

test("a metric query answers with the latest published value, as-of, and source", () => {
  const response = answerChat("what is vanguard's aum");
  // Decided fact: $8.1T as of Mar 31, 2022 (fact-base literal).
  expect(response.text).toMatch(/\$8\.1T/);
  expect(response.text).toMatch(/Mar 31, 2022/);
  expect(response.sources.length).toBeGreaterThan(0);
  expect(response.sources[0].name.length).toBeGreaterThan(0);
  expect(response.sources[0].url.startsWith("http")).toBe(true);
});

test("a clients query answers with the latest published figure and its as-of", () => {
  const response = answerChat("how many clients does vanguard have");
  // Decided fact: 50M+ investors as of Dec 31, 2025 (fact-base literal).
  expect(response.text).toMatch(/50M\+/);
  expect(response.text).toMatch(/Dec 31, 2025/);
  expect(response.sources.length).toBeGreaterThan(0);
});

test("a metric that Vanguard does not publish is answered as a not-published gap, never invented", () => {
  const response = answerChat("what is vanguard's revenue");
  expect(response.text).toMatch(/not published/i);
  expect(response.text).not.toMatch(/\$\d/);
});

test("a trend query renders the full 5-year series with explicit gap labels", () => {
  const response = answerChat("aum trend over 5 years");
  expect(response.text).toMatch(/2021: \$8\.0T/);
  expect(response.text).toMatch(/2022: \$8\.1T/);
  expect(response.text).toMatch(/2023: Not published/);
  expect(response.text).toMatch(/2025: Not published/);
});

test("a benchmarking query answers with Vanguard's value, the named peer value, and the ownership caveat", () => {
  const response = answerChat("compare vanguard aum to blackrock");
  expect(response.text).toMatch(/\$8\.1T/);
  expect(response.text).toMatch(/pending collection/i);
  // Ownership caveat is auto-appended on benchmarking answers (decision 4).
  expect(response.text).toMatch(/client-owned \(mutual\)/);
  expect(response.sources.length).toBe(2);
  expect(response.sources.some((source) => /blackrock/i.test(source.name))).toBe(true);
});

test("a named peer RoE query uses the published peer value and filing source", () => {
  const response = answerChat("what is blackrock's roe");
  expect(response.text).toMatch(/BlackRock.*10\.7%/);
  expect(response.text).not.toMatch(/peer data.*pending collection/i);
  expect(response.sources.some((source) => source.url.includes("sec.gov/Archives/edgar/data/"))).toBe(true);
});

test("secondary peer answers disclose their display-only qualification", () => {
  const response = answerChat("what is amundi's revenue");
  expect(response.text).toMatch(/display-only EUR\/IFRS; unverified/i);
  expect(response.text).toMatch(/3\.3/);
});

test("an RoE query answers with the not-computable gap and the ownership caveat", () => {
  const response = answerChat("what is vanguard's roe");
  expect(response.text).toMatch(/not computable|not published/i);
  // Ownership caveat is auto-appended on RoE answers (decision 4).
  expect(response.text).toMatch(/client-owned \(mutual\)/);
});

test("an improvement query surfaces the four named opportunities and the lens", () => {
  const response = answerChat("what are the improvement opportunities");
  expect(response.text).toMatch(/Extend the cost advantage/);
  expect(response.text).toMatch(/Close the profitability visibility gap/);
  expect(response.text).toMatch(/Restore AUM disclosure/);
  expect(response.text).toMatch(/Measure clients consistently/);
  expect(response.text).toMatch(/broad business performance/i);
});

test("an ownership query explains the mutual vs listed structure", () => {
  const response = answerChat("is vanguard client-owned");
  expect(response.text).toMatch(/client-owned \(mutual\)/);
});

test("the same query always produces the same response (deterministic)", () => {
  expect(answerChat("what is vanguard's aum")).toEqual(
    answerChat("what is vanguard's aum"),
  );
});

test("greetings return the prompt string, not a refusal", () => {
  const response = answerChat("hello");
  expect(response.text).toMatch(/Ask me about/i);
});

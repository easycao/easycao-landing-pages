import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { verifySession } from "@/lib/auth";
import OpenAI from "openai";

let _openai: OpenAI | null = null;
function getOpenAI() {
  if (!_openai) _openai = new OpenAI();
  return _openai;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * POST /api/consolidation/chat
 * AI-powered consolidation chat for lesson comprehension.
 */
export async function POST(req: NextRequest) {
  // Auth
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await verifySession(sessionCookie);
  if (!user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const body = await req.json();
  const { concepts, message, history, language } = body as {
    concepts: string[];
    message: string;
    history: ChatMessage[];
    language: "pt" | "en";
  };

  if (!concepts || !message) {
    return NextResponse.json(
      { error: "concepts and message are required" },
      { status: 400 }
    );
  }

  const systemPrompt = language === "en"
    ? `You are a friendly aviation English teacher helping a student consolidate lesson concepts.
The lesson covers these concepts: ${concepts.join(", ")}.

Rules:
- Ask progressive questions about the concepts (one at a time)
- Keep responses short (2-3 sentences)
- If the student shows understanding, move to next concept
- After covering 3-5 concepts, evaluate if comprehension is sufficient
- If sufficient, respond with exactly "[COMPLETE]" at the start of your message followed by a congratulatory note
- If not sufficient, ask a follow-up question
- Use simple, clear language appropriate for non-native English speakers`
    : `Você é um professor de inglês de aviação ajudando um aluno a consolidar conceitos da aula.
A aula cobre estes conceitos: ${concepts.join(", ")}.

Regras:
- Faça perguntas progressivas sobre os conceitos (uma por vez)
- Mantenha respostas curtas (2-3 frases)
- Se o aluno demonstrar entendimento, passe ao próximo conceito
- Após cobrir 3-5 conceitos, avalie se a compreensão é suficiente
- Se suficiente, responda com exatamente "[COMPLETE]" no início da mensagem seguido de uma nota de parabéns
- Se não suficiente, faça uma pergunta de acompanhamento
- Use linguagem simples e clara`;

  const messages: OpenAI.ChatCompletionMessageParam[] = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  try {
    const completion = await getOpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const reply = completion.choices[0]?.message?.content || "";
    const isComplete = reply.startsWith("[COMPLETE]");

    return NextResponse.json({
      reply: isComplete ? reply.replace("[COMPLETE]", "").trim() : reply,
      isComplete,
    });
  } catch (error) {
    console.error("Consolidation chat error:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}

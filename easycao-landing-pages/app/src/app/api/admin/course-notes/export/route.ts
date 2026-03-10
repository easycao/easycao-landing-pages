import { NextResponse } from "next/server";
import { getSessionFromCookies, checkIsAdmin } from "@/lib/auth";
import { getFirestoreDb } from "@/lib/firebase-admin";

async function authorize() {
  const session = await getSessionFromCookies();
  if (!session) return null;
  const isAdmin = await checkIsAdmin(session.uid);
  return isAdmin ? session : null;
}

// GET export all notes as markdown
export async function GET() {
  if (!(await authorize())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getFirestoreDb();
  const modulesSnap = await db.collection("course-notes").orderBy("number", "asc").get();

  const parts: string[] = ["# Easycao — Anotações do Curso\n"];

  for (const moduleDoc of modulesSnap.docs) {
    const mod = moduleDoc.data();
    parts.push(`\n## Módulo ${mod.number} — ${mod.name}\n`);

    const lessonsSnap = await db
      .collection("course-notes")
      .doc(moduleDoc.id)
      .collection("lessons")
      .orderBy("number", "asc")
      .get();

    for (const lessonDoc of lessonsSnap.docs) {
      const lesson = lessonDoc.data();
      parts.push(`\n### Aula ${lesson.number} — ${lesson.title}\n`);

      // Metadata
      const meta: string[] = [];
      if (lesson.duration) meta.push(`Duração: ${lesson.duration}`);
      if (lesson.type) meta.push(`Tipo: ${lesson.type}`);
      if (lesson.hasTask) meta.push(`Tem tarefa: sim`);
      if (meta.length) parts.push(`> ${meta.join(" | ")}\n`);

      if (lesson.content?.trim()) {
        parts.push(`#### Conteúdo\n\n${lesson.content.trim()}\n`);
      }

      if (lesson.task?.trim()) {
        parts.push(`#### Tarefa\n\n${lesson.task.trim()}\n`);
      }

      if (lesson.featureIdeas?.trim()) {
        parts.push(`#### Ideias de Features\n\n${lesson.featureIdeas.trim()}\n`);
      }

      if (lesson.aiNotes?.trim()) {
        parts.push(`#### Notas para o Agente IA\n\n${lesson.aiNotes.trim()}\n`);
      }
    }
  }

  const markdown = parts.join("\n");

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": "attachment; filename=course-notes.md",
    },
  });
}

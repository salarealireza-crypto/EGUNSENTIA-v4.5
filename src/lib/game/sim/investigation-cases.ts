export type InvestigationStatus = "open" | "on-hold" | "actionable" | "archived";

export interface InvestigationNote {
  id: string;
  dayIndex: number;
  text: string;
  provenance?: "player-supplied";
  classification?: "unverified";
}

export type InvestigationCaseKind = "general" | "missing-person-inquiry";
export interface CreateInvestigationCaseOptions {
  kind?: InvestigationCaseKind;
  subjectName?: string;
  sourceReference?: string;
}

export interface InvestigationCase {
  id: string;
  title: string;
  kind?: InvestigationCaseKind;
  subjectName?: string;
  status: InvestigationStatus;
  createdDay: number;
  updatedDay: number;
  clueIds: string[];
  notes: InvestigationNote[];
  archiveNote?: string;
}

export function createInvestigationCase(
  rows: InvestigationCase[],
  title: string,
  dayIndex: number,
  options: CreateInvestigationCaseOptions = {},
): { rows: InvestigationCase[]; created?: InvestigationCase; message: string } {
  const kind = options.kind ?? "general";
  const subjectName = options.subjectName?.trim().slice(0, 100) ?? "";
  const sourceReference = options.sourceReference?.trim().slice(0, 500) ?? "";
  if (kind !== "general" && kind !== "missing-person-inquiry") return { rows, message: "Unknown investigation case type." };
  if (kind === "missing-person-inquiry" && !subjectName) return { rows, message: "Enter the person name exactly as it appears in the source record." };
  if (kind === "missing-person-inquiry" && !sourceReference) return { rows, message: "Add a source reference. Unverified reports must remain unverified." };
  const fallbackTitle = kind === "missing-person-inquiry" ? `Missing-person inquiry: ${subjectName}` : "";
  const cleanTitle = (title.trim() || fallbackTitle).slice(0, 100);
  if (!cleanTitle) return { rows, message: "Enter a case title." };
  if (!Number.isSafeInteger(dayIndex) || dayIndex < 0) return { rows, message: "Invalid campaign date." };
  if (rows.length >= 100) return { rows, message: "The case register has reached its 100-case limit." };
  const base = `INV-${dayIndex + 1}`;
  let id = base;
  for (let suffix = 2; rows.some((row) => row.id === id); suffix += 1) id = `${base}-${suffix}`;
  const notes: InvestigationNote[] = kind === "missing-person-inquiry" ? [{
    id: `${id}-N1`, dayIndex,
    text: `Player-supplied source reference (unverified): ${sourceReference}`,
    provenance: "player-supplied", classification: "unverified",
  }] : [];
  const created: InvestigationCase = {
    id, title: cleanTitle, kind, ...(kind === "missing-person-inquiry" ? { subjectName } : {}),
    status: "open", createdDay: dayIndex, updatedDay: dayIndex, clueIds: [], notes,
  };
  return { rows: [created, ...rows], created, message: kind === "missing-person-inquiry"
    ? `Unverified missing-person inquiry ${id} opened from a player-supplied reference.`
    : `Case ${id} opened.` };
}

export function linkInvestigationClue(rows: InvestigationCase[], caseId: string, clueId: string, dayIndex: number): { rows: InvestigationCase[]; ok: boolean; message: string } {
  const target = rows.find((row) => row.id === caseId);
  if (!target) return { rows, ok: false, message: "Case not found." };
  if (!clueId.trim()) return { rows, ok: false, message: "Choose a recorded clue." };
  if (target.status === "archived") return { rows, ok: false, message: "Archived cases are read-only." };
  if (target.clueIds.includes(clueId)) return { rows, ok: false, message: "This clue is already linked." };
  return { rows: rows.map((row) => row.id === caseId ? { ...row, clueIds: [...row.clueIds, clueId].slice(0, 100), updatedDay: dayIndex } : row), ok: true, message: "Clue linked. Its evidence classification is unchanged." };
}

export function addInvestigationNote(rows: InvestigationCase[], caseId: string, text: string, dayIndex: number): { rows: InvestigationCase[]; ok: boolean; message: string } {
  const target = rows.find((row) => row.id === caseId);
  const cleanText = text.trim().slice(0, 1000);
  if (!target) return { rows, ok: false, message: "Case not found." };
  if (target.status === "archived") return { rows, ok: false, message: "Archived cases are read-only." };
  if (!cleanText) return { rows, ok: false, message: "Enter a note before saving." };
  const note: InvestigationNote = { id: `${caseId}-N${target.notes.length + 1}`, dayIndex, text: cleanText };
  return { rows: rows.map((row) => row.id === caseId ? { ...row, notes: [...row.notes, note].slice(-100), updatedDay: dayIndex } : row), ok: true, message: "Investigation note recorded." };
}

export function setInvestigationStatus(rows: InvestigationCase[], caseId: string, status: InvestigationStatus, dayIndex: number, archiveNote = ""): { rows: InvestigationCase[]; ok: boolean; message: string } {
  const target = rows.find((row) => row.id === caseId);
  if (!target) return { rows, ok: false, message: "Case not found." };
  if (target.status === "archived") return { rows, ok: false, message: "Archived cases are read-only." };
  const cleanArchiveNote = archiveNote.trim().slice(0, 500);
  if (status === "archived" && !cleanArchiveNote) return { rows, ok: false, message: "Add an archive note; archiving does not mean the mystery is solved." };
  if (status === "actionable" && target.clueIds.length === 0) return { rows, ok: false, message: "Link at least one clue before marking a case actionable." };
  const updated = { ...target, status, updatedDay: dayIndex, ...(status === "archived" ? { archiveNote: cleanArchiveNote } : {}) };
  return { rows: rows.map((row) => row.id === caseId ? updated : row), ok: true, message: status === "archived" ? "Case archived as a record; no mystery was declared solved." : `Case marked ${status}.` };
}

export function normalizeInvestigationCases(value: unknown): InvestigationCase[] {
  if (!Array.isArray(value)) return [];
  const result: InvestigationCase[] = [];
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) continue;
    const row = raw as Partial<InvestigationCase>;
    if (typeof row.id !== "string" || !row.id.trim() || typeof row.title !== "string" || !row.title.trim()) continue;
    if (typeof row.createdDay !== "number" || !Number.isSafeInteger(row.createdDay) || row.createdDay < 0) continue;
    if (typeof row.updatedDay !== "number" || !Number.isSafeInteger(row.updatedDay) || row.updatedDay < row.createdDay) continue;
    if (!["open", "on-hold", "actionable", "archived"].includes(row.status ?? "")) continue;
    const clueIds = Array.isArray(row.clueIds) ? row.clueIds.filter((id): id is string => typeof id === "string").slice(0, 100) : [];
    const notes = Array.isArray(row.notes) ? row.notes.filter((note): note is InvestigationNote => !!note && typeof note === "object" && typeof (note as InvestigationNote).id === "string" && Number.isSafeInteger((note as InvestigationNote).dayIndex) && (note as InvestigationNote).dayIndex >= 0 && typeof (note as InvestigationNote).text === "string").slice(-100).map((note) => ({
      id: note.id.slice(0, 120), dayIndex: note.dayIndex, text: note.text.slice(0, 1000),
      ...(note.provenance === "player-supplied" ? { provenance: note.provenance } : {}),
      ...(note.classification === "unverified" ? { classification: note.classification } : {}),
    })) : [];
    const kind = row.kind === "missing-person-inquiry" ? "missing-person-inquiry" : "general";
    result.push({ id: row.id.slice(0, 120), title: row.title.slice(0, 100), ...(kind === "missing-person-inquiry" ? { kind, ...(typeof row.subjectName === "string" && row.subjectName.trim() ? { subjectName: row.subjectName.trim().slice(0, 100) } : {}) } : { kind }), status: row.status as InvestigationStatus, createdDay: row.createdDay, updatedDay: row.updatedDay, clueIds, notes, ...(typeof row.archiveNote === "string" ? { archiveNote: row.archiveNote.slice(0, 500) } : {}) });
  }
  return result;
}

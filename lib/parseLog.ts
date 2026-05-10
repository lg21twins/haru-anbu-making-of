export type LogEntry = {
  uid: number;
  id: number;
  occurrence: number;
  title: string;
  date: string;
  promptSummary: string;
  input?: string;
  process: string[];
  output?: string;
  finding?: string;
  notes?: string;
  tags: string[];
};

const FIELD_LABELS = [
  "날짜",
  "프롬프트 요약",
  "입력",
  "AI 작업 과정",
  "출력",
  "핵심 발견",
  "특이사항",
];

// Build a regex that matches a field header line e.g. "- **날짜**: 2026.04.13"
const FIELD_RE = new RegExp(
  String.raw`^- \*\*(${FIELD_LABELS.join("|")})\*\*\s*:?\s*(.*)$`
);

export function parseLog(md: string): LogEntry[] {
  const lines = md.split("\n");
  const entries: LogEntry[] = [];

  let current: Partial<LogEntry> | null = null;
  let currentField: string | null = null;
  let processBuffer: string[] = [];
  let textBuffer: string[] = [];

  const flushField = () => {
    if (!current || !currentField) return;
    if (currentField === "AI 작업 과정") {
      current.process = processBuffer
        .map((l) => l.replace(/^\s*\d+\.\s*/, "").trim())
        .filter(Boolean);
      processBuffer = [];
    } else {
      const text = textBuffer.join(" ").trim();
      switch (currentField) {
        case "날짜":
          current.date = text;
          break;
        case "프롬프트 요약":
          current.promptSummary = text.replace(/^"|"$/g, "");
          break;
        case "입력":
          current.input = text;
          break;
        case "출력":
          current.output = text;
          break;
        case "핵심 발견":
          current.finding = text;
          break;
        case "특이사항":
          current.notes = text;
          break;
      }
      textBuffer = [];
    }
    currentField = null;
  };

  const occurrenceMap = new Map<number, number>();

  const flushEntry = () => {
    if (!current) return;
    flushField();
    if (current.id !== undefined && current.title) {
      const id = current.id;
      const occurrence = (occurrenceMap.get(id) ?? 0) + 1;
      occurrenceMap.set(id, occurrence);
      const tags = extractTags(current as LogEntry);
      entries.push({
        uid: entries.length,
        id,
        occurrence,
        title: current.title!,
        date: current.date ?? "",
        promptSummary: current.promptSummary ?? "",
        input: current.input,
        process: current.process ?? [],
        output: current.output,
        finding: current.finding,
        notes: current.notes,
        tags,
      });
    }
    current = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    const header = line.match(/^### #(\d+)\s*\|\s*(.+)$/);
    if (header) {
      flushEntry();
      current = { id: parseInt(header[1], 10), title: header[2].trim(), process: [] };
      continue;
    }
    if (!current) continue;

    const fieldMatch = line.match(FIELD_RE);
    if (fieldMatch) {
      flushField();
      currentField = fieldMatch[1];
      const tail = fieldMatch[2];
      if (currentField === "AI 작업 과정") {
        processBuffer = [];
      } else {
        textBuffer = tail ? [tail] : [];
      }
      continue;
    }

    if (currentField === "AI 작업 과정") {
      const m = line.match(/^\s*\d+\.\s*(.+)$/);
      if (m) processBuffer.push(m[1]);
      else if (line.match(/^\s*-\s+/)) processBuffer.push(line.replace(/^\s*-\s+/, ""));
      continue;
    }

    if (currentField && line.trim() && !line.startsWith("---")) {
      textBuffer.push(line.trim());
    }
  }
  flushEntry();

  return entries;
}

function extractTags(e: LogEntry): string[] {
  const text = [e.title, e.promptSummary, e.output, ...e.process].join(" ");
  const tags = new Set<string>();
  const known = [
    ["Higgsfield", /힉스필드|higgsfield|영상/i],
    ["v8", /v8|보호자앱/i],
    ["탭바", /탭바|tabbar/i],
    ["글라스", /glass|글라스|backdrop/i],
    ["결제", /결제|billing|g08/i],
    ["채팅", /chat|채팅/i],
    ["홈", /홈화면|live|home/i],
    ["프롬프트", /프롬프트|prompt/i],
    ["기획", /기획|prd|페르소나|jtbd/i],
    ["리서치", /시장조사|레퍼런스|벤치마킹|경쟁사/i],
    ["디자인시스템", /디자인시스템|common\.css|토큰/i],
    ["성능", /성능|fps|최적화|blur/i],
    ["UX분석", /ux|uxui|스킬/i],
    ["Mockup", /mockup|목업/i],
  ] as const;
  for (const [tag, re] of known) {
    if (re.test(text)) tags.add(tag);
  }
  return [...tags];
}

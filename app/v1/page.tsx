import fs from "node:fs/promises";
import path from "node:path";
import { parseLog } from "@/lib/parseLog";
import { ChaptersClient } from "@/components/ChaptersClient";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

export default async function V1() {
  const logPath = path.join(
    process.cwd(),
    "..",
    "..",
    "06_로그",
    "대화기록_작업로그.md"
  );
  const md = await fs.readFile(logPath, "utf-8");
  const entries = parseLog(md);
  return (
    <>
      <ScrollProgress />
      <ChaptersClient entries={entries} />
    </>
  );
}

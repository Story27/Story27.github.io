"use server";

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const dirCodes = path.join(process.cwd(), "Executed-codes", "codes");

if (!fs.existsSync(dirCodes)) {
  fs.mkdirSync(dirCodes, { recursive: true });
}

export async function generateFile(format: string, content: string) {
  const jobID = uuid();
  const filename = `${jobID}.${format}`;
  const filePath = path.join(dirCodes, filename);
  await fs.promises.writeFile(filePath, content);
  return filePath;
}

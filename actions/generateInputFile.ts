"use server";

import fs from "fs";
import path from "path";
import { v4 as uuid } from "uuid";

const dirInputs = path.join(process.cwd(), "Executed-codes", "inputs");

if (!fs.existsSync(dirInputs)) {
  fs.mkdirSync(dirInputs, { recursive: true });
}

export async function generateInputFile(input: string) {
  const jobID = uuid();
  const inputFilename = `${jobID}.txt`;
  const inputFilePath = path.join(dirInputs, inputFilename);
  await fs.promises.writeFile(inputFilePath, input);
  return inputFilePath;
}

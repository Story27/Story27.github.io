"use server";

import { generateFile } from "./generateFile";
import { generateInputFile } from "./generateInputFile";
import { executeCpp } from "./executeCpp";
import fs from "fs";

export async function runCode(language: string, code: string, input: string) {
  if (!code) {
    throw new Error("Empty code!");
  }

  try {
    const filePath = await generateFile(language, code);
    const inputFilePath = await generateInputFile(input);
    const output = await executeCpp(filePath, inputFilePath);
    return output;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("An unknown error occurred");
    }
  }
}

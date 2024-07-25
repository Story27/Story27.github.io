"use server";

import { exec } from "child_process";
import path from "path";
import fs from "fs";

const outputPath = path.join(process.cwd(), "Executed-codes", "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}

export async function executeCpp(filePath: string, inputPath: string) {
  const jobId = path.basename(filePath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.out`);

  return new Promise<string>((resolve, reject) => {
    exec(
      `g++ ${filePath} -o ${outPath} && ${outPath} < ${inputPath}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error("Execution error:", error);
          reject(`Execution error: ${error.message}`);
        } else if (stderr) {
          console.error("Stderr:", stderr);
          reject(`Stderr: ${stderr}`);
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

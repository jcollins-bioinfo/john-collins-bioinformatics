import { mkdir, readFile, writeFile } from "node:fs/promises";

const source = new URL("../assets/john-patrick-collins-resume.pdf.base64", import.meta.url);
const output = new URL(
  "../public/John-Patrick-Collins_MSc_Senior Bioinformatics_Resume.pdf",
  import.meta.url,
);

const encodedResume = await readFile(source, "utf8");
const resume = Buffer.from(encodedResume.replaceAll(/\s/g, ""), "base64");

if (resume.subarray(0, 5).toString("ascii") !== "%PDF-") {
  throw new Error("Decoded résumé does not have a valid PDF signature.");
}

await mkdir(new URL("../public/", import.meta.url), { recursive: true });
await writeFile(output, resume);
console.log(`Generated résumé PDF (${resume.byteLength} bytes).`);

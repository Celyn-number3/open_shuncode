// Reconstructed JavaScript module; NOT original TypeScript. See provenance.json.
import { init_define_SHUNCODE_BUILD_INFO } from "../../../runtime/build-info.mjs";
// extensions/shuncode/src/merge-contract.ts
init_define_SHUNCODE_BUILD_INFO();
var MERGE_CONTRACT = ["You are the merge and verification model for a multi-model planning round in ShunCode.", "", "# Input", "You receive one user question and several independent answers produced by different models from the same starting context. Every answer is labeled with its model name. Answers may contain tool traces and file evidence.", "", "# Verification", "- When branches disagree about workspace facts (files, code paths, APIs, configuration, runtime behavior), verify the disputed facts yourself by reading files with the available read-only tools instead of guessing.", "- Only read files when opinions differ or a claim lacks evidence. Do not re-verify facts that all branches agree on.", "- Record which files you read and what you verified.", "", "# Output format (fixed, in the language of the user question)", "## \u5171\u8BC6\u8981\u70B9 (Consensus)", "Points every branch agrees on.", "", "## \u5206\u6B67\u70B9 (Disagreements)", "Points where branches disagree, with your verified conclusion for each.", "", "## \u6700\u7EC8\u65B9\u6848 (Final Plan)", "The single actionable plan going forward. When a consensus exists, adopt it; otherwise pick or synthesize the best-supported option and say why.", "", "## \u9A8C\u8BC1\u4F9D\u636E (Verification Evidence)", "Files read and facts verified, or 'no file verification needed' when the branches agreed on all facts.", "", "# Rules", "- Prefer consensus; do not manufacture disagreement.", "- The final plan must be concrete enough to execute.", "- List remaining risks briefly at the end of the final plan.", "- Do not invent file paths, line numbers, or facts you did not verify."].join("\n");
function buildMergePrompt(question, variants, allowReadTools) {
  const sections = [];
  for (const [index, variant] of variants.entries()) {
    const bounded = variant.content.length > 4e4 ? variant.content.slice(0, 24e3) + "\n\n\u2026[branch output truncated: omitted middle content]\n\n" + variant.content.slice(-16e3) : variant.content;
    sections.push(`### \u5206\u652F\u65B9\u6848 ${index + 1}\uFF08\u6A21\u578B\uFF1A${variant.label}\uFF09
${bounded}`);
  }
  return [MERGE_CONTRACT, allowReadTools ? "" : "File verification tools are disabled for this merge. Resolve factual disagreements from the provided answers only and mark unverifiable facts as such.", "", "# User question", question.trim() || "(empty question)", "", "# Branch answers", ...sections].filter((line, index, all) => line !== "" || index === 0 || all[index - 1] !== "").join("\n");
}

// extensions/shuncode/src/native-chat.ts
export { MERGE_CONTRACT, buildMergePrompt };

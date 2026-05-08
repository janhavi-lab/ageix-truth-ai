export {};

export type InputType = "url" | "news" | "message";

function detectInputType(input: string): InputType {
  const trimmed = input.trim();

  if (/^https?:\/\//i.test(trimmed)) return "url";
  if (trimmed.length > 300) return "news";
  return "message";
}

module.exports = { detectInputType };


// Model reference documentation:
// OpenAI models: https://platform.openai.com/docs/models
// Google Gemini models: https://ai.google.dev/gemini-api/docs/models
// Anthropic Claude models: https://docs.anthropic.com/en/docs/about-claude/models/all-models

export const LANGUAGES = [
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "zh", name: "Chinese" },
  { code: "cs", name: "Czech" },
  { code: "da", name: "Danish" },
  { code: "nl", name: "Dutch" },
  { code: "en", name: "English" },
  { code: "fi", name: "Finnish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hi", name: "Hindi" },
  { code: "hu", name: "Hungarian" },
  { code: "id", name: "Indonesian" },
  { code: "it", name: "Italian" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "ms", name: "Malay" },
  { code: "no", name: "Norwegian" },
  { code: "fa", name: "Persian" },
  { code: "pl", name: "Polish" },
  { code: "pt", name: "Portuguese" },
  { code: "ro", name: "Romanian" },
  { code: "ru", name: "Russian" },
  { code: "es", name: "Spanish" },
  { code: "sv", name: "Swedish" },
  { code: "th", name: "Thai" },
  { code: "tr", name: "Turkish" },
  { code: "uk", name: "Ukrainian" },
  { code: "vi", name: "Vietnamese" },
].sort((a, b) => a.name.localeCompare(b.name))

export const MODELS = [
  {
    id: "gpt-4o-mini-2024-07-18",
    name: "OpenAI GPT-4o Mini",
    provider: "openai",
    keyField: "openaiKey",
  },
  {
    id: "chatgpt-4o-latest",
    name: "OpenAI ChatGPT-4o",
    provider: "openai",
    keyField: "openaiKey",
  },
  {
    id: "claude-3-7-sonnet-latest",
    name: "Anthropic Claude 3.7 Sonnet",
    provider: "anthropic",
    keyField: "anthropicKey",
  },
  {
    id: "claude-3-5-haiku-latest",
    name: "Anthropic Claude 3.5 Haiku",
    provider: "anthropic",
    keyField: "anthropicKey",
  },
  {
    id: "gemini-2.0-flash",
    name: "Google Gemini 2.0 Flash",
    provider: "gemini",
    keyField: "geminiKey",
  },
  {
    id: "gemini-2.5-pro-exp-03-25",
    name: "Google Gemini 2.5 Pro",
    provider: "gemini",
    keyField: "geminiKey",
  },
]


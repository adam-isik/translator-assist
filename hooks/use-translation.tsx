"use client"

import { useState } from "react"
import { callLLM } from "@/lib/llm-utils"
import { isPlaceholder } from "./use-settings"

export function useTranslation() {
  const [sourceText, setSourceText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [isTranslating, setIsTranslating] = useState(false)

  const generateTranslation = async (text: string, settings: any) => {
    if (
      !text ||
      !settings.selectedModel ||
      isPlaceholder(settings.selectedModel) ||
      !settings.sourceLang ||
      isPlaceholder(settings.sourceLang) ||
      !settings.targetLang ||
      isPlaceholder(settings.targetLang)
    ) {
      alert("Please make sure you have selected a model, source language, and target language in settings.")
      return
    }

    setIsTranslating(true)

    try {
      const prompt = `
Role: You are an expert AI translator. Your task is to provide a high-quality translation of the provided source text into the specified target language.
Source Language: ${settings.sourceLang}
Target Language: ${settings.targetLang}
Instructions:
	1	Understand Context: Read the entire source text carefully to grasp its context, subject matter (e.g., technical, creative, conversational, legal), and overall meaning before beginning the translation.
	2	Translate Accurately: Translate the text aiming to maintain the original meaning, intent, and nuances as closely as possible. Ensure the translation uses natural-sounding phrasing in the target language while preserving the appropriate tone (e.g., formal, informal, technical) identified in the source.
	3	Handle Specific Terminology:
	◦	Pay close attention to domain-specific terminology (e.g., technical, scientific, cultural, legal). Use established translations or standard terminology in the target language where available.
	◦	For culturally specific terms or names without widely known direct equivalents, you may include the original term in parentheses after its first translated mention if it aids clarity for the intended audience.
	◦	Example for Specialized Context (like Legal): If the source text is identified as belonging to a specialized domain like law: Strive for precision appropriate to that field. Use established target language equivalents for domain-specific terms. If a direct equivalent is lacking for a critical term, use the standard translation or, only if essential for avoiding misinterpretation, provide a very concise explanation or the original term in [square brackets]. (Apply similar rigor and context-awareness for other specialized domains like medicine or engineering if identified).
	4	Maintain Structure: Preserve the original document structure where practical, such as paragraphs and list formats. Note that sentence structure often needs adaptation to sound natural in the target language.
	5	Preserve Key Information: Retain proper nouns (names of people, places, organizations), dates, and numerical information accurately. Use official or standard target language names for referenced entities where applicable.
	6	Address Ambiguity: If you encounter genuinely ambiguous phrases or terms in the source text where context doesn't fully clarify, translate using the most probable interpretation. If the ambiguity is significant and could critically alter meaning, you may add a brief translator's note in [square brackets] to indicate the uncertainty or the interpretation chosen (e.g., [Translator's Note: Source term 'X' could imply Y or Z; interpreted as Y based on context.]). Use such notes sparingly.
	7	Ensure Consistency: Apply terminology consistently throughout the translation, particularly for key concepts, technical terms, or recurring phrases.
	8	Adapt Conventions: Use punctuation, capitalization, and formatting idiomatic to the target language, ensuring clarity and readability while preserving the original meaning.
	9	Review: Before finalizing, mentally review the translation for accuracy, grammatical correctness, consistency, and natural flow in the target language.
Output Requirement:
	•	Your response must contain only the translated text, directly starting with the first translated word and ending with the last.
	•	Do NOT include the original text.
	•	Do NOT include any introductory phrases (e.g., "Here is the translation:", "Translation:").
	•	Do NOT include any headings, explanations, summaries, or concluding remarks.
	•	Do NOT enclose the translation in XML tags, markdown code blocks, or quotes unless quotes are part of the translation itself.
	•	Translator notes, if used as specified in instruction #6 [like this], are considered part of the translation output.

Source Text:
${text}`

      const result = await callLLM(settings, prompt)
      setTranslatedText(result)
    } catch (error) {
      console.error("Translation error:", error)
      if (error instanceof Error) {
        alert(`Translation error: ${error.message}`)
      } else {
        alert("Translation error: An unknown error occurred")
      }
    } finally {
      setIsTranslating(false)
    }
  }

  return {
    sourceText,
    translatedText,
    setSourceText,
    setTranslatedText,
    generateTranslation,
    isTranslating,
  }
}


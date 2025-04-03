"use client"

import { useState } from "react"
import { callLLM } from "@/lib/llm-utils"
import { isPlaceholder } from "./use-settings"

export function useReview() {
  const [reviewFeedback, setReviewFeedback] = useState("")
  const [isReviewing, setIsReviewing] = useState(false)

  const generateReview = async (sourceText: string, translatedText: string, settings: any) => {
    if (
      !sourceText ||
      !translatedText ||
      !settings.selectedModel ||
      isPlaceholder(settings.selectedModel) ||
      !settings.sourceLang ||
      isPlaceholder(settings.sourceLang) ||
      !settings.targetLang ||
      isPlaceholder(settings.targetLang)
    ) {
      alert(
        "Please make sure you have entered source text, translation, and selected a model, source language, and target language in settings.",
      )
      return
    }

    setIsReviewing(true)

    try {
      const prompt = `Objective: Analyze the provided translation against the original source text sentence by sentence. Provide constructive suggestions and alternative phrasings to improve the translation's accuracy, grammar, fluency, and style in the target language. Adhere strictly to the output format specified below.
Source Language: ${settings.sourceLang} Target Language: ${settings.targetLang}
Original Source text (${settings.sourceLang}):
${sourceText}

Translated text (${settings.targetLang}):
${translatedText}
Instructions:
	1	Sentence Segmentation: First, accurately identify the individual sentences in the Original Source Text. Let N be the total number of sentences you identify.
	2	Sentence-by-Sentence Review & Suggestion: For each sentence (1 to N) in the Original Source Text:
	◦	Carefully compare the source sentence to its corresponding translated segment.
	◦	Evaluate the translation. If issues are found regarding accuracy, grammar, fluency, or natural style in ${settings.targetLang}, formulate a concise, specific suggestion for improvement. This might involve proposing alternative wording, correcting grammar, or suggesting a more idiomatic phrasing in ${settings.targetLang}.
	3	Output Generation (Strict Rules):
	◦	You must generate exactly N lines of output, corresponding sequentially to the N sentences identified in the Original Source Text.
	◦	For each sentence:
	▪	If the current translation accurately conveys the meaning and is grammatically, stylistically, and fluently excellent in ${settings.targetLang}, the entire output line for that sentence must be exactly: Good.
	▪	If there is room for improvement, provide a concrete suggestion or alternative phrasing on its corresponding output line. Focus on being constructive. Combine multiple suggestions for the same sentence onto that single line if possible, prioritizing the most impactful ones. Examples should offer solutions.
	▪	Example suggesting word choice: Consider using '[suggested target word]' instead of '[original word]' for better nuance.
	▪	Example suggesting rephrasing: Suggestion for fluency: '[proposed alternative phrasing in target language]'
	▪	Example correcting grammar: Grammar: Should be '[corrected grammatical structure]' here.
	▪	Example addressing meaning: To better capture the meaning of '[source phrase]', try: '[suggested target phrase]'
	◦	CRITICAL FORMATTING: Your response must contain only these N lines of feedback/suggestions. Do NOT include:
	▪	Any introductory text (e.g., "Here are suggestions:")
	▪	Any concluding text or summary.
	▪	Any blank lines between feedback lines.
	▪	Any prefixes like "Sentence 1:", "Line 1:", or bullet points.
	▪	Any explanations about your process.
Example Scenario (Illustrating Solution Focus):
If Original Text (3 sentences): The delivery arrived late. It caused significant problems for the team. Please investigate immediately and report back.
And Translated Text (in Target Language) might have corresponding issues:
Your output MUST look EXACTLY like this (3 lines total, offering solutions): Suggestion: For 'arrived late', consider '[target phrase for arrived late]' for stronger impact. Consider rephrasing 'significant problems for the team' as '[more natural target phrase for caused problems]'. To maintain urgency/command mood, try: '[suggested imperative phrase for investigate and report]'`

      const result = await callLLM(settings, prompt)
      setReviewFeedback(result)
    } catch (error) {
      console.error("Review error:", error)
      if (error instanceof Error) {
        alert(`Review error: ${error.message}`)
      } else {
        alert("Review error: An unknown error occurred")
      }
    } finally {
      setIsReviewing(false)
    }
  }

  return {
    reviewFeedback,
    setReviewFeedback,
    generateReview,
    isReviewing,
  }
}


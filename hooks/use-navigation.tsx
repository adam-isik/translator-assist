"use client"

import { useState, useEffect } from "react"

interface UseNavigationProps {
  sourceText: string
  translatedText: string
  reviewFeedback: string
}

export function useNavigation({ sourceText, translatedText, reviewFeedback }: UseNavigationProps) {
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0)
  const [currentTranslationIndex, setCurrentTranslationIndex] = useState(0)
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0)

  const [sourceSentenceCount, setSourceSentenceCount] = useState(0)
  const [translationSentenceCount, setTranslationSentenceCount] = useState(0)
  const [reviewLineCount, setReviewLineCount] = useState(0)

  // Count source sentences
  useEffect(() => {
    if (sourceText) {
      // Count sentences using regex
      const regex = /[^.!?]+[.!?]+/g
      const matches = sourceText.match(regex) || []

      // Check if there's remaining text after the last sentence
      const lastMatch = matches.length > 0 ? matches[matches.length - 1] : ""
      const lastMatchEnd = sourceText.lastIndexOf(lastMatch) + lastMatch.length
      const hasRemainingText = lastMatchEnd < sourceText.length && sourceText.substring(lastMatchEnd).trim().length > 0

      // Total count is matches plus any remaining text
      const count = matches.length + (hasRemainingText ? 1 : 0)

      // If no sentences were found but there is text, count it as one sentence
      setSourceSentenceCount(count > 0 ? count : sourceText.trim() ? 1 : 0)
    } else {
      setSourceSentenceCount(0)
    }
  }, [sourceText])

  // Count translation sentences
  useEffect(() => {
    if (translatedText) {
      // Count sentences using regex
      const regex = /[^.!?]+[.!?]+/g
      const matches = translatedText.match(regex) || []

      // Check if there's remaining text after the last sentence
      const lastMatch = matches.length > 0 ? matches[matches.length - 1] : ""
      const lastMatchEnd = translatedText.lastIndexOf(lastMatch) + lastMatch.length
      const hasRemainingText =
        lastMatchEnd < translatedText.length && translatedText.substring(lastMatchEnd).trim().length > 0

      // Total count is matches plus any remaining text
      const count = matches.length + (hasRemainingText ? 1 : 0)

      // If no sentences were found but there is text, count it as one sentence
      setTranslationSentenceCount(count > 0 ? count : translatedText.trim() ? 1 : 0)
    } else {
      setTranslationSentenceCount(0)
    }
  }, [translatedText])

  // Count review lines
  useEffect(() => {
    if (reviewFeedback) {
      const lineArray = reviewFeedback.split("\n").filter((line) => line.trim())
      setReviewLineCount(lineArray.length)
    } else {
      setReviewLineCount(0)
    }
  }, [reviewFeedback])

  // Navigation functions
  const navigateSourceNext = () => {
    if (currentSourceIndex < sourceSentenceCount - 1) {
      setCurrentSourceIndex(currentSourceIndex + 1)
    }
  }

  const navigateSourcePrev = () => {
    if (currentSourceIndex > 0) {
      setCurrentSourceIndex(currentSourceIndex - 1)
    }
  }

  const navigateTranslationNext = () => {
    if (currentTranslationIndex < translationSentenceCount - 1) {
      setCurrentTranslationIndex(currentTranslationIndex + 1)
    }
  }

  const navigateTranslationPrev = () => {
    if (currentTranslationIndex > 0) {
      setCurrentTranslationIndex(currentTranslationIndex - 1)
    }
  }

  const navigateReviewNext = () => {
    if (currentReviewIndex < reviewLineCount - 1) {
      setCurrentReviewIndex(currentReviewIndex + 1)
    }
  }

  const navigateReviewPrev = () => {
    if (currentReviewIndex > 0) {
      setCurrentReviewIndex(currentReviewIndex - 1)
    }
  }

  // Synchronized navigation for source and translation
  const navigateBothNext = () => {
    navigateSourceNext()
    navigateTranslationNext()
  }

  const navigateBothPrev = () => {
    navigateSourcePrev()
    navigateTranslationPrev()
  }

  // Synchronized navigation for all panels
  const navigateAllNext = () => {
    navigateSourceNext()
    navigateTranslationNext()
    navigateReviewNext()
  }

  const navigateAllPrev = () => {
    navigateSourcePrev()
    navigateTranslationPrev()
    navigateReviewPrev()
  }

  return {
    currentSourceIndex,
    currentTranslationIndex,
    currentReviewIndex,
    navigateSourceNext,
    navigateSourcePrev,
    navigateTranslationNext,
    navigateTranslationPrev,
    navigateReviewNext,
    navigateReviewPrev,
    navigateBothNext,
    navigateBothPrev,
    navigateAllNext,
    navigateAllPrev,
  }
}


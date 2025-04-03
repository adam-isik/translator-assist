"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Languages, EyeIcon, EyeOffIcon } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface TranslatedTextAreaProps {
  value: string
  onChange: (value: string) => void
  currentIndex: number
  onNext: () => void
  onPrevious: () => void
  targetLang: string
  onTranslate: () => void
  isTranslating: boolean
  highlightingEnabled: boolean
  onToggleHighlighting: () => void
}

export function TranslatedTextArea({
  value,
  onChange,
  currentIndex,
  onNext,
  onPrevious,
  targetLang,
  onTranslate,
  isTranslating,
  highlightingEnabled,
  onToggleHighlighting,
}: TranslatedTextAreaProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [sentences, setSentences] = useState<string[]>([])

  // Calculate sentences
  useEffect(() => {
    if (value) {
      // Find sentences
      const regex = /[^.!?]+[.!?]+/g
      const matches = value.match(regex) || []

      // Check if there's remaining text after the last sentence
      const lastMatch = matches.length > 0 ? matches[matches.length - 1] : ""
      const lastMatchEnd = value.lastIndexOf(lastMatch) + lastMatch.length
      const remainingText = value.substring(lastMatchEnd).trim()

      const sentenceList = [...matches]
      if (remainingText) {
        sentenceList.push(remainingText)
      }

      // If no sentences were found but there is text, treat the whole text as one sentence
      if (sentenceList.length === 0 && value.trim()) {
        sentenceList.push(value.trim())
      }

      setSentences(sentenceList)
    } else {
      setSentences([])
    }
  }, [value])

  // Scroll to highlighted sentence
  useEffect(() => {
    if (
      contentRef.current &&
      sentences.length > 0 &&
      currentIndex >= 0 &&
      currentIndex < sentences.length &&
      highlightingEnabled
    ) {
      const sentenceElements = contentRef.current.querySelectorAll("[data-sentence-index]")
      if (sentenceElements && sentenceElements.length > currentIndex) {
        sentenceElements[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentIndex, sentences, highlightingEnabled])

  return (
    <Card className="flex flex-col h-full border-0 rounded-none">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>Translated Text ({!targetLang || targetLang.startsWith("placeholder-") ? "Not set" : targetLang})</span>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="highlight-translation" checked={highlightingEnabled} onCheckedChange={onToggleHighlighting} />
              <Label htmlFor="highlight-translation" className="text-xs cursor-pointer">
                {highlightingEnabled ? (
                  <span className="flex items-center">
                    <EyeIcon className="h-3 w-3 mr-1" /> Highlighting
                  </span>
                ) : (
                  <span className="flex items-center">
                    <EyeOffIcon className="h-3 w-3 mr-1" /> Highlighting
                  </span>
                )}
              </Label>
            </div>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={onPrevious}
                disabled={currentIndex <= 0}
              >
                <ChevronUp className="h-4 w-4" />
                <span className="sr-only">Previous sentence</span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={onNext}
                disabled={!sentences.length || currentIndex >= sentences.length - 1}
              >
                <ChevronDown className="h-4 w-4" />
                <span className="sr-only">Next sentence</span>
              </Button>
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0 relative">
        {highlightingEnabled ? (
          <div ref={contentRef} className="w-full h-full p-4 overflow-auto whitespace-pre-wrap">
            {sentences.length > 0 ? (
              <div className="space-y-1">
                {sentences.map((sentence, index) => (
                  <div
                    key={index}
                    data-sentence-index={index}
                    className={`p-1 rounded transition-colors ${index === currentIndex ? "bg-yellow-100 dark:bg-yellow-900/30" : ""}`}
                  >
                    {sentence}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">Paste or type translated text here...</div>
            )}
          </div>
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-full resize-none p-4 focus:outline-none focus:ring-0 border-0 bg-background"
            placeholder="Paste or type translated text here..."
          />
        )}
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Button onClick={onTranslate} disabled={isTranslating} className="w-full" variant="outline">
          <Languages className="mr-2 h-4 w-4" />
          {isTranslating ? "Translating..." : "AI Translate"}
        </Button>
      </CardFooter>
    </Card>
  )
}


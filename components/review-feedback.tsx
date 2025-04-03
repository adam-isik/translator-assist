"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronUp, ChevronDown, Check } from "lucide-react"

interface ReviewFeedbackProps {
  value: string
  currentIndex: number
  onNext: () => void
  onPrevious: () => void
  onReview: () => void
  isReviewing: boolean
}

export function ReviewFeedback({
  value,
  currentIndex,
  onNext,
  onPrevious,
  onReview,
  isReviewing,
}: ReviewFeedbackProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[]>([])

  // Parse review feedback into lines
  useEffect(() => {
    if (value) {
      const lineArray = value.split("\n").filter((line) => line.trim())
      setLines(lineArray)
    } else {
      setLines([])
    }
  }, [value])

  // Scroll to highlighted line
  useEffect(() => {
    if (contentRef.current && lines.length > 0 && currentIndex >= 0 && currentIndex < lines.length) {
      const lineElements = contentRef.current.querySelectorAll("[data-line-index]")
      if (lineElements && lineElements.length > currentIndex) {
        lineElements[currentIndex].scrollIntoView({
          behavior: "smooth",
          block: "center",
        })
      }
    }
  }, [currentIndex, lines])

  return (
    <Card className="flex flex-col h-full border-0 rounded-none">
      <CardHeader className="py-2 px-4">
        <CardTitle className="text-sm font-medium flex justify-between items-center">
          <span>AI Review Feedback</span>
          <div className="flex gap-1">
            <Button variant="outline" size="icon" className="h-7 w-7" onClick={onPrevious} disabled={currentIndex <= 0}>
              <ChevronUp className="h-4 w-4" />
              <span className="sr-only">Previous line</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={onNext}
              disabled={!lines.length || currentIndex >= lines.length - 1}
            >
              <ChevronDown className="h-4 w-4" />
              <span className="sr-only">Next line</span>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-auto" ref={contentRef}>
        {lines.length > 0 ? (
          <div className="space-y-2">
            {lines.map((line, index) => (
              <div
                key={index}
                data-line-index={index}
                className={`p-2 rounded transition-colors ${index === currentIndex ? "bg-yellow-100 dark:bg-yellow-900/30" : ""}`}
              >
                {line}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center h-full flex items-center justify-center">
            {value ? value : "Review feedback will appear here"}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-2 border-t">
        <Button onClick={onReview} disabled={isReviewing} className="w-full" variant="outline">
          <Check className="mr-2 h-4 w-4" />
          {isReviewing ? "Reviewing..." : "Review Translation"}
        </Button>
      </CardFooter>
    </Card>
  )
}


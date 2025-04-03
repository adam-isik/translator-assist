"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "@/components/settings"
import { ResizableLayout } from "@/components/resizable-layout"
import { SourceTextArea } from "@/components/source-text-area"
import { TranslatedTextArea } from "@/components/translated-text-area"
import { ReviewFeedback } from "@/components/review-feedback"
import { SessionInfo } from "@/components/session-info"
import { useSettings } from "@/hooks/use-settings"
import { useTranslation } from "@/hooks/use-translation"
import { useReview } from "@/hooks/use-review"
import { useSession } from "@/hooks/use-session"
import { useNavigation } from "@/hooks/use-navigation"
import { Menu } from "lucide-react"

export default function Home() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { settings } = useSettings()
  const { sourceText, translatedText, setSourceText, setTranslatedText, generateTranslation, isTranslating } =
    useTranslation()
  const { reviewFeedback, generateReview, isReviewing } = useReview()
  const { sessionTime, sessionTotal, addToSessionTotal, resetSessionTime, resetSessionTotal, startSession } =
    useSession()

  const [sourceHighlightingEnabled, setSourceHighlightingEnabled] = useState(true)
  const [translationHighlightingEnabled, setTranslationHighlightingEnabled] = useState(true)

  const {
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
  } = useNavigation({ sourceText, translatedText, reviewFeedback })

  // Start session timer when source text is entered
  useEffect(() => {
    if (sourceText.trim().length > 0) {
      startSession()
    }
  }, [sourceText, startSession])

  // Calculate cost based on source text word count
  const currentCost = sourceText ? sourceText.split(/\s+/).filter(Boolean).length * (settings.pricePerWord || 0) : 0

  return (
    <main className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">Translator&apos;s AI Review Assistant</h1>
        <div className="flex items-center gap-4">
          <SessionInfo
            sessionTime={sessionTime}
            sessionTotal={sessionTotal}
            currentCost={currentCost}
            onAddToTotal={addToSessionTotal}
            onResetTime={resetSessionTime}
            onResetTotal={resetSessionTotal}
          />
          <Button variant="outline" size="icon" onClick={() => setSettingsOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <ResizableLayout>
          <SourceTextArea
            value={sourceText}
            onChange={setSourceText}
            currentIndex={currentSourceIndex}
            onNext={navigateSourceNext}
            onPrevious={navigateSourcePrev}
            sourceLang={settings.sourceLang}
            highlightingEnabled={sourceHighlightingEnabled}
            onToggleHighlighting={() => setSourceHighlightingEnabled(!sourceHighlightingEnabled)}
          />

          <TranslatedTextArea
            value={translatedText}
            onChange={setTranslatedText}
            currentIndex={currentTranslationIndex}
            onNext={navigateTranslationNext}
            onPrevious={navigateTranslationPrev}
            targetLang={settings.targetLang}
            onTranslate={() => generateTranslation(sourceText, settings)}
            isTranslating={isTranslating}
            highlightingEnabled={translationHighlightingEnabled}
            onToggleHighlighting={() => setTranslationHighlightingEnabled(!translationHighlightingEnabled)}
          />

          <ReviewFeedback
            value={reviewFeedback}
            currentIndex={currentReviewIndex}
            onNext={navigateReviewNext}
            onPrevious={navigateReviewPrev}
            onReview={() => generateReview(sourceText, translatedText, settings)}
            isReviewing={isReviewing}
          />
        </ResizableLayout>
      </div>

      <div className="p-2 border-t flex justify-center gap-4">
        <Button
          variant="outline"
          onClick={navigateAllPrev}
          disabled={currentSourceIndex <= 0 && currentReviewIndex <= 0}
        >
          Previous (All Panels)
        </Button>
        <Button
          variant="outline"
          onClick={navigateAllNext}
          disabled={
            (!sourceText || currentSourceIndex >= (sourceText.match(/[^.!?]+[.!?]+/g) || []).length - 1) &&
            (!reviewFeedback ||
              currentReviewIndex >= reviewFeedback.split("\n").filter((line) => line.trim()).length - 1)
          }
        >
          Next (All Panels)
        </Button>
      </div>

      <Settings open={settingsOpen} onOpenChange={setSettingsOpen} />
    </main>
  )
}


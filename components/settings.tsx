"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useSettings } from "@/hooks/use-settings"
import { LANGUAGES, MODELS } from "@/lib/constants"

interface SettingsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Settings({ open, onOpenChange }: SettingsProps) {
  const { settings, updateSettings } = useSettings()
  const [localSettings, setLocalSettings] = useState(settings)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings, open])

  const handleSave = () => {
    updateSettings(localSettings)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your API keys, language preferences, and pricing settings. All settings are stored locally in your
            browser and are never sent to any server.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="api-keys">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="languages">Languages</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
          </TabsList>

          <TabsContent value="api-keys" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <Input
                id="openai-key"
                type="password"
                value={localSettings.openaiKey || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, openaiKey: e.target.value })}
                placeholder="sk-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <Input
                id="anthropic-key"
                type="password"
                value={localSettings.anthropicKey || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, anthropicKey: e.target.value })}
                placeholder="sk-ant-..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="gemini-key">Google Gemini API Key</Label>
              <Input
                id="gemini-key"
                type="password"
                value={localSettings.geminiKey || ""}
                onChange={(e) => setLocalSettings({ ...localSettings, geminiKey: e.target.value })}
                placeholder="AIza..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model-selection">LLM Model Selection</Label>
              <Select
                value={localSettings.selectedModel || "placeholder-model"}
                onValueChange={(value) => setLocalSettings({ ...localSettings, selectedModel: value })}
              >
                <SelectTrigger id="model-selection">
                  <SelectValue placeholder="Select a model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder-model" disabled>
                    Select a model
                  </SelectItem>
                  {MODELS.map((model) => (
                    <SelectItem key={model.id} value={model.id} disabled={!localSettings[model.keyField]}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {!localSettings.selectedModel && (
                <p className="text-sm text-muted-foreground">Please enter at least one API key to select a model.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="languages" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source-language">Source Language</Label>
              <Select
                value={localSettings.sourceLang || "placeholder-source"}
                onValueChange={(value) => setLocalSettings({ ...localSettings, sourceLang: value })}
              >
                <SelectTrigger id="source-language">
                  <SelectValue placeholder="Select source language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder-source" disabled>
                    Select source language
                  </SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-language">Target Language</Label>
              <Select
                value={localSettings.targetLang || "placeholder-target"}
                onValueChange={(value) => setLocalSettings({ ...localSettings, targetLang: value })}
              >
                <SelectTrigger id="target-language">
                  <SelectValue placeholder="Select target language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="placeholder-target" disabled>
                    Select target language
                  </SelectItem>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="price-per-word">Price Per Word</Label>
              <div className="flex items-center">
                <span className="mr-2">$</span>
                <Input
                  id="price-per-word"
                  type="number"
                  min="0"
                  step="0.001"
                  value={localSettings.pricePerWord || ""}
                  onChange={(e) =>
                    setLocalSettings({
                      ...localSettings,
                      pricePerWord: e.target.value ? Number.parseFloat(e.target.value) : 0,
                    })
                  }
                  placeholder="0.05"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                This will be used to calculate the cost of translations based on word count.
              </p>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


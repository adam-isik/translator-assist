// Function to call the selected LLM provider
export async function callLLM(settings: any, prompt: string): Promise<string> {
  const { selectedModel, openaiKey, anthropicKey, geminiKey } = settings

  // Find the model details
  const modelInfo = getModelInfo(selectedModel)

  if (!modelInfo) {
    throw new Error("Invalid model selected")
  }

  // Call the appropriate provider
  try {
    switch (modelInfo.provider) {
      case "openai":
        return await callOpenAI(openaiKey, selectedModel, prompt)
      case "anthropic":
        return await callAnthropic(anthropicKey, selectedModel, prompt)
      case "gemini":
        return await callGemini(geminiKey, selectedModel, prompt)
      default:
        throw new Error("Unsupported model provider")
    }
  } catch (error) {
    console.error("API call error:", error)
    if (error instanceof Error) {
      throw new Error(`${modelInfo.provider} API error: ${error.message}`)
    } else {
      throw new Error(`${modelInfo.provider} API error: Unknown error occurred`)
    }
  }
}

// Helper function to get model info
// https://platform.openai.com/docs/models
// https://docs.anthropic.com/en/docs/about-claude/models/all-models
// https://ai.google.dev/gemini-api/docs/models
function getModelInfo(modelId: string) {
  const models = [
    { id: "gpt-4o-mini-2024-07-18", provider: "openai" },
    { id: "chatgpt-4o-latest", provider: "openai" },
    { id: "claude-3-7-sonnet-latest", provider: "anthropic" },
    { id: "claude-3-5-haiku-latest", provider: "anthropic" },
    { id: "gemini-2.0-flash", provider: "gemini" },
    { id: "gemini-2.5-pro-exp-03-25", provider: "gemini" },
  ]

  return models.find((model) => model.id === modelId)
}

// OpenAI API call
async function callOpenAI(apiKey: string, model: string, prompt: string): Promise<string> {
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  }

  const payload = {
    model: model,
    messages: [
      { role: "system", content: "You are a helpful translation assistant." },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error?.message || response.statusText
      } catch {
        errorMessage = errorData || response.statusText
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error("OpenAI API error:", error)
    throw error
  }
}

// Anthropic API call
async function callAnthropic(apiKey: string, model: string, prompt: string): Promise<string> {
  const headers = {
    "Content-Type": "application/json",
    "x-api-key": apiKey,
    "anthropic-version": "2023-06-01",
    "anthropic-dangerous-direct-browser-access": "true",
  }

  const payload = {
    model: model,
    messages: [{ role: "user", content: prompt }],
    max_tokens: 4000,
    temperature: 0.3,
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error?.message || response.statusText
      } catch {
        errorMessage = errorData || response.statusText
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.content[0].text
  } catch (error) {
    console.error("Anthropic API error:", error)
    throw error
  }
}

// Google Gemini API call
async function callGemini(apiKey: string, model: string, prompt: string): Promise<string> {
  // For Gemini, we need to use the correct model name format
  const modelName = model.includes("/") ? model : "gemini-pro"

  const headers = {
    "Content-Type": "application/json",
  }

  const payload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
    generationConfig: {
      temperature: 0.3,
    },
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      },
    )

    if (!response.ok) {
      const errorData = await response.text()
      let errorMessage
      try {
        const errorJson = JSON.parse(errorData)
        errorMessage = errorJson.error?.message || response.statusText
      } catch {
        errorMessage = errorData || response.statusText
      }
      throw new Error(errorMessage)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error("Gemini API error:", error)
    throw error
  }
}


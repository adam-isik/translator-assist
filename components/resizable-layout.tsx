"use client"

import type React from "react"

import { useState } from "react"
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels"

interface ResizableLayoutProps {
  children: React.ReactNode[]
}

export function ResizableLayout({ children }: ResizableLayoutProps) {
  // Default to equal widths for all three panels
  const [sizes, setSizes] = useState([33.33, 33.33, 33.33])

  const handleResize = (newSizes: number[]) => {
    setSizes(newSizes)
  }

  return (
    <PanelGroup direction="horizontal" onLayout={handleResize} className="h-full">
      <Panel defaultSize={33.33} minSize={20}>
        {children[0]}
      </Panel>

      <PanelResizeHandle className="w-1 bg-border hover:bg-primary hover:w-1.5 transition-all" />

      <Panel defaultSize={33.33} minSize={20}>
        {children[1]}
      </Panel>

      <PanelResizeHandle className="w-1 bg-border hover:bg-primary hover:w-1.5 transition-all" />

      <Panel defaultSize={33.33} minSize={20}>
        {children[2]}
      </Panel>
    </PanelGroup>
  )
}


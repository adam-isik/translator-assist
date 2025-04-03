"use client"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock, DollarSign, RefreshCw } from "lucide-react"
import { formatTime } from "@/lib/utils"

interface SessionInfoProps {
  sessionTime: number
  sessionTotal: number
  currentCost: number
  onAddToTotal: (amount: number) => void
  onResetTime: () => void
  onResetTotal: () => void
}

export function SessionInfo({
  sessionTime,
  sessionTotal,
  currentCost,
  onAddToTotal,
  onResetTime,
  onResetTotal,
}: SessionInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-sm gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(sessionTime)}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onResetTime}>
                <RefreshCw className="h-3 w-3" />
                <span className="sr-only">Reset timer</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Session time</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center text-sm gap-1">
              <DollarSign className="h-4 w-4" />
              <span>${sessionTotal.toFixed(2)}</span>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onResetTotal}>
                <RefreshCw className="h-3 w-3" />
                <span className="sr-only">Reset total</span>
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Session total</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" className="h-8" onClick={() => onAddToTotal(currentCost)}>
              Add ${currentCost.toFixed(2)} to total
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add current translation cost to session total</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}


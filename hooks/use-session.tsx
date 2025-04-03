"use client"

import { useState, useEffect } from "react"

export function useSession() {
  const [sessionTime, setSessionTime] = useState(0)
  const [sessionTotal, setSessionTotal] = useState(0)
  const [sessionStarted, setSessionStarted] = useState(false)

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (sessionStarted) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [sessionStarted])

  const addToSessionTotal = (amount: number) => {
    setSessionTotal((prev) => prev + amount)
  }

  const resetSessionTime = () => {
    setSessionTime(0)
  }

  const resetSessionTotal = () => {
    setSessionTotal(0)
  }

  const startSession = () => {
    if (!sessionStarted) {
      setSessionStarted(true)
    }
  }

  return {
    sessionTime,
    sessionTotal,
    addToSessionTotal,
    resetSessionTime,
    resetSessionTotal,
    startSession,
  }
}


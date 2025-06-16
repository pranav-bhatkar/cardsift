"use client"

import { useState, useEffect } from "react"
import { Loader2, BarChart3, Shield } from "lucide-react"

const steps = [
  {
    id: 1,
    text: "Analyzing your selected cards...",
    icon: Loader2,
    duration: 1000,
  },
  {
    id: 2,
    text: "Generating AI summaries...",
    icon: BarChart3,
    duration: 1200,
  },
  {
    id: 3,
    text: "Checking eligibility...",
    icon: Shield,
    duration: 800,
  },
]

export function LoadingSequence() {
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const stepTimers: NodeJS.Timeout[] = []
    let totalTime = 0

    steps.forEach((step, index) => {
      const timer = setTimeout(() => {
        setCurrentStep(index)

        // Animate progress for step 2
        if (index === 1) {
          let progressValue = 0
          const progressTimer = setInterval(() => {
            progressValue += 2
            setProgress(progressValue)
            if (progressValue >= 100) {
              clearInterval(progressTimer)
            }
          }, step.duration / 50)
        }
      }, totalTime)

      stepTimers.push(timer)
      totalTime += step.duration
    })

    return () => {
      stepTimers.forEach((timer) => clearTimeout(timer))
    }
  }, [])

  const currentStepData = steps[currentStep]
  const Icon = currentStepData?.icon || Loader2

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="space-y-6">
          <div className="flex justify-center">
            {currentStep === 0 && (
              <div className="animate-spin">
                <Icon className="h-12 w-12 text-primary" />
              </div>
            )}

            {currentStep === 1 && (
              <div className="w-full max-w-xs">
                <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="animate-bounce">
                <Icon className="h-12 w-12 text-primary" />
              </div>
            )}
          </div>

          <p className="text-lg font-medium">{currentStepData?.text}</p>
        </div>
      </div>
    </div>
  )
}

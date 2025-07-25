import React from 'react'
import { AccessibilityExamples } from '../components/examples/AccessibilityExamples'
import { AccessibilityProvider } from '../components/ui/AccessibilityProvider'

export function AccessibilityDemo() {
  return (
    <AccessibilityProvider>
      <div className="min-h-screen bg-gray-50">
        <AccessibilityExamples />
      </div>
    </AccessibilityProvider>
  )
}
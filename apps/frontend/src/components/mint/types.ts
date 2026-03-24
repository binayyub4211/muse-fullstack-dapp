import type React from 'react'

// Shared types for the MintStepper flow
export interface Metadata {
  title: string
  description: string
  category: string
  tags: string[]
  price: string
  royalty: string
}

export interface FileData {
  file: File | null
  preview: string | null
  type: string
}

export interface StepperProps {
  onComplete?: (data: { metadata: Metadata; fileData: FileData }) => void
}

export interface MintStep {
  id: number
  title: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<{ className?: string }>
  description: string
}

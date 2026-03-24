import { useState } from 'react'
import { ChevronRight, ChevronLeft, FileText, Upload, Wallet } from 'lucide-react'
import { ErrorHandler } from '@/utils/errorHandler'
import type { AppError } from '@/utils/errorHandler'
import { ErrorDisplay } from '@/components/ErrorDisplay'
import type { TransactionStatusType } from '@/components/TransactionStatus'
import { StepIndicator } from './mint/StepIndicator'
import { MetadataForm } from './mint/MetadataForm'
import { FileUploadStep } from './mint/FileUploadStep'
import { SignStep } from './mint/SignStep'
import type { Metadata, FileData, StepperProps, MintStep } from './mint/types'

export function MintStepper({ onComplete }: StepperProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<AppError | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const [metadata, setMetadata] = useState<Metadata>({
    title: '',
    description: '',
    category: '',
    tags: [],
    price: '',
    royalty: '10',
  })

  const [fileData, setFileData] = useState<FileData>({
    file: null,
    preview: null,
    type: '',
  })

  const [walletConnected, setWalletConnected] = useState(false)
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusType>('idle')

  const steps: MintStep[] = [
    { id: 1, title: 'Metadata', icon: FileText, description: 'Add artwork details' },
    { id: 2, title: 'Upload', icon: Upload, description: 'Upload your file' },
    { id: 3, title: 'Sign', icon: Wallet, description: 'Sign transaction' },
  ]

  const validateMetadata = (): boolean =>
    !!(metadata.title.trim() && metadata.description.trim() && metadata.category && metadata.price.trim())

  const validateFile = (): boolean => !!(fileData.file && fileData.preview)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
    const maxSize = 50 * 1024 * 1024

    if (!allowedTypes.includes(file.type)) {
      setError(
        ErrorHandler.handle({
          code: 'VALIDATION_ERROR',
          message: 'Invalid file type. Please upload an image or video.',
          userMessage: 'Invalid file type. Please upload an image or video.',
          isRecoverable: false,
        })
      )
      return
    }

    if (file.size > maxSize) {
      setError(
        ErrorHandler.handle({
          code: 'VALIDATION_ERROR',
          message: 'File too large. Maximum size is 50MB.',
          userMessage: 'File too large. Maximum size is 50MB.',
          isRecoverable: false,
        })
      )
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setFileData({ file, preview: e.target?.result as string, type: file.type })
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleNext = () => {
    if (currentStep === 1 && !validateMetadata()) {
      setError(
        ErrorHandler.handle({
          code: 'VALIDATION_ERROR',
          message: 'Please fill in all required fields',
          userMessage: 'Please fill in all required fields',
          isRecoverable: false,
        })
      )
      return
    }
    if (currentStep === 2 && !validateFile()) {
      setError(
        ErrorHandler.handle({
          code: 'VALIDATION_ERROR',
          message: 'Please upload a file',
          userMessage: 'Please upload a file',
          isRecoverable: false,
        })
      )
      return
    }
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1)
      setError(null)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      setError(null)
    }
  }

  const handleConnectWallet = async () => {
    setIsProcessing(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setWalletConnected(true)
      setError(null)
    } catch (err) {
      setError(ErrorHandler.handle(err))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSignTransaction = async () => {
    if (!walletConnected) {
      setError(
        ErrorHandler.handle({
          code: 'WALLET_ERROR',
          message: 'Please connect your wallet first',
          userMessage: 'Please connect your wallet first',
          isRecoverable: false,
        })
      )
      return
    }

    setIsProcessing(true)
    setTransactionStatus('pending')

    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
      setTransactionHash(mockHash)
      setTransactionStatus('confirmed')
      onComplete?.({ metadata, fileData })
    } catch (err) {
      setTransactionStatus('failed')
      setError(ErrorHandler.handle(err))
    } finally {
      setIsProcessing(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <MetadataForm metadata={metadata} onChange={setMetadata} />
      case 2:
        return (
          <FileUploadStep
            fileData={fileData}
            onFileChange={handleFileChange}
            onRemove={() => setFileData({ file: null, preview: null, type: '' })}
          />
        )
      case 3:
        return (
          <SignStep
            metadata={metadata}
            walletConnected={walletConnected}
            isProcessing={isProcessing}
            transactionStatus={transactionStatus}
            transactionHash={transactionHash}
            error={error}
            onConnectWallet={handleConnectWallet}
            onSignTransaction={handleSignTransaction}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Create NFT</h1>

      <StepIndicator steps={steps} currentStep={currentStep} />

      {error && (
        <ErrorDisplay
          error={error}
          onDismiss={() => setError(null)}
          showRetry={error.isRecoverable}
        />
      )}

      <div className="card p-6 mb-6">{renderStep()}</div>

      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="btn-secondary px-6 py-2 flex items-center space-x-2 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Previous</span>
        </button>

        <div className="flex space-x-2">
          {currentStep < 3 && (
            <button
              onClick={handleNext}
              className="btn-primary px-6 py-2 flex items-center space-x-2"
            >
              <span>Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { ChevronRight, ChevronLeft, Upload, CheckCircle2, Wallet, Image as ImageIcon } from 'lucide-react'
import { cn } from '@/utils/cn'

export interface MintStepperProps {
  onComplete: (data: any) => void
}

const STEPS = [
  { id: 'metadata', title: 'Metadata', description: 'Basic info' },
  { id: 'upload', title: 'Upload', description: 'Artwork file' },
  { id: 'sign', title: 'Sign', description: 'Mint NFT' },
]

export function MintStepper({ onComplete }: MintStepperProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    category: '',
    price: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [isMinting, setIsMinting] = useState(false)
  const [isWalletConnected, setIsWalletConnected] = useState(false)

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsMinting(true)
      // Simulate minting process
      setTimeout(() => {
        setIsMinting(false)
        onComplete({ metadata, fileData: { file, preview: '#' } })
      }, 2000)
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setMetadata(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Indicator */}
      <nav aria-label="Minting Progress" className="mb-8">
        <ol className="flex items-center justify-between">
          {STEPS.map((step, index) => (
            <React.Fragment key={step.id}>
              <li className="flex flex-col items-center relative z-10">
                <div 
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors",
                    index <= currentStep 
                      ? "bg-primary-600 border-primary-600 text-white" 
                      : "bg-white border-secondary-200 text-secondary-400"
                  )}
                  aria-current={index === currentStep ? "step" : undefined}
                >
                  {index < currentStep ? <CheckCircle2 size={20} /> : index + 1}
                </div>
                <span className={cn(
                  "text-xs font-medium mt-2",
                  index <= currentStep ? "text-primary-700" : "text-secondary-500"
                )}>
                  {step.title}
                </span>
                {index === currentStep && (
                  <span className="sr-only">(Current Step)</span>
                )}
              </li>
              {index < STEPS.length - 1 && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-colors",
                    index < currentStep ? "bg-primary-600" : "bg-secondary-200"
                  )} 
                  aria-hidden="true"
                />
              )}
            </React.Fragment>
          ))}
        </ol>
      </nav>

      <Card padding="lg" className="shadow-lg">
        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-secondary-900 border-b pb-2 mb-4">Artwork Metadata</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-secondary-700 mb-1">Artwork Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={metadata.title}
                    onChange={handleInputChange}
                    placeholder="Enter artwork title"
                    className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-secondary-700 mb-1">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={metadata.description}
                    onChange={handleInputChange}
                    placeholder="Describe your artwork..."
                    rows={4}
                    className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={metadata.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="digital-art">Digital Art</option>
                      <option value="photography">Photography</option>
                      <option value="3d">3D Rendering</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="price" className="block text-sm font-medium text-secondary-700 mb-1">Price (XLM)</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={metadata.price}
                      onChange={handleInputChange}
                      placeholder="0.0"
                      step="0.01"
                      className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <h2 className="text-xl font-bold text-secondary-900 border-b pb-2 mb-4">Upload Artwork</h2>
              <div 
                className={cn(
                  "border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer",
                  file ? "border-primary-500 bg-primary-50" : "border-secondary-300 hover:border-primary-400"
                )}
                onClick={() => document.getElementById('file-upload')?.click()}
                onKeyPress={(e) => e.key === 'Enter' && document.getElementById('file-upload')?.click()}
                role="button"
                tabIndex={0}
                aria-label="Upload artwork file"
              >
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
                {file ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle2 size={48} className="text-primary-600 mb-4" />
                    <p className="font-semibold text-secondary-900">{file.name}</p>
                    <p className="text-sm text-secondary-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      Change File
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload size={48} className="text-secondary-400 mb-4" />
                    <p className="text-lg font-medium text-secondary-900">Click to upload file</p>
                    <p className="text-secondary-500">PNG, JPG or WEBP (Max 10MB)</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300 text-center py-4">
              <h2 className="text-xl font-bold text-secondary-900 mb-2">Final Step: Minting</h2>
              <p className="text-secondary-600 mb-8">Connect your wallet and sign the transaction to create your NFT on the Stellar network.</p>
              
              <div className="bg-secondary-50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold text-secondary-900 mb-4 flex items-center">
                  <ImageIcon size={18} className="mr-2" />
                  Transaction Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-secondary-500">Title:</span><span>{metadata.title}</span></div>
                  <div className="flex justify-between"><span className="text-secondary-500">Price:</span><span>{metadata.price} XLM</span></div>
                  <div className="flex justify-between"><span className="text-secondary-500">Network Fee:</span><span>~0.00001 XLM</span></div>
                </div>
              </div>

              {!isWalletConnected ? (
                <Button variant="primary" size="lg" fullWidth leftIcon={<Wallet />} onClick={() => setIsWalletConnected(true)}>
                  Connect Wallet
                </Button>
              ) : (
                <div className="space-y-4">
                   <div className="flex items-center justify-center text-green-600 bg-green-50 py-2 rounded-md mb-4" role="status">
                    <CheckCircle2 size={18} className="mr-2" />
                    Wallet connected
                  </div>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    fullWidth 
                    isLoading={isMinting}
                    onClick={handleNext}
                  >
                    Sign & Mint NFT
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center border-t pt-6">
          <Button
            variant="ghost"
            onClick={handlePrev}
            disabled={currentStep === 0 || isMinting}
            leftIcon={<ChevronLeft size={18} />}
          >
            Previous
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={(currentStep === 0 && (!metadata.title || !metadata.price)) || (currentStep === 1 && !file) || (currentStep === 2 && !isWalletConnected) || isMinting}
            rightIcon={currentStep < STEPS.length - 1 ? <ChevronRight size={18} /> : undefined}
          >
            {currentStep < STEPS.length - 1 ? 'Next' : 'Complete'}
          </Button>
        </div>
      </Card>
      
      {/* Dynamic announcements for screen readers */}
      <div className="sr-only" aria-live="polite">
        {isMinting ? "Minting in progress..." : ""}
        {currentStep === 2 && isWalletConnected ? "Wallet connected, ready to sign." : ""}
      </div>
    </div>
  )
}

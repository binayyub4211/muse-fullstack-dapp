import { ErrorHandler } from '@/utils/errorHandler'
import { Artwork, CreateArtworkForm } from '@/types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export interface MintArtworkRequest extends CreateArtworkForm {
    creatorPublicKey: string
}

export interface MintArtworkResponse {
    artwork: Artwork
    transactionHash: string
    tokenId: string
}

export const artworkService = {
    /**
     * Mint a new artwork NFT
     */
    async mintArtwork(request: MintArtworkRequest): Promise<MintArtworkResponse> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/artworks/mint`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to mint artwork')
            }

            const data = await response.json()
            return data.data
        } catch (error) {
            throw ErrorHandler.handleError(error, {
                context: 'artworkService.mintArtwork',
                userMessage: 'Failed to mint artwork. Please try again.',
            })
        }
    },

    /**
     * Upload artwork metadata to IPFS
     */
    async uploadMetadata(metadata: any): Promise<{ metadataUri: string }> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/metadata/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(metadata),
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to upload metadata')
            }

            const data = await response.json()
            return data.data
        } catch (error) {
            throw ErrorHandler.handleError(error, {
                context: 'artworkService.uploadMetadata',
                userMessage: 'Failed to upload metadata. Please try again.',
            })
        }
    },

    /**
     * Get artwork by ID
     */
    async getArtwork(id: string): Promise<Artwork> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/artworks/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}))
                throw new Error(errorData.message || 'Failed to fetch artwork')
            }

            const data = await response.json()
            return data.data
        } catch (error) {
            throw ErrorHandler.handleError(error, {
                context: 'artworkService.getArtwork',
                userMessage: 'Failed to fetch artwork. Please try again.',
            })
        }
    },

    /**
     * Validate artwork data before minting
     */
    validateArtworkData(data: CreateArtworkForm): { isValid: boolean; errors: string[] } {
        const errors: string[] = []

        if (!data.title || data.title.trim().length === 0) {
            errors.push('Title is required')
        }

        if (!data.description || data.description.trim().length === 0) {
            errors.push('Description is required')
        }

        if (!data.imageUrl || data.imageUrl.trim().length === 0) {
            errors.push('Image is required')
        }

        if (!data.price || parseFloat(data.price) <= 0) {
            errors.push('Price must be greater than 0')
        }

        if (!data.category || data.category.trim().length === 0) {
            errors.push('Category is required')
        }

        return {
            isValid: errors.length === 0,
            errors,
        }
    },
}

export default artworkService

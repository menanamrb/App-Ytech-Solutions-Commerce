import { useState, useEffect } from 'react'

interface SearchResult {
  id: number
  type: 'devis' | 'pack_order' | 'message'
  [key: string]: any
}

interface SearchResponse {
  success: boolean
  data?: {
    devis: SearchResult[]
    packOrders: SearchResult[]
    messages: SearchResult[]
  }
  error?: string
}

export function useSearch() {
  const [results, setResults] = useState<{
    devis: SearchResult[]
    packOrders: SearchResult[]
    messages: SearchResult[]
  }>({
    devis: [],
    packOrders: [],
    messages: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = async (query: string) => {
    if (!query || query.length < 2) {
      setResults({ devis: [], packOrders: [], messages: [] })
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
      const data: SearchResponse = await response.json()
      
      if (data.success && data.data) {
        setResults(data.data)
      } else {
        setError(data.error || 'Search failed')
        setResults({ devis: [], packOrders: [], messages: [] })
      }
    } catch (err) {
      setError('Network error')
      setResults({ devis: [], packOrders: [], messages: [] })
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setResults({ devis: [], packOrders: [], messages: [] })
    setError(null)
  }

  return {
    results,
    loading,
    error,
    search,
    clearResults
  }
}

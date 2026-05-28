import { useCallback, useEffect, useState } from 'react'

interface UseAsyncResourceResult<T> {
  data: T | null
  isLoading: boolean
  error: Error | null
  refetch: () => void
}

/** Simulates API fetch; swap the fetcher when wiring the real backend. */
export function useAsyncResource<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
): UseAsyncResourceResult<T> {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = useCallback(() => setTick((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false

    setIsLoading(true)
    setError(null)

    fetcher()
      .then((result) => {
        if (!cancelled) {
          setData(result)
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error('Failed to load data'))
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher identity is intentional per caller
  }, [...deps, tick])

  return { data, isLoading, error, refetch }
}

export function mockDelay(ms = 350): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

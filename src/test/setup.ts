import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import { resetStorageCache } from '@/lib/storage'

beforeEach(() => {
  window.localStorage.clear()
  resetStorageCache()
})

afterEach(() => {
  cleanup()
})

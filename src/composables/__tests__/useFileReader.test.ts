import { describe, it, expect, beforeEach } from 'vitest'
import { useFileReader } from '../useFileReader'

describe('useFileReader', () => {
  let fileReader: ReturnType<typeof useFileReader>

  beforeEach(() => {
    fileReader = useFileReader()
  })

  describe('validateJson', () => {
    it('should return true for valid JSON string', () => {
      const validJson = '{"name": "test", "value": 123}'
      expect(fileReader.validateJson(validJson)).toBe(true)
    })

    it('should return true for valid JSON array', () => {
      const validJsonArray = '[{"id": 1}, {"id": 2}]'
      expect(fileReader.validateJson(validJsonArray)).toBe(true)
    })

    it('should return false for invalid JSON string', () => {
      const invalidJson = '{"name": "test", "value": }'
      expect(fileReader.validateJson(invalidJson)).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(fileReader.validateJson('')).toBe(false)
    })

    it('should return false for malformed JSON', () => {
      const malformedJson = '{"name": "test" "value": 123}'
      expect(fileReader.validateJson(malformedJson)).toBe(false)
    })

    it('should return true for simple values', () => {
      expect(fileReader.validateJson('123')).toBe(true)
      expect(fileReader.validateJson('"string"')).toBe(true)
      expect(fileReader.validateJson('true')).toBe(true)
      expect(fileReader.validateJson('null')).toBe(true)
    })
  })

  describe('reactive properties', () => {
    it('should initialize with correct default values', () => {
      expect(fileReader.isLoading.value).toBe(false)
      expect(fileReader.error.value).toBe(null)
    })
  })
})

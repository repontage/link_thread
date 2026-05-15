import { expect, test, describe } from 'vitest'
import { normalizeUrl, getThreadId } from '../lib/url-parser'

describe('normalizeUrl', () => {
  test('removes protocol and www', () => {
    expect(normalizeUrl('https://www.google.com')).toBe('google.com')
    expect(normalizeUrl('http://google.com')).toBe('google.com')
  })

  test('removes trailing slash', () => {
    expect(normalizeUrl('https://example.com/')).toBe('example.com')
    expect(normalizeUrl('https://example.com/path/')).toBe('example.com/path')
  })

  test('handles youtube specifically by keeping v parameter', () => {
    expect(normalizeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ')).toBe('youtube.com/watch?v=dQw4w9WgXcQ')
  })

  test('removes other parameters from youtube', () => {
    expect(normalizeUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s')).toBe('youtube.com/watch?v=dQw4w9WgXcQ')
  })

  test('handles youtu.be by converting to youtube.com/watch?v=ID', () => {
    expect(normalizeUrl('https://youtu.be/dQw4w9WgXcQ')).toBe('youtube.com/watch?v=dQw4w9WgXcQ')
  })
})

describe('getThreadId', () => {
  test('generates consistent 16-char hash', () => {
    const id1 = getThreadId('https://google.com')
    const id2 = getThreadId('http://www.google.com/')
    expect(id1).toBe(id2)
    expect(id1).toHaveLength(16)
  })
})

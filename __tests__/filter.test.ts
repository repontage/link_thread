import { expect, test } from 'vitest'
import { checkToxicity } from '../lib/filter'

test('checkToxicity identifies toxic words correctly', () => {
  expect(checkToxicity('이 바보야')).toBe(true)
  expect(checkToxicity('안녕하세요 좋은 하루입니다.')).toBe(false)
})

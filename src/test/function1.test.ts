import { multiply, sum } from '@/functionForTest1'
import { generateId } from '@/functions'
import { expect, it } from 'vitest'

it('sum of numbers', () => {
  //arrange (giver)
  const a = 1
  const b = 2

  //act(when)
  const result = sum(a, b)

  //assert(then)
  expect(result).toEqual(3)
})

it('multiply numbers', () => {
  const a = 1
  const b = 2

  const result = multiply(a, b)

  expect(result).toBe(2)
  expect(multiply(0, 2)).toBe(0)
})

it('generate id', () => {
  const result = generateId()

  expect(typeof result).toBe('number')
})

import { describe, it, expect } from 'vitest'
import { getRoomPrice, getServicePrice, formatPrice, ROOM_PRICES } from '../data/prices'

describe('getRoomPrice', () => {
  it('returns room price from ROOM_PRICES by type', () => {
    expect(getRoomPrice({ tipo: 'Estándar' })).toBe(80.00)
    expect(getRoomPrice({ tipo: 'Suite' })).toBe(180.00)
  })

  it('returns precio_noche if set', () => {
    expect(getRoomPrice({ tipo: 'Estándar', precio_noche: 99.50 })).toBe(99.50)
  })

  it('falls back to 80 for unknown types', () => {
    expect(getRoomPrice({ tipo: 'Penthouse' })).toBe(80.00)
  })

  it('returns 80 for null/undefined room', () => {
    expect(getRoomPrice(null)).toBe(80.00)
    expect(getRoomPrice({})).toBe(80.00)
  })
})

describe('getServicePrice', () => {
  it('returns price from SERVICE_PRICES by title', () => {
    expect(getServicePrice({ titulo: 'Room service' })).toBe(12.00)
    expect(getServicePrice({ titulo: 'Lavandería' })).toBe(15.00)
  })

  it('returns service.precio if set', () => {
    expect(getServicePrice({ titulo: 'Custom', precio: 25 })).toBe(25)
  })

  it('returns 0 for free services', () => {
    expect(getServicePrice({ titulo: 'Toallas extra' })).toBe(0)
  })
})

describe('formatPrice', () => {
  it('formats as USD', () => {
    expect(formatPrice(10)).toBe('$10.00')
    expect(formatPrice(99.5)).toBe('$99.50')
    expect(formatPrice(0)).toBe('$0.00')
  })
})

describe('ROOM_PRICES', () => {
  it('has expected room types', () => {
    expect(ROOM_PRICES).toHaveProperty('Estándar')
    expect(ROOM_PRICES).toHaveProperty('Suite Junior')
    expect(ROOM_PRICES).toHaveProperty('Suite')
    expect(ROOM_PRICES).toHaveProperty('Cabaña')
  })
})

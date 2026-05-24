import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import GlassCard from '../components/GlassCard'

describe('GlassCard', () => {
  it('renders children', () => {
    render(
      <MemoryRouter>
        <GlassCard className="test-class">
          <p>Hello</p>
        </GlassCard>
      </MemoryRouter>
    )
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})

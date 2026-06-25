import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import ScienceBackground from '../../components/ScienceBackground'

describe('ScienceBackground', () => {
  it('renders without crashing', () => {
    const { container } = render(<ScienceBackground />)
    expect(container.firstChild).toBeTruthy()
  })

  it('SVG decorative elements have aria-hidden', () => {
    const { container } = render(<ScienceBackground />)
    container.querySelectorAll('svg').forEach((svg) => {
      expect(svg).toHaveAttribute('aria-hidden', 'true')
    })
  })
})

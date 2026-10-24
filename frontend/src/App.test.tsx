import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('portal smoke test', () => {
  it('loads the sign-in experience', async () => {
    render(<BrowserRouter><App /></BrowserRouter>)
    expect(await screen.findByRole('heading', { name: /great work happens together/i })).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })
})
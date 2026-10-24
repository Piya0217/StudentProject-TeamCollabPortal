import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'sonner'
import App from './App'
import './styles/tokens.css'
import './styles/app.css'

createRoot(document.getElementById('root')!).render(
  <React.StrictMode><BrowserRouter><App /><Toaster position="bottom-right" richColors /></BrowserRouter></React.StrictMode>
)
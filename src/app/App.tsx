import { BrowserRouter } from 'react-router-dom'
import PortalApp from '../portal/App'

export function App() {
  return (
    <BrowserRouter>
      <PortalApp />
    </BrowserRouter>
  )
}
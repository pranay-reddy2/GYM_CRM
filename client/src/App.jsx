import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Maincontent from './components/Maincontent'
import { BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <Maincontent />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
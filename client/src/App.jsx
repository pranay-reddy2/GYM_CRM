import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Maincontent from './components/Maincontent'
import { BrowserRouter } from 'react-router-dom'
function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen">
  <Sidebar />

  <div
    className="flex flex-col min-h-screen"
    style={{
      marginLeft: "232px",
    }}
  >
    <Header />
    <Maincontent />
  </div>
</div>
    </BrowserRouter>
  )
}

export default App
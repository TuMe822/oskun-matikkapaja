import { Navigate, Route, Routes } from 'react-router'
import { Home } from './pages/Home'
import { ModeSelect } from './pages/ModeSelect'
import { Play } from './pages/Play'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/modes" element={<ModeSelect />} />
      <Route path="/play" element={<Play />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

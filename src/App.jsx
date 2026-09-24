import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateForm from './pages/CreateForm'
import PublicForm from './pages/PublicForm'
import Responses from './pages/Responses'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateForm />} />
        <Route path="/form/:id" element={<PublicForm />} />
        <Route path="/forms/:id/responses" element={<Responses />} />
      </Routes>
    </>
  )
}
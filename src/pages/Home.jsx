import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getForms } from '../services/api'
import Spinner from '../components/Spinner'

export default function Home() {
  const [forms, setForms] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | error

  useEffect(() => {
    async function load() {
      try {
        setForms(await getForms())
        setStatus('ready')
      } catch (err) {
        setStatus('error')
      }
    }
    load()
  }, [])

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <h1 style={{ fontSize: 40, marginBottom: 8 }}>MiniForms</h1>
        <p style={{ color: '#5f6368', marginBottom: 24 }}>
          Create simple forms and collect responses.
        </p>
        <Link to="/create" className="btn">
          Create Form
        </Link>
      </div>

      <h2>Your Forms</h2>
      {status === 'loading' && <Spinner text="Loading forms..." />}
      {status === 'error' && <p className="error">Something went wrong. Please try again.</p>}
      {status === 'ready' && forms.length === 0 && <p>No forms yet.</p>}

      {forms.map((f) => (
        <div className="card" key={f.id}>
          <h3 style={{ marginTop: 0 }}>{f.title}</h3>
          {f.description && <p>{f.description}</p>}
          <div className="row">
            <Link to={'/form/' + f.id} className="btn btn-secondary">
              Open Form
            </Link>
            <Link to={'/forms/' + f.id + '/responses'} className="btn btn-secondary">
              View Responses
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
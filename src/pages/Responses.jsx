import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getForm, getResponses } from '../services/api'
import Spinner from '../components/Spinner'

export default function Responses() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [responses, setResponses] = useState([])
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error

  async function load() {
    setStatus('loading')
    try {
      const formData = await getForm(id)
      const responseData = await getResponses(id)
      setForm(formData)
      setResponses(responseData)
      setStatus('ready')
    } catch (err) {
      if (err.message === 'Form not found') {
        setStatus('notfound')
      } else {
        setStatus('error')
      }
    }
  }

  useEffect(() => {
    load()
  }, [id])

  if (status === 'loading') {
    return (
      <div className="container">
        <Spinner text="Loading responses..." />
      </div>
    )
  }
  if (status === 'notfound') return <div className="container">Form not found.</div>
  if (status === 'error') {
    return <div className="container">Something went wrong. Please try again.</div>
  }

  return (
    <div className="container" style={{ maxWidth: 1000 }}>
      <div className="card">
        <h1 style={{ marginTop: 0 }}>{form.title}</h1>
        <p>{responses.length} {responses.length === 1 ? 'Response' : 'Responses'}</p>
        <button type="button" className="btn btn-secondary" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="card" style={{ overflowX: 'auto' }}>
        {responses.length === 0 ? (
          <p>No responses yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Submitted At</th>
                {form.questions.map((q) => (
                  <th key={q.id}>{q.question}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {responses.map((r) => (
                <tr key={r.responseId}>
                  <td>{new Date(r.submittedAt).toLocaleString()}</td>
                  {form.questions.map((q) => (
                    <td key={q.id}>{r.answers[q.id] || ''}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
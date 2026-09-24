import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import QuestionRenderer from '../components/QuestionRenderer'
import { getForm, submitResponse } from '../services/api'
import Spinner from '../components/Spinner'

export default function PublicForm() {
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState('loading') // loading | ready | notfound | error
  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    async function load() {
      try {
        const data = await getForm(id)
        setForm(data)
        setStatus('ready')
      } catch (err) {
        if (err.message === 'Form not found') {
          setStatus('notfound')
        } else {
          setStatus('error')
        }
      }
    }
    load()
  }, [id])

  function setAnswer(questionId, value) {
    setAnswers({ ...answers, [questionId]: value })
  }

  function validate() {
    const newErrors = {}
    for (const q of form.questions) {
      const value = answers[q.id]
      if (q.required && (!value || !value.trim())) {
        newErrors[q.id] = 'This question is required.'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit() {
    if (!validate()) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await submitResponse(id, answers)
      setSubmitted(true)
    } catch (err) {
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="container">
        <Spinner text="Loading form..." />
      </div>
    )
  }
  if (status === 'notfound') return <div className="container">Form not found.</div>
  if (status === 'error') {
    return <div className="container">Something went wrong. Please try again.</div>
  }

  if (submitted) {
    return (
      <div className="container">
        <div className="card">
          <h2>Response submitted!</h2>
          <p>Thank you for your response.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{ marginTop: 0 }}>{form.title}</h1>
        {form.description && <p>{form.description}</p>}
      </div>

      {form.questions.map((q) => (
        <QuestionRenderer
          key={q.id}
          question={q}
          value={answers[q.id]}
          onChange={(value) => setAnswer(q.id, value)}
          error={errors[q.id]}
        />
      ))}

      {submitError && <p className="error">{submitError}</p>}

      <button type="button" className="btn" onClick={handleSubmit} disabled={submitting}>
        {submitting ? (
          <>
            <Spinner small /> Submitting...
          </>
        ) : (
          'Submit'
        )}
      </button>
    </div>
  )
}
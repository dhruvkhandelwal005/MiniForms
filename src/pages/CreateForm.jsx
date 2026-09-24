import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormBuilder from '../components/FormBuilder'
import { createForm } from '../services/api'

export default function CreateForm() {
  const [submitting, setSubmitting] = useState(false)
  const [apiError, setApiError] = useState('')
  const [formId, setFormId] = useState(null)
  const [copied, setCopied] = useState(false)

  async function handleSubmit(form) {
    setSubmitting(true)
    setApiError('')
    try {
      const id = await createForm(form)
      setFormId(id)
    } catch (err) {
      setApiError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function copyLink(link) {
    await navigator.clipboard.writeText(link)
    setCopied(true)
  }

  if (formId) {
    const link = window.location.origin + '/form/' + formId
    return (
      <div className="container">
        <div className="card">
          <h2>Form created successfully!</h2>
          <p>Share this form:</p>
          <input className="input" value={link} readOnly />
          <div className="row" style={{ marginTop: 16 }}>
            <button type="button" className="btn" onClick={() => copyLink(link)}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
            <Link to={'/form/' + formId} className="btn btn-secondary">
              View Form
            </Link>
            <Link to={'/forms/' + formId + '/responses'} className="btn btn-secondary">
              View Responses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Create Form</h1>
      <FormBuilder onSubmit={handleSubmit} submitting={submitting} apiError={apiError} />
    </div>
  )
}
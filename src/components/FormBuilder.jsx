import { useState } from 'react'
import QuestionEditor from './QuestionEditor'
import { generateId } from '../services/api'
import Spinner from './Spinner'

function newQuestion() {
  return {
    id: generateId('q'),
    question: '',
    type: 'short',
    options: [],
    required: false,
  }
}

export default function FormBuilder({ onSubmit, submitting, apiError }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [questions, setQuestions] = useState([newQuestion()])
  const [error, setError] = useState('')

  function updateQuestion(id, updated) {
    setQuestions(questions.map((q) => (q.id === id ? updated : q)))
  }

  function deleteQuestion(id) {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  function addQuestion() {
    setQuestions([...questions, newQuestion()])
  }

  function handleSubmit() {
    if (!title.trim()) {
      setError('Form title is required.')
      return
    }
    if (questions.length === 0) {
      setError('Add at least one question.')
      return
    }
    for (const q of questions) {
      if (!q.question.trim()) {
        setError('Every question needs text.')
        return
      }
      if (q.type === 'mcq' && q.options.some((o) => !o.trim())) {
        setError('Multiple choice options cannot be empty.')
        return
      }
    }
    setError('')
    onSubmit({ title: title.trim(), description: description.trim(), questions })
  }

  return (
    <div>
      <div className="card">
        <label className="label">Form Title</label>
        <input
          className="input"
          value={title}
          placeholder="Untitled form"
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="label" style={{ marginTop: 12 }}>Description</label>
        <textarea
          className="input"
          value={description}
          placeholder="Form description"
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {questions.map((q) => (
        <QuestionEditor
          key={q.id}
          question={q}
          onChange={(updated) => updateQuestion(q.id, updated)}
          onDelete={() => deleteQuestion(q.id)}
        />
      ))}

      <button type="button" className="btn btn-secondary" onClick={addQuestion}>
        + Add Question
      </button>

      {error && <p className="error">{error}</p>}
      {apiError && <p className="error">{apiError}</p>}

      <div style={{ marginTop: 16 }}>
        <button type="button" className="btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? (
            <>
              <Spinner small /> Creating...
            </>
          ) : (
            'Create Form'
          )}
        </button>
      </div>
    </div>
  )
}
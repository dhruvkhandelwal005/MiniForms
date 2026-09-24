export default function QuestionRenderer({ question, value, onChange, error }) {
  return (
    <div className="card">
      <label className="label">
        {question.question}
        {question.required && <span style={{ color: '#d93025' }}> *</span>}
      </label>

      {question.type === 'short' && (
        <input
          className="input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === 'paragraph' && (
        <textarea
          className="input"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === 'mcq' &&
        question.options.map((option) => (
          <label key={option} style={{ display: 'block', marginBottom: 6 }}>
            <input
              type="radio"
              name={question.id}
              checked={value === option}
              onChange={() => onChange(option)}
            />{' '}
            {option}
          </label>
        ))}

      {error && <p className="error">{error}</p>}
    </div>
  )
}
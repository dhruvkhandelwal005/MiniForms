export default function QuestionEditor({ question, onChange, onDelete }) {
  function update(fields) {
    onChange({ ...question, ...fields })
  }

  function changeType(type) {
    if (type === 'mcq') {
      update({ type, options: question.options?.length ? question.options : ['Option 1'] })
    } else {
      update({ type, options: [] })
    }
  }

  function changeOption(index, value) {
    const options = question.options.map((o, i) => (i === index ? value : o))
    update({ options })
  }

  function addOption() {
    update({ options: [...question.options, 'Option ' + (question.options.length + 1)] })
  }

  function deleteOption(index) {
    update({ options: question.options.filter((_, i) => i !== index) })
  }

  return (
    <div className="card">
      <label className="label">Question</label>
      <input
        className="input"
        value={question.question}
        placeholder="Enter question"
        onChange={(e) => update({ question: e.target.value })}
      />

      <div className="row" style={{ marginTop: 12 }}>
        <select
          className="input"
          style={{ width: 'auto' }}
          value={question.type}
          onChange={(e) => changeType(e.target.value)}
        >
          <option value="short">Short Answer</option>
          <option value="paragraph">Paragraph</option>
          <option value="mcq">Multiple Choice</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={question.required}
            onChange={(e) => update({ required: e.target.checked })}
          />{' '}
          Required
        </label>
      </div>

      {question.type === 'mcq' && (
        <div style={{ marginTop: 12 }}>
          {question.options.map((option, index) => (
            <div className="row" key={index} style={{ marginBottom: 8, flexWrap: 'nowrap' }}>
              <span>○</span>
              <input
                className="input"
                value={option}
                onChange={(e) => changeOption(index, e.target.value)}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => deleteOption(index)}
                disabled={question.options.length <= 1}
              >
                X
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary" onClick={addOption}>
            + Add Option
          </button>
        </div>
      )}

      <div style={{ marginTop: 16 }}>
        <button type="button" className="btn btn-danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  )
}
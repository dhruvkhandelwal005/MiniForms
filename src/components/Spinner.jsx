// Full-area loader: <Spinner text="Loading form..." />
// Small inline loader for buttons: <Spinner small />
export default function Spinner({ text, small }) {
  if (small) return <span className="spinner spinner-small"></span>

  return (
    <div className="loader">
      <div className="spinner"></div>
      {text && <span>{text}</span>}
    </div>
  )
}
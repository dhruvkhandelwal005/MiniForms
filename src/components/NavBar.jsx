import { Link } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav style={{ background: '#fff', borderBottom: '1px solid #dadce0' }}>
      <div className="container row" style={{ justifyContent: 'space-between', padding: '14px 16px' }}>
        <Link to="/" style={{ fontWeight: 700, fontSize: 20, color: '#673ab7', textDecoration: 'none' }}>
          MiniForms
        </Link>
        <Link to="/create" className="btn">
          Create Form
        </Link>
      </div>
    </nav>
  )
}
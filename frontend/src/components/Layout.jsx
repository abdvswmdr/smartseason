import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout({ title, children, mainClass = "main" }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="page">
      <header className="header">
        <h2>{title}</h2>
        <div className="header-user">
          <span>{user.name}</span>
          <button onClick={handleLogout} className="btn btn-logout">Logout</button>
        </div>
      </header>
      <main className={mainClass}>{children}</main>
    </div>
  );
}

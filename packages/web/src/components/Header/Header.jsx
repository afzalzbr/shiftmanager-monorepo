import React, { useContext } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import TokenContext from "../../context/TokenContext.js";
import "./header.css";

function Header() {
  const token = localStorage.getItem("authToken");
  const { user } = useContext(TokenContext);

  const logout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className=" top-0 z-50 bg-white border-b border-border shadow-sm px-6 py-4 flex justify-between items-center">
        {/* App Logo */}
        <div className="text-2xl font-bold tracking-wide">
          <Link
            to="/"
            className="text-primary hover:text-primary/80 transition duration-200"
          >
            Shift Manager
          </Link>
        </div>

        {/* Navigation / Auth Buttons */}
        <div className="flex items-center gap-4">
          {token ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome,&nbsp;
                <span className="font-semibold text-foreground capitalize">
                  {user?.name}
                </span>
              </span>
              <button
                onClick={logout}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground text-sm font-semibold px-4 py-2 rounded-full transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-semibold border transition ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-primary border border-border hover:bg-primary hover:text-primary-foreground"
                  }`
                }
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-full text-sm font-semibold border transition ${
                    isActive
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-primary border border-border hover:bg-primary hover:text-primary-foreground"
                  }`
                }
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
      <Outlet />
    </div>
  );
}

export default Header;

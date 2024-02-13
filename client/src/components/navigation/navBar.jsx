import { useContext } from "react";
import AuthContext from "../../context/auth";
import { NavLink } from "react-router-dom";

const NavbarLink = ({ to, name }) => {
  return (
    <li className="text-base uppercase">
      <NavLink
        className={
          ({ isActive }) => {
            if (isActive) {
              return "border-r-4 border-orange-300 text-orange-300 py-3 flex space-x-3"
            }
            return "py-3 flex space-x-3"
          }
        }
        to={to}
      >
        <span>{name}</span>
      </NavLink>
    </li>
  )
}

const NavBar = () => {

  const { user } = useContext(AuthContext);

  return (
    <nav className="h-screen w-44 bg-slate-950 text-slate-300 shadow-2xl pl-3 flex flex-col justify-between fixed">
      <div className="h-24">

      </div>
      <div className="flex flex-col flex-grow">
        <ul className="my-5 space-y-3">
          <NavbarLink to="/" name="dashboard" />
          <NavbarLink to="/recipes" name="recipes" />
          {!(user) ? (
            null
          ) : (
            <>
              <NavbarLink to={`/profile/${user.id}`} name="profile" />
              <NavbarLink to="/test-kitchen" name="test kitchen" />
            </>
          )}
        </ul>
      </div>
      <div>
        <ul className="my-5 space-y-3">
          {/* <NavbarLink to="/info" name="info" /> */}
          {!(user) ? (
            <NavbarLink to="/login" name="login" />
          ) : (
            <NavbarLink to="/logout" name="logout" />
          )}
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
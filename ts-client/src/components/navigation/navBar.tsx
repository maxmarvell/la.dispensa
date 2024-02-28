import { useContext } from "react";
import AuthContext from "../../context/auth";
import { NavLink } from "react-router-dom";
import { AuthContextType } from "../../@types/context";

type NavBarLinkPropsType = {
  to: string,
  name: string
}

const NavbarLink = ({ to, name }: NavBarLinkPropsType) => {
  return (
    <li className="text-xs lg:text-base uppercase">
      <NavLink
        className={
          ({ isActive }) => {
            if (isActive) {
              return "flex h-full items-center border-b-4 border-orange-300 text-orange-300 lg:border-b-0 lg:border-r-4 lg:py-3"
            }
            return "flex h-full items-center border-b-4 border-slate-950 lg:border-b-0 lg:py-3"
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

  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <nav className="bg-slate-950 text-slate-300 shadow-2xl justify-between fixed
                    w-screen flex h-12 z-50 px-2 sm:px-10 
                    lg:px-0 lg:h-screen lg:w-44 lg:pl-3 lg:flex-col ">
      <div className="lg:h-24">

      </div>
      <div className="h-full grow lg:h-fit">
        <ul className="flex space-x-5 h-full lg:h-fit lg:space-x-0 lg:flex-col lg:my-5 lg:space-y-3">
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
      <div className="h-full lg:h-fit">
        <ul className="flex space-x-5 h-full lg:h-fit lg:space-x-0 lg:flex-col lg:my-5 lg:space-y-3">
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
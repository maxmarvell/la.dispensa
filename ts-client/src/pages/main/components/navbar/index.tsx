import { useContext } from "react";

// context
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType } from "@/services/contexts/models";

// child components
import { NavbarLink } from "./link";

export const NavigationBar = () => {

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
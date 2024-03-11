import { NavLink } from "react-router-dom";
import { NavBarLinkProps } from "@/pages/main/models";

export const NavbarLink = ({ to, name }: NavBarLinkProps) => {
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
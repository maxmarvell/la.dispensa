import { useContext, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

// services
import AuthContext from "@/services/contexts/authContext";

// types
import { AuthContextType } from "@/services/contexts/models";
import { useSearchTestKitchen } from "../hooks/useSearchTestKitchen";

export const TestKitchen = () => {

  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const [search, setSearch] = useState("");
  const [_, setSelected] = useState<string | null>(null);

  const { data } = useSearchTestKitchen({ userId, title: search });

  return (
    <div className="lg:w-screen h-full relative">
      <Outlet />
      <div className="absolute top-10 left-10 p-5 border w-64 flex flex-col bg-slate-50">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border-0 border-b-2 border-slate-950 mb-3 bg-transparent
                     focus:outline-none focus:border-orange-300"
          placeholder="Search Recipes..."
        />
        <div className="text-sm text-white flex flex-wrap gap-3">
          {data?.map((el, index) => (
            <NavLink
              className={
                ({ isActive }) => {
                  if (isActive) {
                    return "px-2 py-1 border-2 border-slate-950 bg-orange-300 text-slate-950"
                  }
                  return "px-2 py-1 border-2 border-slate-950 hover:bg-orange-300 hover:text-slate-950 bg-slate-950"
                }
              }
              key={index}
              onClick={() => {
                setSelected(el.id)
                setSearch("")
              }}
              to={`/test-kitchen/${el.id}`}
            >
              {el.title}
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TestKitchen;
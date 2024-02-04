import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import AuthContext from "../context/auth";
import { findTestKitchenRecipes } from "../api/test-kitchen";
import { keepPreviousData } from "@tanstack/react-query";


export default function TestKitchenContainer() {

  const { user: { id: userId } } = useContext(AuthContext);

  const [search, setSearch] = useState("")

  const { isLoading, isError, data } = useQuery({
    queryKey: ['testKitchen', userId, search],
    queryFn: () => findTestKitchenRecipes({ title: search }),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="h-full relative">
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
            <Link
              className="px-2 py-1 bg-slate-950 border-2 border-slate-950 hover:bg-orange-300
                         hover:border-slate-950 hover:text-slate-950"
              key={index}
              onClick={() => { setSearch("") }}
              to={`/test-kitchen/${el.id}`}
            >
              {el.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
import { Outlet, ScrollRestoration } from "react-router-dom"
import NavBar from "../components/navigation/navBar"


export default function Root() {
  return (
    <>
      <NavBar />
      <div className="pt-12 lg:pt-0 lg:ml-44 lg:h-screen">
        <ScrollRestoration />
        <Outlet />
      </div>
    </>
  )
};
import { Outlet, ScrollRestoration } from "react-router-dom"
import NavBar from "../components/navigation/navBar"


export default function Root() {
  return (
    <>
      <NavBar />
      <div className={`ml-44 flex-grow h-screen`}>
        <ScrollRestoration />
        <Outlet />
      </div>
    </>
  )
};
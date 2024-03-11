import { Outlet, ScrollRestoration } from "react-router-dom"

// child components
import { NavigationBar } from "../navbar"

export default function RootLayout() {
  return (
    <>
      <NavigationBar />
      <div className="pt-12 lg:pt-0 lg:ml-44 lg:h-screen">
        <ScrollRestoration />
        <Outlet />
      </div>
    </>
  )
};
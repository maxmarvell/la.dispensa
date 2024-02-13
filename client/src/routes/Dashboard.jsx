import { useContext } from "react";
import RecipeFeed from "../components/dashboard/recipeFeed";
import { UsersFeed } from "../components/dashboard/usersFeed";
import AuthContext from "../context/auth";
import { Link } from "react-router-dom";
import { Notifications } from "../components/dashboard/notifications";

export default function Dashboard() {

  const { user } = useContext(AuthContext);

  const Placeholder = () => {
    return (
      <div className="h-full w-full flex flex-col">
        <section className="min-h-72 space-y-4 px-3 pt-4">
          {Array.from(Array(5).keys()).map((_, index) => (
            <div key={index} className="flex space-x-3">
              <div className="bg-slate-300 rounded-full h-6 aspect-square" />
              <div className="grow bg-slate-300 rounded-full" />
            </div>
          ))}
        </section>
        <section className="grow space-y-4 px-3 py-4">
          <div className="bg-slate-300 h-12" />
          {Array.from(Array(10).keys()).map((_, index) => (
            <div key={index} className="flex space-x-3">
              <div className="bg-slate-300 rounded-full h-6 aspect-square" />
              <div className="grow bg-slate-300 rounded-full" />
            </div>
          ))}
        </section>
        <div className="absolute inset-0 flex flex-col justify-center bg-slate-300 px-2 bg-opacity-25">
          <div className="bg-white border flex flex-col items-center space-y-2 p-4">
            <div className="italic text-center text-wrap text-sm">sign up to connect with users on <br /> LA DISPENSA</div>
            <div>
              <Link className="bg-slate-950 px-2 py-1 text-white" to={"/login"}>
                SIGN UP
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <section className="h-full grow mr-72">
        <RecipeFeed />
      </section>
      <section className="border-l fixed right-0 top-12 lg:top-0 bottom-0 w-72 flex flex-col justify-between divide-y">
        {!user ? (
          <Placeholder />
        ) : (
          <>
            <section className="min-h-72 flex flex-col mx-3 py-4">
              <Notifications />
            </section>
            <section className="grow mx-3 py-4">
              <UsersFeed />
            </section>
          </>
        )
        }
      </section >
    </div >
  )

}
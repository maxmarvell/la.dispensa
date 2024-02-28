import { NavLink, Outlet, useParams } from "react-router-dom"
import { getRecipe } from "../../api/recipe"
import { useQuery } from "@tanstack/react-query"
import AuthContext from "../../context/auth"
import { useContext, useRef } from "react"
import Preparations from "../../components/recipe/preparations"
import Description from "../../components/recipe/description"
import Ingredients from "../../components/recipe/ingredients"
import Reviews from "../../components/recipe/reviews"
import Rating from "../../components/recipe/rating"
import CreateReview from "../../components/recipe/createReview"
import Profile from "../../components/recipe/profile"

// types
import { AuthContextType } from "../../@types/context"

export default function Index() {

  const { recipeId } = useParams();
  const { user } = useContext(AuthContext) as AuthContextType;
  const userId = user?.id;

  const { isLoading, data: recipe } = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipe({ recipeId })
  });

  const isAuthor = recipe?.authorId === userId;

  const topRef = useRef<HTMLDivElement>(null);
  const recipeRef = useRef<HTMLDivElement>(null)
  const reviewsRef = useRef<HTMLDivElement>(null);

  // auto scroll to main body on button click
  const executeScroll = (ref: React.RefObject<HTMLDivElement>) => ref?.current?.scrollIntoView({ behavior: "smooth" });

  // Whilst loading show nothing
  if (isLoading) {
    return (
      <div></div>
    )
  }

  return (
    <div className="flex flex-col divide-y-4 divide-slate-950 overflow-x-hidden">
      <section className="h-screen flex flex-col lg:flex-row relative" ref={topRef}>
        <Profile recipeRef={recipeRef} reviewsRef={reviewsRef} />
      </section>
      <section
        ref={recipeRef}
        className="pl-5 py-10 pr-10 divide-y body-text relative
                   lg:pl-24"
      >
        <div className="w-2/3 min-w-96 space-y-8">
          <section>
            <div className="text-xl border-b-2 border-black font-bold mb-5">Background</div>
            <Description />
          </section>
          <section>
            <div className="text-xl border-b-2 border-black font-bold mb-5">Ingredients</div>
            <Ingredients />
          </section>
          <section>
            <div className="text-xl border-b-2 border-black font-bold mb-5">Preparations </div>
            <Preparations />
          </section>
        </div>
      </section>
      {(isAuthor || !userId) ? (
        null
      ) : (
        <section
          className="pl-24 pr-64 py-10 divide-y-2 divide-black"
        >
          <Rating />
          <CreateReview />
        </section>
      )}
      <section
        ref={reviewsRef}
        className="pl-24 py-10 min-h-screen pr-64"
      >
        <div className="text-2xl font-bold flex space-x-5">
          <span>Reviews (1500)</span>
          <button
            className="text-xs underline my-auto"
            onClick={() => executeScroll(topRef)}
          >
            Return to Top
          </button>
        </div>
        <Reviews />
      </section>
      {isAuthor ? (
        <section
          className="pl-24 py-10 pr-10"
        >
          <div className="text-2xl font-bold flex space-x-5">
            <span>Admin Controls</span>
            <button
              className="text-xs underline my-auto"
              onClick={() => executeScroll(topRef)}
            >
              Return to Top
            </button>
          </div>
          <div className="flex justify-center divide-x my-5">
            <NavLink
              className={
                ({ isActive }) => (
                  isActive ? (
                    "underline underline-offset-8 px-6 first:pl-0 last:pr-0"
                  ) : "px-6 first:pl-0 last:pr-0"
                )
              }
              to={`components`}
              preventScrollReset={true}
            >
              Components
            </NavLink>
            <NavLink
              className={
                ({ isActive }) => (
                  isActive ? (
                    "underline underline-offset-8 px-6 first:pl-0 last:pr-0"
                  ) : "px-6 first:pl-0 last:pr-0"
                )
              }
              to={`privacy`}
              preventScrollReset={true}
            >
              Privacy
            </NavLink>
            <NavLink
              className={
                ({ isActive }) => (
                  isActive ? (
                    "underline underline-offset-8 px-6 first:pl-0 last:pr-0 text-red-500"
                  ) : "px-6 first:pl-0 last:pr-0 text-red-500"
                )
              }
              preventScrollReset={true}
              to={`delete`}
            >
              Delete
            </NavLink>
          </div>
          <Outlet />
        </section>
      ) : (
        null
      )}
    </div>
  )
}
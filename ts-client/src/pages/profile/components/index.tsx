// child components
import { RecipeGallery } from "./recipe-gallery";
import { UserDetails } from "./user-details";

export const Profile = () => {
  return (
    <div className="grow divide-y pb-0 p-10 pr-20 flex flex-col h-full overflow-y-scroll">
      <div className="flex md:divide-x mb-2 flex-col md:flex-row">
        <UserDetails />
      </div>
      <section className="mb-10 pt-2">
        <RecipeGallery />
      </section>
    </div>
  )
}
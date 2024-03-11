import { useContext } from "react";

// context
import AuthContext from "@/services/contexts/authContext";

// child components
import { RecipeFeedLayout } from "../recipe-feed/layout";
import { UnautheticatedView } from "../unauthenticated";
import { UsersFeedLayout } from "../user-feed/layout";
import { NotficationsLayout } from "../notifications/layout";

// types
import { AuthContextType } from "@/services/contexts/models";

const DashboardLayout = () => {

  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="flex min-h-screen">
      <section className="h-full grow mr-72">
        <RecipeFeedLayout />
      </section>
      <section className="border-l fixed right-0 top-12 lg:top-0 bottom-0 w-80 flex flex-col justify-between divide-y">
        {!user ? (
          <UnautheticatedView />
        ) : (
          <>
            <section className="min-h-72 flex flex-col mx-3 py-4">
              <NotficationsLayout />
            </section>
            <section className="grow mx-3 py-4">
              <UsersFeedLayout />
            </section>
          </>
        )
        }
      </section >
    </div >
  );
};

export default DashboardLayout;
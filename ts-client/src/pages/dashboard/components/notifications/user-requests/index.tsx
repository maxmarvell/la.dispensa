import { Link } from "react-router-dom";

// hooks
import { useConnectionRequests } from "@/pages/dashboard/hooks/useConnectionRequests";
import { useAcceptConnection } from "@/services/hooks/connections/useAcceptConnection";
import { useDeclineConnection } from "@/services/hooks/connections/useDeclineConnection";

// ui
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export const ConnectionRequests = () => {

  const { data } = useConnectionRequests();

  const { mutateAsync: mutateAccept } = useAcceptConnection();
  const { mutateAsync: mutateDecline } = useDeclineConnection();

  if (data?.length === 0) {
    return (
      <div className="text-center text-wrap text-xs">
        Nobody has requested to connect with you
      </div>
    )
  };

  return (
    <>
      {data?.map((request, index) => {
        let { connectedBy: { username, image }, connectedById } = request;
        return (
          <div
            className="flex border justify-between items-center"
            key={index}
          >
            <Link
              to={`/profile/${connectedById}`}
              className="flex items-center space-x-1"
            >
              <div className="w-14 p-2 aspect-square">
                <Avatar>
                  <AvatarImage src={image} />
                  <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </div>
              <div>
                <div className="hover:underline">
                  {username}
                </div>
              </div>
            </Link>
            <div className="pr-2 space-x-1">
              <button
                className="px-2 py-1 bg-slate-950 text-white text-xs"
                onClick={() => mutateAccept({ userId: connectedById })}
              >
                Accept
              </button>
              <button
                className="px-2 py-1 bg-slate-950 text-white text-xs"
                onClick={() => mutateDecline({ userId: connectedById })}
              >
                Decline
              </button>
            </div>
          </div>
        );
      })}
    </>
  );
};
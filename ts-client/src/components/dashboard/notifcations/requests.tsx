import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acceptConnection, getConnectionRequests, removeConnection as declineConnection } from "../../../api/user";
import { User } from "../../../assets/icons/dark";
import { Link } from "react-router-dom";


export const ConnectionRequests = () => {

  const { data } = useQuery({
    queryKey: ["connection-requests"],
    queryFn: () => getConnectionRequests()
  });

  const queryClient = useQueryClient();

  const { mutateAsync: mutateAccept } = useMutation({
    mutationFn: acceptConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["connection-requests", "user-feed"]});
    }
  });

  const { mutateAsync: mutateDecline } = useMutation({
    mutationFn: declineConnection,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["connection-requests", "user-feed"]})
    }
  })

  if (data?.length === 0) {
    return (
      <div className="text-center text-wrap text-xs">
        Nobody has requested to connect with you
      </div>
    )
  }

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
                <img
                  src={image ? image : User} alt=""
                  className="object-cover h-full w-full rounded-full"
                />
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
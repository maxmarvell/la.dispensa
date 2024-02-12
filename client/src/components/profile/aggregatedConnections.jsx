import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { getConnectionCount } from "../../api/profile";


export const AggregatedConnections = () => {
  
  const { userId } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["connection-count", userId],
    queryFn: () => getConnectionCount({ userId })
  });

  if (isLoading) {
    return (
      <div className="py-1">Connected with x other Creators</div>
    )
  }

  return (
    <div className="py-1">Connected with <span className="font-bold">{data}</span> other Creators</div>
  );
};

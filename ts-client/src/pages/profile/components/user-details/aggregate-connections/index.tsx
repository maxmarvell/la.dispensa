import { useParams } from "react-router-dom"

// services
import { useAggregatedConnections } from "@/pages/profile/hooks/useAggregatedConnections";

export const AggregatedConnections = () => {

  const { userId } = useParams();

  const { data, isLoading } = useAggregatedConnections({ userId })

  if (isLoading) {
    return (
      <div className="py-1">Connected with x other Creators</div>
    )
  }

  return (
    <div className="py-1">Connected with <span className="font-bold">{data}</span> other Creators</div>
  );
};

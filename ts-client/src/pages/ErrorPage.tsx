import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  return (
    <div className="flex flex-col h-full justify-center">
      <div className="text-4xl font-bold text-center">Oops!</div>
      <div className="text-center">Sorry, an unexpected error has occurred.</div>
      <div className="text-center">
        <i>{error instanceof Error ? error.message : String(error)}</i>
      </div>
    </div>
  );
}
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="flex flex-col h-full justify-center">
      <div className="text-4xl font-bold text-center">Oops!</div>
      <div className="text-center">Sorry, an unexpected error has occurred.</div>
      <div className="text-center">
        <i>{error.statusText || error.message}</i>
      </div>
    </div>
  );
}
import { useState } from "react";
import { ConnectionRequests } from "./requests";
import { TestKitchenNotifications } from "./testKitchen";
import { RecipeNotifications } from "./recipeNotifications";


export const Notifications = () => {

  const [view, setView] = useState("connections");

  const Content = () => {
    switch (view) {
      case "connections":
        return <ConnectionRequests />
      case "recipes":
        return <RecipeNotifications />
      case "test-kitchen":
        return <TestKitchenNotifications />
    };
  };

  return (
    <>
      <div className="flex text-sm justify-around mb-2">
        <button
          className={`px-2 py-1 border-2 text-xs ${view === "connections" ? "bg-orange-300 text-slate-950 border-orange-300 hover:border-slate-950" : "bg-slate-950 text-white hover:border-orange-300 border-slate-950"}`}
          onClick={() => setView("connections")}
        >
          Connections
        </button>
        <button
          className={`px-2 py-1 border-2 text-xs ${view === "recipes" ? "bg-orange-300 text-slate-950 border-orange-300 hover:border-slate-950" : "bg-slate-950 text-white hover:border-orange-300 border-slate-950"}`}
          onClick={() => setView("recipes")}
        >
          Recipes
        </button>
        <button
          className={`px-2 py-1 border-2 text-xs ${view === "test-kitchen" ? "bg-orange-300 text-slate-950 border-orange-300 hover:border-slate-950" : "bg-slate-950 text-white hover:border-orange-300 border-slate-950"}`}
          onClick={() => setView("test-kitchen")}
        >
          Test Kitchen
        </button>
      </div>
      <div className="flex flex-col divide-y grow">
        <Content />
      </div>
    </>
  )
}
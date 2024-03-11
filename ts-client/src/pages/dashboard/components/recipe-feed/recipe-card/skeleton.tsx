export const RecipeCardSkeleton = () => {
  return (
    <div className="lg:min-w-[32rem] sm:w-72 py-10 animate-pulse">
      <section
        className="mb-2 w-full flex items-center space-x-3"
      >
        <div className="w-10 bg-slate-300 rounded-full aspect-square" />
        <div className="bg-slate-300 w-1/3 rounded-full h-4" />
      </section>
      <section className="relative aspect-[5/6] w-full bg-slate-300 mb-2" />
      <section className="">
        <div className="h-6 rounded-full w-2/3 mb-2 bg-slate-300" />
        <div className="h-2 rounded-full w-full mb-1 bg-slate-300" />
        <div className="h-2 rounded-full w-full mb-1 bg-slate-300" />
        <div className="h-2 rounded-full w-full mb-1 bg-slate-300" />
      </section>
    </div>
  )
};

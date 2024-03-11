export const UserCardSkeleton = () => (
  <div className="flex justify-between items-center border bg-slate-100 animate-pulse">
    <div className="flex items-center space-x-1">
      <div className="h-14 p-2 aspect-square rounded-full">
        <div className="object-cover h-full w-full rounded-full bg-slate-300" />
      </div>
      <div className="h-4 w-20 bg-slate-300 rounded-full " />
    </div>
    <div className="pr-4">
      <div className="h-4 w-10 bg-slate-300 px-2 py-1" />
    </div>
  </div>
)
import { User } from "../../assets/icons"

const sample = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat"


const CommentWrap = () => {
  return (
    <div className="flex grow items-center py-3 first:pt-0 last:pb-0">
      <div className="aspect-square w-10 rounded-full overflow-hidden">
        <img className="h-full w-full object-cover" src={User} alt="" />
      </div>
      <div className="pl-2 ">
        <div className="w-44 line-clamp-2">
          {sample}
        </div>
        <div>01/01/0001</div>
      </div>
    </div>
  )
}



const Comments = () => {
  return (
    <div className="flex flex-col">
      <div>
        Add a Comment
      </div>
      <textarea
        placeholder="type here..."
        className="border-0 border-b-2 grow border-slate-50 focus:border-orange-300 h-24 resize-none focus:outline-none bg-transparent"
      />
      <div className="py-5">
        Previous Comments
      </div>
      <div className="divide-y divide-slate-600">
        {Array.from(Array(5).keys()).map(el => (
          <CommentWrap key={el} />
        ))}
      </div>
    </div>
  )
}

export default Comments;
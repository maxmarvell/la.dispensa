import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { searchTags } from "../../api/tags";
import * as light from "../../assets/icons/light"

const TagSearch = ({ selectedTags, setSelectedTags }) => {

  const [name, setName] = useState("")

  const { isLoading, isError, data } = useQuery({
    queryKey: ["tags", name, selectedTags],
    queryFn: () => searchTags({ name, excludeTags: selectedTags }),
    placeholderData: keepPreviousData,
  });

  const [tags, setTags] = useState(data)

  useEffect(() => (
    setTags(data)
  ), [data])

  const handleAddTag = ({ name }) => {
    setSelectedTags(prev => [...prev, name]);
    // setTags(prev => prev.filter(el => el.name !== name));
  }

  const handleRemoveTag = ({ name }) => {
    setSelectedTags(prev => prev.filter(el => el !== name));
  }


  return (
    <div className="border-b-4 border-slate-950 pl-5 w-2/3">
      <div className="flex items-center space-x-5">
        <input
          type="text"
          value={name}
          className="border-0 border-b-2 border-black focus:outline-none focus:border-orange-300"
          onChange={e => setName(e.target.value)}
          placeholder="search tags"
        />
        <div>
          <div className="flex text-xs text-white space-x-3">
            {selectedTags?.map((name, index) => (
              <div
                className="bg-slate-950 relative px-2 py-1" key={index}
                onClick={() => handleRemoveTag({ name })}
              >
                {name}
                <button
                  className="h-4 w-4 absolute -top-2 -right-2 bg-slate-950 rounded-full"
                  onClick={() => handleRemoveTag({ name })}
                >
                  <img src={light.RemoveFill} alt="remove tag" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex text-xs text-white space-x-4 my-5">
        {tags?.map(({ name }, index) => (
          <button
            className="bg-slate-950 px-2 py-1" key={index}
            onClick={() => handleAddTag({ name })}
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default TagSearch;
const NewIngredientField = ({ state, handler, index }) => {
  return (
    <div className="flex space-x-5">
      <label className="flex flex-col flex-grow">
        <input
          className={`rounded-lg border-grey flex-grow`}
          type='text'
          value={state.ingredient.name}
          onChange={(e) => (handler(((prev) => {
            let newArr = [...prev];
            newArr[index] = { ...state, ingredient: { name: e.target.value } };
            return newArr;
          })))}
        />
      </label>
      <label className="flex flex-col flex-grow">
        <input
          className={`rounded-lg border-grey`}
          type="number"
          value={state.quantity}
          onChange={(e) => (handler(((prev) => {
            let newArr = [...prev]
            newArr[index] = { ...state, quantity: e.target.value }
            return newArr
          })))}
        />
      </label>
      <label className="flex flex-col">
        <select
          className={`rounded-lg border-grey max-w-xs`}
          type='text'
          value={state.unit ? state.unit : ""}
          onChange={(e) => (handler(((prev) => {
            let newArr = [...prev]
            let { unit, ...rest } = newArr[index]
            newArr[index] = e.target.value ? { ...rest, unit: e.target.value } : rest
            return newArr
          })))}
        >
          <option value="">-</option>
          {measureSelections.map((el, index) => (
            <option key={index} value={el.value}>{el.name}</option>
          ))}
        </select>
      </label>
    </div>
  )
}
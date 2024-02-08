const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

const CreateField = ({ state, handler, index }) => {

  const handleSetName = (e) => {
    handler(((prev) => {
      let newArr = [...prev];
      newArr[index] = { ...state, ingredient: { name: e.target.value } };
      return newArr;
    }));
  };

  const handleSetUnit = (e) => {
    handler(((prev) => {
      let newArr = [...prev]
      let { unit, ...rest } = newArr[index]
      newArr[index] = e.target.value ? { ...rest, unit: e.target.value } : rest
      return newArr
    }));
  };

  const handleSetQuantity = (e) => {
    handler(((prev) => {
      let newArr = [...prev]
      newArr[index] = { ...state, quantity: e.target.value }
      return newArr
    }));
  };

  return (
    <div className="flex space-x-2 w-2/3 min-w-64">
      <label className="flex grow">
        <input
          className="border-0 p-0 border-b-2 bg-transparent border-slate-950
                     focus:outline-none focus:border-orange-300 capitalize grow"
          type='text'
          value={state.ingredient.name}
          onChange={handleSetName}
          placeholder="Product"
        />
      </label>
      <label>
        <input
          className="border-0 p-0 border-b-2 bg-transparent border-slate-950
                     focus:outline-none focus:border-orange-300 max-w-12"
          type="number"
          value={state.quantity}
          onChange={handleSetQuantity}
          placeholder="100"
        />
      </label>
      <label className="flex justify-end">
        <select
          className="border-0 p-0 border-b-2 bg-transparent border-slate-950
                     focus:outline-none focus:border-orange-300 max-w-12"
          type='text'
          value={state.unit ? state.unit : ""}
          onChange={handleSetUnit}
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


export default CreateField;

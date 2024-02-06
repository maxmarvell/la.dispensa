import * as dark from "../../../assets/icons/dark"


const CreateField = ({ instruction, setNewInstructions }) => {

  const { timeAndTemperature, step, description } = instruction;

  const handleSetDescription = (value) => {
    setNewInstructions((prev) => (
      prev.map((el) => {
        if (el.step === step) {
          console.log(el)
          return { ...el, ["description"]: value }
        } else {
          return el
        }
      })
    ));
  };

  const setTimeTemperatureField = (e) => {

    const { value, name } = e.target;

    setNewInstructions((prev) => (
      prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === instruction.step) {
          let newField = timeAndTemperature;
          if (value !== "") {
            newField[name] = value;
          } else {
            delete newField[name]
          };
          console.log({ ...rest, timeAndTemperature: { ...newField } })
          return { ...rest, timeAndTemperature: { ...newField } }
        } else {
          return { timeAndTemperature, ...rest }
        };
      })
    ));
  };

  const toggleTimeAndTemperatureField = () => {
    setNewInstructions((prev) => (
      prev.map(({ timeAndTemperature, ...rest }) => {
        if (rest.step === step) {
          return timeAndTemperature ? rest : { ...rest, timeAndTemperature: { unit: "C" } }
        }
        else {
          return { timeAndTemperature, ...rest }
        }
      })
    ))
  };

  return (
    <div className="flex">
      <div
        className="grow text-lg font-bold justify-between mb-1 border-l-4
                   pl-2 border-transparent focus-within:border-orange-300"
      >
        <div className="flex grow justify-between">
          <div className="font-bold">
            Step {step}
          </div>
          <div className="text-xs space-x-2 flex">
            {timeAndTemperature ? (
              <>
                <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                  <input
                    type="number"
                    name="hours"
                    value={timeAndTemperature.hours ? timeAndTemperature.hours : ""}
                    className="border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={(e) => setTimeTemperatureField(e)}
                  />
                  <span>hr</span>
                </div>
                <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                  <input
                    type="number"
                    name="minutes"
                    value={timeAndTemperature.minutes ? timeAndTemperature.minutes : ""}
                    className="border-0 pl-0 pr-1 py-1 w-10 focus:outline-none"
                    onChange={(e) => setTimeTemperatureField(e)}
                  />
                  <span>mins</span>
                </div>
                <div className="border-b-2 border-black flex items-center ring-offset-2 focus-within:ring-2">
                  <input
                    type="number"
                    name="temperature"
                    value={timeAndTemperature.temperature ? timeAndTemperature.temperature : ""}
                    onChange={(e) => setTimeTemperatureField(e)}
                    className=" border-0 px-0 py-1 pr-1 w-14 focus:outline-none"
                  />
                  <span>{timeAndTemperature.unit}</span>
                </div>
              </>
            ) : (
              null
            )}
            <button
              onClick={toggleTimeAndTemperatureField}
              className={`border-2 ${timeAndTemperature ? "border-orange-300 bg-orange-300" : "border-slate-950"}`}
            >
              <img src={dark.Fire} alt="add-temperature-field" />
            </button>
          </div>
        </div>
        <div
          className="grow border-0 mb-2 text-sm
                     px-0 border-transparent min-h-20"
        >
          <label htmlFor={`update-instruction-${instruction.step}`} className="hidden">new instruction input</label>
          <textarea
            value={description}
            id={`input-new-instruction-${instruction.step}`}
            onChange={(e) => handleSetDescription(e.target.value)}
            className="h-full w-full border-none focus:outline-none px-0"
            placeholder="Write here..."
          />
        </div>
      </div>
    </div >
  );
};

export default CreateField;
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "../ui/select"

// types
import { NewIngredientInputType } from "@/types/ingredient";

const measureSelections = [
  { name: 'g', value: 'G' },
  { value: 'KG', name: 'kg' },
  { value: 'CUP', name: 'cup' },
  { value: 'ML', name: 'mL' },
  { value: 'L', name: 'L' },
  { value: 'OZ', name: 'oZ' }
];

type IngredientInputProps = {
  ingredient: NewIngredientInputType
  setIngredient?: {
    nameChange?: ({ name }: { name: string }) => void,
    quantityChange: ({ quantity }: { quantity: number }) => void,
    unitChange: ({ unit }: { unit: "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined }) => void,
  }
  disabled?: boolean
}

export const IngredientInput = ({ ingredient, setIngredient, disabled }: IngredientInputProps) => {
  return (
    <>
      <Input
        defaultValue={ingredient?.ingredient?.name || ""}
        placeholder="Ingredient"
        onChange={e => setIngredient?.nameChange ? setIngredient?.nameChange({ name: e.target.value }) : undefined}
        disabled={disabled || false}
      />
      <Input
        type="number"
        placeholder="Quantity"
        defaultValue={ingredient?.quantity || ""}
        onChange={e => setIngredient?.quantityChange({ quantity: e.target.valueAsNumber })}
      />
      <Select
        defaultValue={ingredient?.unit || ""}
        onValueChange={e => setIngredient?.unitChange({ unit: e as "G" | "KG" | "CUP" | "ML" | "L" | "OZ" | undefined })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Unit" />
        </SelectTrigger>
        <SelectContent>
          {measureSelections.map((el, index) => (
            <SelectItem value={el.value} key={index}>{el.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </>
  )
}
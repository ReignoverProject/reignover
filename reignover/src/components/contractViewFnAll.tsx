import { volumeABI } from "../utils/abis/VolumeNFTManager"
import { Dynamicform } from "./dynamicFormReads"

export const ContractViewFunctions: React.FC = () => {
  const viewFunctions = volumeABI.filter(item => item.type === 'function' && item.stateMutability === ('view' || 'pure'))
  return (
    <div className="flex flex-col gap-2">
      <p className="text-bold mb-2 text-lg">View Functions</p>
      {viewFunctions.map((item, key) => (
        <div key={key} className="flex gap-2">
          <p>{item.name}</p>
          <div className="flex flex-col gap-1">
            <Dynamicform inputs={item.inputs} buttonName={"View"} name={item.name!.toString()} />
          </div>
        </div>
      ))}
    </div>
  )
}
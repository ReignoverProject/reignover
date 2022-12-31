import { AbiItem } from "../utils/types/abi"
import { Dynamicform } from "./dynamicFormReads"

interface IFN {
  ABI: AbiItem[]
  contractAddress: string;
}

export const ContractViewFunctions: React.FC<IFN> = ({ABI, contractAddress}) => {
  const viewFunctions = ABI.filter(item => item.type === 'function' && item.stateMutability === ('view' || 'pure'))
  return (
    <div className="flex flex-col gap-2">
      <p className="text-bold mb-2 text-lg">View Functions</p>
      {viewFunctions.map((item, key) => (
        <div key={key} className="flex gap-2">
          <div className="flex flex-col gap-1">
            <p>{item.name}</p>
            <Dynamicform inputs={item.inputs!} buttonName={"View"} name={item.name!.toString()} contractAddress={contractAddress} ABI={ABI} />
          </div>
        </div>
      ))}
    </div>
  )
}
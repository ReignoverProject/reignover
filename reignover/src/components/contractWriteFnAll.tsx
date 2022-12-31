import { AbiItem } from "../utils/types/abi";
import { Dynamicform } from "./dynamicFormWrites"

interface IFN {
  ABI: AbiItem[]
  contractAddress: string;
}

export const ContractWriteFunctions: React.FC<IFN> = ({contractAddress, ABI}) => {
  const viewFunctions = ABI.filter(item => item.type === 'function' && item.stateMutability !== ('view' || 'pure'))
  return (
    <div className="flex flex-col gap-2">
      <p className="text-bold mb-2 text-lg">Write Functions</p>
      {viewFunctions.map((item, key) => (
        <div key={key}>
          <p className="text-white" >{item.name}</p>
          <div className="flex flex-col gap-1">
            <Dynamicform inputs={item.inputs!} buttonName={"Write"} name={item.name!.toString()} contractAddress={contractAddress} ABI={ABI} />
          </div>
        </div>
      ))}
    </div>
  )
}
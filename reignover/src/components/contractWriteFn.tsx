import { volumeABI } from "../utils/abis/VolumeNFTManager"

export const ContractWriteFunctions: React.FC = () => {
  const viewFunctions = volumeABI.filter(item => item.type === 'function' && item.stateMutability !== ('view' || 'pure'))
  return (
    <div className="flex flex-col gap-2">
      <p className="text-bold mb-2 text-lg">Write Functions</p>
      {viewFunctions.map((item, key) => (
        <div key={key}>
          <p className="text-white" >{item.name}</p>
        </div>
      ))}
    </div>
  )
}
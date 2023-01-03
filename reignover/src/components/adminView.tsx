import { builderABI } from "../utils/abis/Builder"
import { kingdomsABI } from "../utils/abis/Kingdoms"
import { resourceManagerABI } from "../utils/abis/ResourceManager"
import { resourcesABI } from "../utils/abis/Resources"
import { builderAddress, kingdomAddress, resourceManagerAddress, resourcesAddress } from "../utils/constants"
import { AbiItem } from "../utils/types/abi"
import { ContractViewFunctions } from "./contractViewFnAll"
import { ContractWriteFunctions } from "./contractWriteFnAll"

export const AdminView: React.FC = () => {

    return (
        <div className="grid grid-cols-2 gap-5">
            <div className="flex-col border p-2">
                <p className=" font-bold text-xl text-gray-200">Kingdoms</p>
                <div className="flex flex-row justify-between gap-2">
                    <ContractWriteFunctions ABI={kingdomsABI as AbiItem[]} contractAddress={kingdomAddress} />
                    <ContractViewFunctions ABI={kingdomsABI as AbiItem[]} contractAddress={kingdomAddress} />
                </div>
            </div>
            <div className="flex-col border p-2">
                <p className=" font-bold text-xl text-gray-200">Builder</p>
                <div className="flex flex-row justify-between gap-2">
                    <ContractWriteFunctions ABI={builderABI as AbiItem[]} contractAddress={builderAddress} />
                    <ContractViewFunctions ABI={builderABI as AbiItem[]} contractAddress={builderAddress} />
                </div>
            </div>
            <div className="flex-col border p-2">
                <p className=" font-bold text-xl text-gray-200">Resource Manager</p>
                <div className="flex flex-row justify-between gap-2">
                    <ContractWriteFunctions ABI={resourceManagerABI as AbiItem[]} contractAddress={resourceManagerAddress} />
                    <ContractViewFunctions ABI={resourceManagerABI as AbiItem[]} contractAddress={resourceManagerAddress} />
                </div>
            </div>
            <div className="flex-col border p-2">
                <p className=" font-bold text-xl text-gray-200">Resources</p>
                <div className="flex flex-row justify-between gap-2">
                    <ContractWriteFunctions ABI={resourcesABI as AbiItem[]} contractAddress={resourcesAddress} />
                    <ContractViewFunctions ABI={resourcesABI as AbiItem[]} contractAddress={resourcesAddress} />
                </div>
            </div>
        </div>
    )
}
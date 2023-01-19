import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { builderAddress } from "../utils/constants"

interface IBuildBuilding {
    cityId: number
    buildingId: number
    refetch: () => Promise<any>
}

export const PrepBuilding: React.FC<IBuildBuilding> = ({cityId, buildingId, refetch}) => {
    
    const { config } = usePrepareContractWrite({
        address: builderAddress,
        abi: builderABI,
        functionName: 'prepLevelUpBuilding',
        args: [cityId, buildingId],
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite(config)

    const handleUpgrade = () => {
        write?.()
    }

    return (
        <button disabled={isLoading} onClick={handleUpgrade}>
            Upgrade
        </button>
    )
}

export const CompleteBuilding: React.FC<IBuildBuilding> = ({cityId, buildingId, refetch}) => {
    
    const { config } = usePrepareContractWrite({
        address: builderAddress,
        abi: builderABI,
        functionName: 'completeLevelUpBuilding',
        args: [cityId, buildingId],
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite(config)

    const handleUpgrade = () => {
        write?.()
    }

    return (
        <button disabled={isLoading} onClick={handleUpgrade}>
            Complete Upgrade
        </button>
    )
}
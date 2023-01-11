import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { builderAddress } from "../utils/constants"

interface IBuildBuilding {
    cityId: number
    buildingId: number
}

export const BuildBuilding: React.FC<IBuildBuilding> = ({cityId, buildingId}) => {
    
    const { config } = usePrepareContractWrite({
        addressOrName: builderAddress,
        contractInterface: builderABI,
        functionName: 'prepLevelUpBuilding',
        args: [cityId, buildingId],
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite(config)

    const handleUpgrade = () => {
        write?.()
    }

    return (
        <button disabled={isLoading}>
            Upgrade
        </button>
    )
}
import { useGetBuildingLevels } from "../utils/hooks/useGetBuildings"
import { builderAddress } from "../utils/constants"
import { useContractEvent } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { BuildingDetails } from "./buildingDetails"

interface IPlayerBuildings {
    cityId: number
    account: Address
}


export const PlayerBuildings: React.FC<IPlayerBuildings> = ({cityId, account}) => {
    const {buildingLevels, isLoading, isSuccess, refetchLevels} = useGetBuildingLevels(cityId)

    const myCityId = cityId

    // check events for completing new buildings -> refetch
    useContractEvent({
        address: builderAddress,
        abi: builderABI,
        eventName: 'CompleteBuildingUpgrade',
        listener(cityId, buildingId, newLevel) {
            if(Number(cityId) === myCityId) {
                refetchLevels()
                console.log("One of your buildings has completed upgrading!")
            }
        }
    })


    if (buildingLevels === undefined || buildingLevels === null) return <>loading...</>
    return (
        <div className="w-full px-4">
            {isSuccess && buildingLevels !== false && <BuildingDetails account={account} buildingLevels={buildingLevels} cityId={cityId} />}
        </div>
    )
}
import { useState, useEffect } from "react"
import { useGetAllBuildingRequirements, useGetBuildingLevels, useGetOwnerCityId } from "../utils/hooks/useGetBuildings"
import { builderAddress, buildings } from "../utils/constants"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { useContractEvent, useContractReads } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { BuildingDetails } from "./buildingDetails"
import useRefresh from "../utils/useRefresh"

interface IPlayerBuildings {
    cityId: number
    account: Address
}


export const PlayerBuildings: React.FC<IPlayerBuildings> = ({cityId, account}) => {
    const {buildingLevels, isLoading, isSuccess, refetchLevels} = useGetBuildingLevels(cityId)
    const {fastRefresh, slowRefresh} = useRefresh()
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
    
    
    // useEffect(() => {
    //     refetchLevels()
    // }, [fastRefresh])

    if (buildingLevels === undefined || buildingLevels === null) return <>loading...</>
    return (
        <div className="w-full px-4">
            {isSuccess && <BuildingDetails account={account} buildingLevels={buildingLevels} cityId={cityId} />}
        </div>
    )
}
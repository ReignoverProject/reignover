import { useState, useEffect } from "react"
import { useGetAllBuildingRequirements, useGetBuildingLevels, useGetOwnerCityId } from "../utils/hooks/useGetBuildings"
import { builderAddress, buildings } from "../utils/constants"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { useContractReads } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { BuildingDetails } from "./buildingDetails"
import useRefresh from "../utils/useRefresh"

interface IPlayerBuildings {
    cityId: number
    account: string
}


export const PlayerBuildings: React.FC<IPlayerBuildings> = ({cityId, account}) => {
    const {buildingLevels, isLoading, isSuccess, refetchLevels} = useGetBuildingLevels(cityId)
    const {fastRefresh, slowRefresh} = useRefresh()
    
    useEffect(() => {
        refetchLevels()
    }, [fastRefresh])

    if (buildingLevels === undefined) return <>loading...</>
    return (
        <div className="w-full px-4">
            {isSuccess && <BuildingDetails account={account} buildingLevels={buildingLevels.map(Number)} cityId={cityId} />}
        </div>
    )
}
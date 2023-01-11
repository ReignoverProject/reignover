import { useState, useEffect } from "react"
import { useGetAllBuildingRequirements, useGetBuildingLevels, useGetOwnerCityId } from "../utils/hooks/useGetBuildings"
import { builderAddress, buildings } from "../utils/constants"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { useContractReads } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { BuildingDetails } from "./buildingDetails"

interface IPlayerBuildings {
    cityId: number
}


export const PlayerBuildings: React.FC<IPlayerBuildings> = ({cityId}) => {
    const {buildingLevels, isLoading, isSuccess} = useGetBuildingLevels(cityId)

    if (buildingLevels === undefined) return <>loading...</>
    return (
        <div className="w-full px-4">
            {isSuccess && <BuildingDetails buildingLevels={buildingLevels.map(Number)} cityId={cityId} />}
        </div>
    )
}
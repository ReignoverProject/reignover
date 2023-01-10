import { useState, useEffect } from "react"
import { useAccount } from "wagmi"
import { useGetBuildingLevels, useGetOwnerCityId } from "../utils/hooks/useGetBuildings"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { buildings } from "../utils/constants"

interface IPlayerBuildings {
    address: string
    cityId: number
}

export const PlayerBuildings: React.FC<IPlayerBuildings> = ({address, cityId}) => {
    const buildingLevels = useGetBuildingLevels(cityId)

    return (
        <div>
            {
                buildings.map((building, i) => {
                    return (
                        <div key={i}>
                            <div>
                                {building.name}
                            </div>
                            <div>
                                {buildingLevels[i]}
                            </div>
                            {/* {building.isUnderConstruction && <div>Under Construction!</div>} */}
                        </div>
                    )
                })
            }
        </div>
    )
}
import { useEffect, useState } from "react"
import { buildings } from "../utils/constants"
import { useGetAllBuildingRequirements } from "../utils/hooks/useGetBuildings"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { BuildBuilding } from "./buildBuilding"

interface IBuildingDetails {
    buildingLevels: number[]
    cityId: number
}

export const BuildingDetails: React.FC<IBuildingDetails> = ({buildingLevels, cityId}) => {
    const [buildingsDetails, setBuildingsDetails] = useState<IPlayerBuilding[]>([])
    const {data, isLoading} = useGetAllBuildingRequirements(buildingLevels)

    useEffect(() => {
        if (data !== undefined) {
            const detailedReqs = buildingsDetails
            let sort = 0;
            for (let i = 0; i < buildings.length; i++) {
                detailedReqs.push(
                    {
                        name: buildings[i]!.name,
                        description: buildings[i]!.description,
                        level: buildingLevels[i]!,
                        levelRequirements: data[sort],
                        resourceRequirements: data[sort+1]!.map(Number),
                        timeRequirements: Number(data[sort+2]),
                        isUnderConstruction: false,
                    }
                )
                sort += 3;
            }
            console.log('requirements details: ', detailedReqs)
            setBuildingsDetails([...detailedReqs])
        }
    }, [data])


    return (
        <>
            {
                buildings.map((building, i) => {
                    return (
                        <div key={i} className="flex flex-row justify-between w-full">
                            <div className="flex-col">
                                <div className=" text-lg font-semibold">
                                    <p>{building.name}</p>
                                </div>
                                <div>
                                    <p>resource requirements here </p>
                                </div>
                            </div>
                            <div className="flex-col">
                                
                                <div className="font-semibold text-lg text-right">
                                    <p>{buildingsDetails[i]!.level}</p>
                                </div>
                                <div>
                                    <BuildBuilding buildingId={i} cityId={cityId} />
                                </div>
                                
                            </div>
                            {/* {building.isUnderConstruction && <div>Under Construction!</div>} */}
                        </div>
                    )
                })
            }
        </>
    )
}
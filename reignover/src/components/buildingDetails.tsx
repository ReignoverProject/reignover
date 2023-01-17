import { useEffect, useState } from "react"
import { buildings, resourceTokens } from "../utils/constants"
import { useGetAllBuildingRequirements, useGetBuildingQueue } from "../utils/hooks/useGetBuildings"
import { useGetResources } from "../utils/hooks/useGetResources"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import useRefresh from "../utils/useRefresh"
import { CompleteBuilding, PrepBuilding } from "./buildBuilding"
import { Countdown } from "./countdown"

interface IBuildingDetails {
    account: string
    buildingLevels: number[]
    cityId: number
}

export const BuildingDetails: React.FC<IBuildingDetails> = ({account, buildingLevels, cityId}) => {
    const {fastRefresh, slowRefresh} = useRefresh()
    const [buildingsDetails, setBuildingsDetails] = useState<IPlayerBuilding[]>([])
    const {data, isLoading, refetch} = useGetAllBuildingRequirements(buildingLevels)
    const {buildTime, queueLoading, queueRefetch} = useGetBuildingQueue(account, cityId)
    const { resourceAmounts, } = useGetResources(account)

    //console.log('build time',Date.now(), buildTime.map(time => Date.now() < time*1000))

    function checkResourceRequirements (resourceReqs: number[]) {
        const hasResources: boolean[] = []
        for (let i = 0; i < resourceReqs.length; i++) {
            const myRes = resourceAmounts![i]
            const reqRes = resourceReqs[i]
            hasResources.push(Number(myRes) >= Number(reqRes))
            
        }
        return hasResources
    }

    useEffect(() => {
        if (data !== undefined) {
            refetch()
            queueRefetch()
            const detailedReqs: IPlayerBuilding[] = []
            let sort = 0;
            for (let i = 0; i < buildings.length; i++) {
                detailedReqs.push(
                    {
                        name: buildings[i]!.name,
                        description: buildings[i]!.description,
                        level: buildingLevels[i]!,
                        levelRequirements: data[sort],
                        resourceRequirements: data[sort+1]!.map(Number),
                        hasResources: checkResourceRequirements(data[sort+1]!.map(Number)),
                        timeRequirements: Number(data[sort+2]),
                        constructionTime: buildTime[i]!*1000,
                    }
                )
                sort += 3;
            }
            //console.log('requirements details: ', detailedReqs)
            setBuildingsDetails(detailedReqs)
        }
    }, [data, buildingLevels])


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
                                <div className="flex flex-row gap-1">
                                    <p>Next Level: </p>
                                    {buildingsDetails[i]?.resourceRequirements.map((req:number, j) => {
                                        return (
                                            <p key={j} className={`${!buildingsDetails[i]?.hasResources[j] && `text-red-800`}`}>{resourceTokens[i]?.symbol} {req},</p>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="flex-col">
                                
                                <div className="font-semibold text-lg text-right">
                                    <p>{buildingsDetails[i]?.level}</p>
                                </div>
                                <div>
                                    {buildingsDetails[i]?.constructionTime! > 0 && buildingsDetails[i]?.constructionTime! > Date.now()
                                    ? <button disabled>
                                        <Countdown targetTime={buildingsDetails[i]?.constructionTime!} />
                                    </button> 
                                    : buildingsDetails[i]?.constructionTime! > 0 && buildingsDetails[i]?.constructionTime! <= Date.now()
                                        ? <CompleteBuilding buildingId={i} cityId={cityId} refetch={refetch} />
                                    : buildingsDetails[i]?.hasResources.includes(false) || !buildingsDetails[i]?.levelRequirements[0] || isLoading
                                        ? <button disabled>Upgrade</button>
                                    : <PrepBuilding buildingId={i} cityId={cityId} refetch={refetch} />
                                    }
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
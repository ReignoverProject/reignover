import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useContractEvent } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { builderAddress, buildings, resourceTokens } from "../utils/constants"
import { useGetAllBuildingRequirements, useGetBuildingQueue } from "../utils/hooks/useGetBuildings"
import { useGetResources } from "../utils/hooks/useGetResources"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import useRefresh from "../utils/useRefresh"
import { CompleteBuilding, PrepBuilding } from "./buildBuilding"
import { Countdown } from "./countdown"

interface IBuildingDetails {
    account: Address
    buildingLevels: number[]
    cityId: number
}

export const BuildingDetails: React.FC<IBuildingDetails> = ({account, buildingLevels, cityId}) => {
    const [buildingsDetails, setBuildingsDetails] = useState<IPlayerBuilding[]>([])
    const {data, isLoading, refetch} = useGetAllBuildingRequirements(buildingLevels)
    const {buildTime, queueLoading, queueRefetch} = useGetBuildingQueue(account, cityId)
    // console.log('building time', buildTime)
    const { resourceAmounts, } = useGetResources(account)    
    const myCityId = cityId

    // TODOs
    // build in timer effect to refresh buildings when one completes construction
    // starting building upgrade only affects one building, don't call all buildings to update

    const handleQueueRefresh = () => {
        queueRefetch()
        refetch()
    }

    useContractEvent({
        address: builderAddress,
        abi: builderABI,
        eventName: 'StartBuildingUpgrade',
        listener(cityId, buildingId, completionTime) {
            if(Number(cityId) === myCityId) {
                queueRefetch()
                refetch()
                console.log("Updating queue and building requirements")
            }
        }
    })

    useContractEvent({
        address: builderAddress,
        abi: builderABI,
        eventName: 'CompleteBuildingUpgrade',
        listener(cityId, buildingId, newLevel) {
            if(Number(cityId) === myCityId) {
                queueRefetch()
                refetch()
                console.log("Upgrade complete")
            }
        }
    })

    function checkResourceRequirements (resourceReqs: number[]) {
        const hasResources: boolean[] = []
        for (let i = 0; i < resourceReqs.length; i++) {
            const myRes = resourceAmounts![i]
            const reqRes = resourceReqs[i]
            hasResources.push(Number(myRes) >= Number(reqRes))
            
        }
        return hasResources
    }
    // todo: complete building button isn't going away after successfully leveling up building
    useEffect(() => {
        if (data !== undefined) {
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
            setBuildingsDetails(detailedReqs)
        }
    }, [data, buildingLevels])


    return (
        <>
            {
                buildings.map((building, i) => {
                    return (
                        <div key={i} className="flex flex-row justify-between w-full my-1">
                            <div className="flex flex-row gap-2 items-center">
                                <Image src={building.icon} width={64} height={64} alt={building.name} />
                                <div className="flex-col">
                                    <div className=" text-lg font-semibold">
                                        <p>{building.name}</p>
                                    </div>
                                    <div className="flex flex-row gap-1">
                                        <p>Next Level: </p>
                                        {buildingsDetails[i]?.resourceRequirements.map((req:number, j) => {
                                            return (
                                                <p key={j} className={`${!buildingsDetails[i]?.hasResources[j] && `text-red-800`}`}>{resourceTokens[j]?.symbol} {req},</p>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                            <div className="flex-col">
                                
                                <div className="font-semibold text-lg text-right">
                                    <p>{buildingsDetails[i]?.level}</p>
                                </div>
                                <div>
                                    {buildTime[i]!*1000 > 0 && buildTime[i]!*1000 > Date.now()
                                    ? <button disabled>
                                        <Countdown targetTime={buildTime[i]!*1000} refresh={handleQueueRefresh} />
                                    </button> 
                                    : buildTime[i]!*1000 > 0 && buildTime[i]!*1000 <= Date.now()
                                        ? <CompleteBuilding buildingId={i} cityId={cityId} refetch={refetch} />
                                    : buildingsDetails[i]?.hasResources.includes(false) || !buildingsDetails[i]?.levelRequirements[0] || isLoading
                                        ? <button disabled>Upgrade</button>
                                    : <PrepBuilding buildingId={i} cityId={cityId} refetch={refetch} />
                                    }
                                </div>
                                
                            </div>
                        </div>
                    )
                })
            }
        </>
    )
}
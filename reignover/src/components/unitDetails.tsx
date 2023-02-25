import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon"
import CheckIcon from "@heroicons/react/24/outline/CheckCircleIcon"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useContractEvent, useContractWrite, usePrepareContractWrite } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { units, buildings, resourceTokens, unitsAddress } from "../utils/constants"
import { useGetBuildingLevels } from "../utils/hooks/useGetBuildings"
import { useGetResources } from "../utils/hooks/useGetResources"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { CompleteBuilding, PrepBuilding } from "./buildBuilding"
import { Countdown } from "./countdown"
import build from "next/dist/build"
import { unitManagerABI } from "../utils/abis/UnitManager"
import { StartUnitRecruitment } from "./buildUnits"

interface IUnitDetails {
    account: Address
    unitList: number[]
    cityId: number
}

export const UnitDetails: React.FC<IUnitDetails> = ({account, unitList, cityId}) => {
    const [showDetails, setShowDetails] = useState<boolean[]>([false, false, false])
    const [buildAmount, setBuildAmount] = useState<number[]>([1, 1, 1])
    const playerBuildings = useGetBuildingLevels(cityId);
    const playerResources = useGetResources(account)    
    const myCityId = cityId
    
    const updateShowDetails = (i: number) => {
        const newArray = [...showDetails]
        newArray[i] = !showDetails[i]
        setShowDetails(newArray)
        // console.log(showDetails)
    }

    const handleBuildAmountUpdate = (e: React.FormEvent<HTMLInputElement>, i: number) => {
        const newArray = [...buildAmount]
        newArray[i] = Number(e.currentTarget.value)
        setBuildAmount(prev =>newArray)
        // console.log(newArray)
    }

    useContractEvent({
        address: unitsAddress,
        abi: unitManagerABI,
        eventName: 'StartRecruitment',
        listener(cityId, unitId, completionTime) {
            if(Number(cityId) === myCityId) {
                
                console.log("Started recruitment of ", units[Number(unitId)]!.name)
            }
        }
    })

    // TODOs
    // build in timer effect to refresh buildings when one completes construction
    // starting building upgrade only affects one building, don't call all buildings to update


    return (
        <>
            {
                units.map((unit, i) => {
                    const buildingLvls = playerBuildings.buildingLevels as number[]
                    const meetsBuildingReq = buildingLvls[unit.reqBuilding]! >= unit.buildingLevelReq

                    return (
                        
                        <div key={i} className="flex flex-col w-32 h-48 my-1 border rounded-sm justify-center items-center relative">
                            {!showDetails[i] ? 
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => updateShowDetails(i)}>
                                <Image src={unit.icon} alt={unit.name} width={64} height={64}  /> 
                                {unit.name} 
                            </div>
                            :
                            <div className="flex flex-col w-full p-1 justify-between h-full">
                                <div className="flex justify-between w-full ">
                                    <p>{unit.name}</p>
                                    <XMarkIcon className="h-6 w-6 cursor-pointer" onClick={() => updateShowDetails(i)} />
                                </div>
                                <div>
                                <p className={meetsBuildingReq ? 'text-sm ' : 'text-sm text-red-600'}>{buildings[unit.reqBuilding]!.name} lvl {unit.buildingLevelReq}</p>
                                {
                                    unit.resourceReq.map((res, j) => {
                                        const totalRes = res * buildAmount[i]!;
                                        const hasResource = playerResources.resourceAmounts![j]! >= totalRes
                                        return (
                                            j !== 0 &&
                                            <div key={j} className="flex flex-row text-sm justify-between">
                                                <p className={hasResource ? 'text-sm ' : 'text-sm text-red-600'}>{resourceTokens[j]!.symbol}</p>
                                                <p className={hasResource ? 'text-sm ' : 'text-sm text-red-600'}>{totalRes}</p>
                                            </div>

                                        )
                                    })
                                }
                                </div>
                                <div className="flex justify-between mt-2">
                                    <input type='number' 
                                        min={0}
                                        step={1}
                                        value={buildAmount[i]} 
                                        className='w-14 bg-transparent border border-slate-400 rounded-sm text-white' 
                                        onChange={(e) => handleBuildAmountUpdate(e, i)} 
                                    />
                                    <StartUnitRecruitment unitId={i} cityId={cityId} quantity={Number(buildAmount[i])} />
                                </div>
                            </div> 
                            }                
                        </div>
                        
                    )
                })
            }
        </>
    )
}
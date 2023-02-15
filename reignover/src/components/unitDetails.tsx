import XMarkIcon from "@heroicons/react/24/solid/XMarkIcon"
import CheckIcon from "@heroicons/react/24/outline/CheckCircleIcon"
import Image from "next/image"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useContractEvent } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { units, buildings, resourceTokens } from "../utils/constants"
import { useGetBuildingLevels } from "../utils/hooks/useGetBuildings"
import { useGetResources } from "../utils/hooks/useGetResources"
import { IPlayerBuilding } from "../utils/types/playerInfo"
import { CompleteBuilding, PrepBuilding } from "./buildBuilding"
import { Countdown } from "./countdown"
import build from "next/dist/build"

interface IUnitDetails {
    account: Address
    unitList: number[]
    cityId: number
}

export const UnitDetails: React.FC<IUnitDetails> = ({account, unitList, cityId}) => {
    const [showDetails, setShowDetails] = useState<boolean[]>([false, false, false])
    const [buildAmount, setBuildAmount] = useState<number[]>([1, 1, 1])
    const [unitDetails, setUnitDetails] = useState([])
    //const playerBuildings = useGetBuildingLevels(cityId);
    const playerResources = useGetResources(account)    
    const myCityId = cityId
    let count = 0;

    // useEffect(() => {
    //     if(count < units.length) {
    //         for(let i = 0; i < units.length; i++) {
    //             count++;
    //             console.log(count)
    //             setShowDetails(prev => [...prev, true])
    //             setBuildAmount(prev => [...prev, 1])
    //         }
    //     }
    // }, []) 

    
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

    // TODOs
    // build in timer effect to refresh buildings when one completes construction
    // starting building upgrade only affects one building, don't call all buildings to update


    return (
        <>
            {
                units.map((unit, i) => {
                    return (
                        
                        <div key={i} className="flex flex-col w-32 h-48 my-1 border rounded-sm justify-center items-center relative">
                            {!showDetails[i] ? 
                            <div className="flex flex-col items-center cursor-pointer" onClick={() => updateShowDetails(i)}>
                                <Image src={unit.icon} alt={unit.name} width={64} height={64}  /> 
                                {unit.name} 
                            </div>
                            :
                            <div className="flex flex-col w-full p-1">
                                <p>{unit.name}</p>
                                <div className="flex justify-end w-full ">
                                    <XMarkIcon className="h-5 w-5 -mt-5 cursor-pointer" onClick={() => updateShowDetails(i)} />
                                </div>
                                <p className=" text-sm">{buildings[unit.reqBuilding]!.name} lvl {unit.buildingLevelReq}</p>
                                {
                                    unit.resourceReq.map((res, j) => {
                                        const totalRes = res * buildAmount[i]!;
                                        return (
                                            j !== 0 &&
                                            <div key={j} className="flex flex-row text-sm justify-between">
                                                <p>{resourceTokens[j]!.symbol}</p>
                                                <p>{totalRes}</p>
                                            </div>

                                        )
                                    })
                                }
                                <div className="flex justify-between mt-2">
                                    <input type='number' 
                                        value={buildAmount[i]} 
                                        className='w-14 bg-transparent border border-slate-400 rounded-sm text-white' 
                                        onChange={(e) => handleBuildAmountUpdate(e, i)} 
                                    />
                                    <button>Hire</button>
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
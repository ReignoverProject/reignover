import { useEffect, useState } from "react"
import { useContract, useContractEvent, useContractWrite, usePrepareContractWrite } from "wagmi"
import { builderABI } from "../utils/abis/Builder"
import { resourceManagerABI } from "../utils/abis/ResourceManager"
import { resourcesABI } from "../utils/abis/Resources"
import { builderAddress, resourceManagerAddress, resourcesAddress, resourceTokens } from "../utils/constants"
import { useGetPendingResources, useGetResources } from "../utils/hooks/useGetResources"
import useRefresh from "../utils/useRefresh"

interface IResourcePanel {
    cityId: number
    address: `0x${string}`
}

export const ResourcePanel: React.FC<IResourcePanel> = ({address, cityId}) => {
    const resources = useGetResources(address)
    const pendingRewards = useGetPendingResources(cityId)
    // const [resourceAmounts, setResourceAmounts] = useState(resources.resourceAmounts)
    // const [pendingResources, setPendingResources] = useState(pendingRewards.rewards)
    // console.log(pendingRewards)
    const myCityId = cityId

    useContractEvent({
        address: builderAddress,
        abi: builderABI,
        eventName: 'StartBuildingUpgrade',
        listener(cityId, buildingId, completionTime) {
            if(Number(cityId) === myCityId) {
                resources.refetch()
                pendingRewards.refetch()
                console.log("One of your buildings has started upgrading!")
            }
        }
    })

    useContractEvent({
        address: builderAddress,
        abi: builderABI,
        eventName: 'CompleteBuildingUpgrade',
        listener(cityId, buildingId, newLevel) {
            if(Number(cityId) === myCityId) {
                pendingRewards.refetch()
                console.log("One of your buildings has completed upgrading!")
            }
        }
    })
    
    const {config} = usePrepareContractWrite({
        address: resourceManagerAddress,
        abi: resourceManagerABI,
        functionName: 'claimCityResources',
        args: [cityId]
    })

    const {write, isLoading, isError} = useContractWrite(config)

    return (
        <div className="flex flex-col gap-2 p-2 border border-gray-100 rounded min-w-[10rem]">
            <p className="font-semibold text-lg">Resources</p>
            {resourceTokens.map((token, i) => {
                return (
                    <div className="flex flex-col">
                            <p>
                                {token.symbol}:
                            </p>
                        <div key={i} className="flex flex-row justify-end gap-2">
                            <p>
                                {!resources.isLoading && resources.resourceAmounts !== undefined ? resources.resourceAmounts[i] : resources.isError ? 'error loading' : '...'}
                            </p>
                        {i !== 0 &&
                            <p>+{!pendingRewards.isLoading && Number(pendingRewards.rewards[i])}</p>
                        }
                        </div>
                    </div>
                )
            })}
            
            <button disabled={!write || isLoading } onClick={() => write?.()}>Claim All</button>
        </div>
    )
}
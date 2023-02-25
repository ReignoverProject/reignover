import { BigNumber } from "ethers"
import { useAccount, useContractRead, useContractReads } from "wagmi"
import { kingdomsABI } from "../abis/Kingdoms"
import { resourceManagerABI } from "../abis/ResourceManager"
import { resourcesABI } from "../abis/Resources"
import { unitManagerABI } from "../abis/UnitManager"
import { kingdomAddress, resourceManagerAddress, resourcesAddress, unitsAddress } from "../constants"


export const useGetCityUnits = (cityId: number) => {
        
    const {data, isLoading, isError, error, refetch} = useContractRead({
        address: kingdomAddress,
        abi: kingdomsABI,
        functionName: 'getCityUnits',
        args: [cityId],
        cacheTime:  10_000_000,
    })

    const unitList: BigNumber[] = data as BigNumber[]

    return {unitList, isLoading, isError, error, refetch} 
}

export const useGetUnitQueueTime = (cityId: number, buildingId: number) => {
            
    const {data, isLoading, isError, error, refetch} = useContractRead({
        address: kingdomAddress,
        abi: kingdomsABI,
        functionName: 'getCityUnits',
        args: [cityId, buildingId],
        cacheTime:  10_000_000,
    })

}



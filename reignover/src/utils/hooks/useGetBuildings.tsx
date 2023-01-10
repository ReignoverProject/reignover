import { useContractRead } from "wagmi"
import { builderABI } from "../abis/Builder"
import { kingdomsABI } from "../abis/Kingdoms"
import { builderAddress, kingdomAddress } from "../constants"
import { IPlayerBuilding } from "../types/playerInfo"

export const useGetBuildingsList = () => {
    const {data, isLoading, isError, error} = useContractRead({
        addressOrName: builderAddress,
        contractInterface: builderABI,
        functionName: 'getBuildings',
        cacheTime: 30_000_000,
    })

    const buildingList = data;

    return buildingList; // list of building names
}

export const useGetOwnerCityId = (account: string) => {

    const {data, isSuccess, isError, error} = useContractRead({
        addressOrName: kingdomAddress,
        contractInterface: kingdomsABI,
        functionName: 'getOwnerCities',
        args: [account],
        cacheTime: 30_000_000,
    })
    if(isError) {console.log('get city id error: ', error)}
    //console.log('address, city ids', account, data, isSuccess)
    let id: number | undefined;
    if (isSuccess && data !== undefined) {id = data[0]}

    return id
}

export const useGetBuildingLevels = (cityId: number) => {     

    const {data, isLoading, isError, error} = useContractRead({
        addressOrName: kingdomAddress,
        contractInterface: kingdomsABI,
        functionName: 'getCityBuildingsWithLevel',
        args: [cityId],
        cacheTime: 30_000_000,
    })

    const buildingLevels = data!.map(Number)

    return buildingLevels

}
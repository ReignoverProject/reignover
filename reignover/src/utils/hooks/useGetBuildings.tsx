import { useContractRead, useContractReads } from "wagmi"
import { builderABI } from "../abis/Builder"
import { kingdomsABI } from "../abis/Kingdoms"
import { builderAddress, buildings, kingdomAddress } from "../constants"
import { IRequirementsQuery } from "../types/contractTypes"
import { IPlayerBuilding } from "../types/playerInfo"

export const useGetBuildingsList = () => {
    const {data, isLoading, isError, error} = useContractRead({
        address: builderAddress,
        abi: builderABI,
        functionName: 'getBuildings',
        cacheTime: 30_000,
    })

    const buildingList = data;

    return buildingList; // list of building names
}

export const useGetOwnerCityId = (account: `0x${string}`) => {

    const {data, isSuccess, isError, error, refetch} = useContractRead({
        address: kingdomAddress,
        abi: kingdomsABI,
        functionName: 'getOwnerCities',
        args: [account],
        cacheTime: 3_000,
    })
    if(isError) {console.log('get city id error: ', error)}
    //console.log('address, city ids', account, data, isSuccess)
    let id: number | undefined;
    //if (isSuccess && data !== undefined) {id = data[0]}

    return {data, refetch}
}

export const useGetBuildingLevels = (cityId: number) => {     

    const {data, isLoading, isError, error, isSuccess, refetch} = useContractRead({
        address: kingdomAddress,
        abi: kingdomsABI,
        functionName: 'getCityBuildingsWithLevel',
        args: [cityId],
        cacheTime: 1_000,
    })
    // console.log('usegetbuildinglevels:', data)

    const buildingLevels = data
    const refetchLevels = refetch

    return {buildingLevels, isLoading, isSuccess, refetchLevels}

}

export const useCheckBuildingLevelRequirements = (cityBuildingLevels: number[], buildingId: number) => {
    const {data, isLoading, isError, error} = useContractRead({
        address: builderAddress,
        abi: builderABI,
        functionName: 'checkBuildingRequirementsMet',
        args: [cityBuildingLevels, buildingId],
        cacheTime: 30_000,
    })

    // const canBuild = data !== undefined ? data[0] : false;
    // const buildingLevelRequirementsMet = data !== undefined ? data[1] : [false];

    return { data, isLoading, isError}

}

export const useCheckBuildingResourceRequirements = (cityBuildingLevels: number[], buildingId: number) => {
    const {data, isLoading, isError, error, refetch} = useContractRead({
        address: builderAddress,
        abi: builderABI,
        functionName: 'getCostOfNextLevel',
        args: [cityBuildingLevels, buildingId],
        cacheTime: 30_000,
    })

    //const buildingResourceRequirements = data !== undefined ? data : [0];

    return {data, isLoading, isError, error, refetch}

}

export const useCheckBuildingTimeRequirements = (cityBuildingLevels: number[], buildingId: number) => {
    const {data, isLoading, isError, error} = useContractRead({
        address: builderAddress,
        abi: builderABI,
        functionName: 'getNextLevelTimeRequirement',
        args: [cityBuildingLevels, buildingId],
        cacheTime: 30_000,
    })

    const buildingTimeRequirements = data !== undefined ? data : 0;

    return {buildingTimeRequirements, isLoading, isError}

}

export const useGetAllBuildingRequirements = (cityBuildingLevels: number[]) => {

    function setupContractQuery(buildings: number[]) {
        const contractQuery: IRequirementsQuery[] = [];
        const queries = ['checkBuildingRequirementsMet', 'getCostOfNextLevel', 'getNextLevelTimeRequirement']

        buildings.forEach((b, i) => {
            queries.forEach(query => {
                contractQuery.push({
                    address: builderAddress,
                    abi: builderABI,
                    functionName: query,
                    args: [buildings, i]
                })
            })
        })

        return contractQuery;
    }

    const contractQueries = setupContractQuery(cityBuildingLevels)

    const { data, isLoading, isError, error, status, refetch } = useContractReads({
        contracts: contractQueries,
        cacheTime: 3_000,
    })

    return {data, isLoading, refetch}

}

export const useGetBuildingQueue = (address: `0x${string}`, cityId: number) => {

    function setupContractQuery(buildings: number) {
        const contractQuery: IRequirementsQuery[] = [];

        for (let i = 0; i < buildings; i++) {
            contractQuery.push({
                address: builderAddress,
                abi: builderABI,
                functionName: 'buildingQueue',
                args: [address, cityId, i]
            })
        }       
        
        return contractQuery;
    }

    const contractQueries = setupContractQuery(buildings.length)

    const { data, isLoading, isError, error, status, refetch } = useContractReads({
        contracts: contractQueries,
        cacheTime: 3_000,
    })

    const buildTime = data !== undefined ? data.map(Number) : [0,0,0,0,0]
    const queueLoading = isLoading
    const queueRefetch = refetch

    return {buildTime, queueLoading, queueRefetch}
}
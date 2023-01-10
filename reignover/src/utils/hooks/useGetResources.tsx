import { useAccount, useContractReads } from "wagmi"
import { resourcesABI } from "../abis/Resources"
import { resourcesAddress } from "../constants"

export const useGetResources= (address: string) => {

    const { data, isLoading, isError, error, status } = useContractReads({
        contracts: [
            {
                addressOrName: resourcesAddress,
                contractInterface: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 0],
            },
            {
                addressOrName: resourcesAddress,
                contractInterface: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 1],
            },
            {
                addressOrName: resourcesAddress,
                contractInterface: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 2],
            },
            {
                addressOrName: resourcesAddress,
                contractInterface: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 3],
            },
            {
                addressOrName: resourcesAddress,
                contractInterface: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 4],
            },
        ],
        cacheTime: 30_000,
    })
    const resourceAmounts = data?.map(bn => Number(bn))

    return { resourceAmounts, isLoading, isError, error, status }
}
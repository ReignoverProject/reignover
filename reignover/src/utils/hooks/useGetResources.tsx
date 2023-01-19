import { useAccount, useContractRead, useContractReads } from "wagmi"
import { resourcesABI } from "../abis/Resources"
import { resourcesAddress } from "../constants"

export const useGetResources= (address: string) => {

    const { data, isLoading, isError, error, status } = useContractReads({
        contracts: [
            {
                address: resourcesAddress,
                abi: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 0],
            },
            {
                address: resourcesAddress,
                abi: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 1],
            },
            {
                address: resourcesAddress,
                abi: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 2],
            },
            {
                address: resourcesAddress,
                abi: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 3],
            },
            {
                address: resourcesAddress,
                abi: resourcesABI,
                functionName: 'balanceOf',
                args: [address, 4],
            },
        ],
        cacheTime: 30_000,
    })
    const resourceAmounts = data?.map(bn => Number(bn))

    return { resourceAmounts, isLoading, isError, error, status }
}

export const useGetApprovalSatus = (account: string, operator: string) => {
    const {data, isLoading, isError, error} = useContractRead({
        address: resourcesAddress,
        abi: resourcesABI,
        functionName: 'isApprovedForAll',
        args: [account, operator],
        cacheTime: 30_000_000,
    })

    const isBuilderApproved = data
    const approvalCheckLoading = isLoading

    return {isBuilderApproved, approvalCheckLoading}
}
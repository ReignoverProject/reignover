import { useAccount, useContractReads } from "wagmi"
import { resourcesABI } from "../utils/abis/Resources"
import { resourcesAddress } from "../utils/constants"


export const ResourcePanel: React.FC = () => {

    const { address, isConnected } = useAccount()
    const resourcesContract = {
        address: resourcesAddress,
        abi: resourcesABI
    }
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

    return (
        <div className="flex flex-col gap-2 p-2 border border-gray-100 rounded">
            <p className="font-semibold text-lg">Resources</p>
            <div>
                {data}
            </div>
        </div>
    )
}
import { useAccount, useContractReads } from "wagmi"
import { resourcesABI } from "../utils/abis/Resources"
import { resourcesAddress, resourceTokens } from "../utils/constants"
import { useGetResources } from "../utils/hooks/useGetResources"

interface IResourcePanel {
    address: string
}

export const ResourcePanel: React.FC<IResourcePanel> = ({address}) => {

    const { resourceAmounts, isLoading, isError, error, status } = useGetResources(address)
    //console.log(resourceAmounts);

    return (
        <div className="flex flex-col gap-2 p-2 border border-gray-100 rounded">
            <p className="font-semibold text-lg">Resources</p>
            {resourceTokens.map((token, i) => {
                return (
                    <div className="flex flex-row justify-between gap-2">
                        <p>
                            {token.symbol}:
                        </p>
                        <p>
                            {!isLoading && resourceAmounts !== undefined ? resourceAmounts[i] : isError ? 'error loading' : '...'}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}
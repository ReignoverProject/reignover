import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi"

export const useContractWriter = (contractAddress: string, abi: object[], functionSelector: string) => {
  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: abi,
    functionName: functionSelector,
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  
  return { data, isLoading, isSuccess, write }
}

export const useContractReader = (contractAddress: string, abi: object[], functionSelector: string, args: string[]) => {
  const { data, isError, isLoading } = useContractRead({
    address: contractAddress,
    abi: abi,
    functionName: functionSelector,
    args: args,
  })

  return { data, isError, isLoading }
}
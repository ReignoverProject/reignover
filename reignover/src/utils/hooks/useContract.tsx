import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi"

export const useContractWriter = (contractAddress: string, abi: object[], functionSelector: string) => {
  const { config } = usePrepareContractWrite({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: functionSelector,
  })
  const { data, isLoading, isSuccess, write } = useContractWrite(config)
  
  return { data, isLoading, isSuccess, write }
}

export const useContractReader = (contractAddress: string, abi: object[], functionSelector: string, args: string[]) => {
  const { data, isError, isLoading } = useContractRead({
    addressOrName: contractAddress,
    contractInterface: abi,
    functionName: functionSelector,
    args: args,
  })

  return { data, isError, isLoading }
}
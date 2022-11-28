import React, { useState } from "react";
import { useContractRead } from "wagmi";
import { volumeABI } from "../utils/abis/VolumeNFTManager";
import { VolumeNFTAddress } from "../utils/constants";
import type { AbiInput } from "../utils/types/abi";

interface IDynamicForm {
  inputs: AbiInput[];
  name: string;
  submitFn: "view" | "write";
  buttonName: string;
}

export const Dynamicform: React.FC<IDynamicForm> = ({ inputs, name, submitFn, buttonName }) => {
  const inputstate = inputs.reduce((acc, cur) => ({ ...acc, [cur.name]: "" }), {})
  const [inputFields, setInputFields] = useState<Record<string, string>>(inputstate)
  const [args, setArgs] = useState<string[]>()
  const { data, isLoading, isRefetching, isSuccess, refetch, isError, error } = useContractRead({
      addressOrName: VolumeNFTAddress,
      contractInterface: volumeABI,
      functionName: name,
      args: args
  })

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    refetch()
  }

  const handleFormChange = (index: string, value: string) => {
    const newInputs = { ...inputFields }
    newInputs[index] = value
    setInputFields(newInputs)
    const newArgs = Object.values(newInputs)
    setArgs(newArgs)
  }

  return (
    <form onSubmit={submit}>
      <div className="flex flex-col gap-1">
        {inputs.map((i, key) => (
          <input
            className="text-gray-700"
            name={i.name}
            key={key}
            placeholder={i.name}
            value={inputFields[key]}
            onChange={event => handleFormChange(i.name, event.target.value)} />
        ))}
      </div>
      <button onClick={submit}>{buttonName}</button>
      <p>{isSuccess && data?.toString()}{isError && "Invalid Args"}</p>
    </form>
  )
}
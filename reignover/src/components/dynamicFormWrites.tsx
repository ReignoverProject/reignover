import React, { useState } from "react";
import { useContractRead, useContractWrite, usePrepareContractWrite } from "wagmi";
import type { AbiInput, AbiItem } from "../utils/types/abi";

interface IDynamicForm {
  inputs: AbiInput[];
  name: string;
  buttonName: string;
  contractAddress: `0x${string}`;
  ABI: AbiItem[] | any;
}

export const Dynamicform: React.FC<IDynamicForm> = ({ inputs, name,  buttonName, contractAddress, ABI }) => {
  const inputstate = inputs.reduce((acc, cur) => ({ ...acc, [cur.name]: "" }), {})
  const [inputFields, setInputFields] = useState<Record<string, string>>(inputstate)
  const [args, setArgs] = useState<string[]>()
  const { config } = usePrepareContractWrite({
      address: contractAddress,
      abi: ABI,
      functionName: name,
      args: args,
  })
  const { data, isLoading, isSuccess, write, isError } = useContractWrite(config)

  const submit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    write?.()
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
      <div className="flex flex-col gap-1 py-1">
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
      <button disabled={!write || isLoading} onClick={(submit)}>{buttonName}</button>
      <p>{isSuccess && data?.toString()}{isError && "Invalid Args"}</p>
    </form>
  )
}
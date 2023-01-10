import { useRef } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { kingdomsABI } from "../utils/abis/Kingdoms"
import { kingdomAddress } from "../utils/constants"

export const CreateCity: React.FC = () => {
    const cityNameRef = useRef<HTMLInputElement>(null)
    const name = cityNameRef.current !== null ? cityNameRef.current!.value : ''
    console.log(cityNameRef.current)
    const { config } = usePrepareContractWrite({
        addressOrName: kingdomAddress,
        contractInterface: kingdomsABI,
        functionName: 'buildCity',
        args: [name],
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite(config)

    const handleCreate = () => {
        console.log(name)
        //write?.()
    }

    return (
        <div className="flex flex-col gap-2">
            <p>Create a city to start your journey in Reignover!</p>
            <div className="flex flex-row gap-2">
                <input type='text' ref={cityNameRef} placeholder='City Name' />
                <button onClick={handleCreate} disabled={cityNameRef.current.value === '' || isLoading} >Create</button>
            </div>
        </div>
    )
}
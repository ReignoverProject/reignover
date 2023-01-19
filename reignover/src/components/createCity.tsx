import { useRouter } from "next/router"
import { useRef, useState } from "react"
import { useContractWrite, usePrepareContractWrite } from "wagmi"
import { kingdomsABI } from "../utils/abis/Kingdoms"
import { kingdomAddress } from "../utils/constants"

interface ICreateCity {
    setHasCity: (hasCity: boolean) => void
}

export const CreateCity: React.FC = () => {
    const router = useRouter()
    const [args, setArgs] = useState<string[]>()
    const { config } = usePrepareContractWrite({
        address: kingdomAddress,
        abi: kingdomsABI,
        functionName: 'buildCity',
        args: args,
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite({...config})

    const handleCreate = () => {
        //console.log(name)
        write?.()
    }

    const handleChange = (value: string) => {
        const newArgs = [];
        newArgs.push(value)
        setArgs(newArgs)
    }

    return (
        <div className="flex flex-col gap-2">
            <p>Create a city to start your journey in Reignover!</p>
            <div className="flex flex-row gap-2">
                <input type='text'  
                    placeholder='City Name'
                    onChange={event => handleChange(event.target.value)}
                />
                <button onClick={handleCreate} disabled={args === undefined || isLoading} >Create</button>
            </div>
        </div>
    )
}
import { useState } from "react"
import {XCircleIcon} from "@heroicons/react/24/solid"

interface IModal {
    children: React.ReactNode
    setShowModal: (showModal: boolean) => void
}

export const Modal: React.FC<IModal> = ({children, setShowModal}) => {

    return (
        <div className="w-[99.4%] h-[92.4%] bg-zinc-900 bg-opacity-40 absolute overflow-hidden">
            <div className="flex flex-col gap-2 w-fit h-fit max-w-[95%] border rounded border-gray-200 m-auto p-2 bg-zinc-700 text-center shadow-lg
                justify-center items-center  overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="flex justify-end w-full -mb-7">
                    <XCircleIcon className="h-5 w-5 cursor-pointer" onClick={() => setShowModal(false)} />
                </div>
                <div>
                    {children}
                </div>
            </div>
        </div>
    )
}
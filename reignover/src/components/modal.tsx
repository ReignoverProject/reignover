import { useState } from "react"

interface IModal {
    children: React.ReactNode
    isOpen: boolean
}

export const Modal: React.FC<IModal> = ({children, isOpen = false}) => {
    const [open, setOpen] = useState(isOpen)


    return (
        <div>
            {children}
        </div>
    )
}
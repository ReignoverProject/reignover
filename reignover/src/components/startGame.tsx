import Link from "next/link"

export const StartGame: React.FC = () => {

    return (
        <div>
            <Link href='/kingdom' className=""><button >Enter Game</button></Link>
        </div>
    )
}
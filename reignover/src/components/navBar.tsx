import { ConnectKitButton } from "connectkit"
import Link from "next/link"

export const NavBar: React.FC = () => {

    return (
        <div className="flex flex-row justify-between mb-2 border-b items-center pb-2">
            <div>
                <Link href='/'>
                    <p className="text-2xl font-semibold">REIGNOVER</p>
                </Link>
            </div>
            <div className=""><ConnectKitButton /></div>
        </div>

    )
}
import { ConnectKitButton } from "connectkit"
import Link from "next/link"
import { reignoverSmall } from "../utils/ascii/reignoverLogo"

export const NavBar: React.FC = () => {

    return (
        <div className="flex flex-row justify-between mb-2 border-b items-center pb-2">
            <div className="flex flex-col">
                <Link href='/'>
                    {reignoverSmall.map((line, i) => {
                        return (
                            <pre key={i} className="text-sm leading-none">{line}</pre>
                        )
                    })}
                </Link>
            </div>
            <div className="flex flex-row gap-4">
                <Link href='/admin'><p>Admin</p></Link>
                <Link href='/kingdom'><p>Kingdom</p></Link>
            </div>
            <div className=""><ConnectKitButton /></div>
        </div>

    )
}
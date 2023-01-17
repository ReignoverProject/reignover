import useRefresh from "../utils/useRefresh"

interface ITest {
    fast: number
    slow: number
}

export const TestStuff:React.FC = () => {
    const {fastRefresh, slowRefresh} = useRefresh()

    return (
        <div className="flex flex-col gap-2">
            <div>fast1: {fastRefresh}</div>
            <div>slow1: {slowRefresh}</div>
        </div>
    )
}
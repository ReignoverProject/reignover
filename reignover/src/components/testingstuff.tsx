import { useAccount } from "wagmi"
import { useCheckBuildingResourceRequirements, useGetAllBuildingRequirements, useGetBuildingsList, useGetOwnerCityId } from "../utils/hooks/useGetBuildings"
import useRefresh from "../utils/useRefresh"

interface ITest {
    fast: number
    slow: number
}

export const TestStuff:React.FC = () => {
    const { address } = useAccount()
    const buildingList = useGetBuildingsList()
    const {data, refetch} = useGetOwnerCityId(address!)
    const levels = [0,0,0,0,0]
    const requirements = useCheckBuildingResourceRequirements(levels, 0)

    //console.log('resources required', requirements.data.map(Number))

    return (
        <div className="flex flex-col gap-2">
        </div>
    )
}
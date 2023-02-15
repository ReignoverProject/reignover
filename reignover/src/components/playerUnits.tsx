import { unitsAddress } from "../utils/constants"
import { useContractEvent } from "wagmi"
import { useGetCityUnits } from "../utils/hooks/usetGetUnits"
import { unitManagerABI } from "../utils/abis/UnitManager"
import { UnitDetails } from "./unitDetails"

interface IPlayerUnits {
    cityId: number
    account: Address
}


export const PlayerUnits: React.FC<IPlayerUnits> = ({cityId, account}) => {
    const units = useGetCityUnits(cityId)

    const myCityId = cityId

    // check events for completing new buildings -> refetch
    useContractEvent({
        address: unitsAddress,
        abi: unitManagerABI,
        eventName: 'CompleteRecruitment',
        listener(cityId, unitId, amount) {
            if(Number(cityId) === myCityId) {
                units.refetch()
                console.log("You have recruited ", Number(amount), "of unit ", Number(unitId))
            }
        }
    })


    if (units.unitList === undefined || units.unitList === null || units.isLoading) return <>loading...</>
    return (
        <div className="w-full px-4 flex flex-row gap-2">
            <UnitDetails account={account} unitList={units.unitList.map(Number)} cityId={cityId} />
        </div>
    )
}
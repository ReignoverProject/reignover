import { usePrepareContractWrite, useContractWrite } from "wagmi"
import { unitManagerABI } from "../utils/abis/UnitManager"
import { unitsAddress } from "../utils/constants"

interface IStartRecruitment {
    cityId: number
    unitId: number
    quantity: number
}

interface ICompleteRecruitment {
    cityId: number
    unitId: number
}

export const StartUnitRecruitment: React.FC<IStartRecruitment> = ({cityId, unitId, quantity}) => {

    const prepUnitBuild = usePrepareContractWrite({
        address: unitsAddress,
        abi: unitManagerABI,
        functionName: 'startRecruitment',
        args: [cityId, unitId, quantity],
        enabled: false,
    })
    const buildUnitsStart = useContractWrite(prepUnitBuild.config)

    const handleUnitBuildStart = async () => {
        await prepUnitBuild.refetch()
        if (prepUnitBuild.isSuccess) {
            buildUnitsStart.write?.()
        } else {
            console.error('Cannot prepare contract', 'id:', unitId, 'amount:', quantity, prepUnitBuild.error)
        }
    }
    
    return (
        <button onClick={() => handleUnitBuildStart()}>Build</button>
    )
}

export const CompleteUnitRecruitment: React.FC<ICompleteRecruitment> = ({cityId, unitId}) => {

    const prepUnitBuild = usePrepareContractWrite({
        address: unitsAddress,
        abi: unitManagerABI,
        functionName: 'completeRecruitment',
        args: [cityId, unitId],
        enabled: false,
    })
    const buildUnitsStart = useContractWrite(prepUnitBuild.config)

    const handleUnitBuildStart = async () => {
        await prepUnitBuild.refetch()
        if (prepUnitBuild.isSuccess) {
            buildUnitsStart.write?.()
        } else {
            console.error('Cannot prepare contract', 'id:', unitId, prepUnitBuild.error)
        }
    }
    return (
        <button onClick={() => handleUnitBuildStart()}>Complete</button>
    )
}
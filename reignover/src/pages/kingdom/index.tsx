import { NextPage } from "next";
import { useAccount } from "wagmi";
import { CreateCity } from "../../components/createCity";
import { PlayerBuildings } from "../../components/playerBuildings";
import { ResourcePanel } from "../../components/resourcePanel";
import { useGetOwnerCityId } from "../../utils/hooks/useGetBuildings";

const Kingdom: NextPage = () => {
    const { address } = useAccount();
    const id = useGetOwnerCityId(address!)

    return (
        <div className="flex flex-row w-full gap-2">
            <ResourcePanel address={address!} />
            <div className="flex justify-center  w-full p-2 border rounded border-gray-200">
                {id === undefined 
                    ? <CreateCity /> 
                    : <PlayerBuildings address={address!} cityId={id} />
                }
            </div>
        </div>
    )
}

export default Kingdom
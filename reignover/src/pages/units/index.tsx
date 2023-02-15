import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import ClientOnly from "../../components/clientOnly";
import { ConnectWalletMsg } from "../../components/connectWalletMsg";
import { CreateCity } from "../../components/createCity";
import { Modal } from "../../components/modal";
import { PlayerBuildings } from "../../components/playerBuildings";
import { PlayerUnits } from "../../components/playerUnits";
import { ResourcePanel } from "../../components/resourcePanel";
import { builderABI } from "../../utils/abis/Builder";
import { resourcesABI } from "../../utils/abis/Resources";
import { builderAddress, resourcesAddress, unitsAddress } from "../../utils/constants";
import { useGetOwnerCityId } from "../../utils/hooks/useGetBuildings";
import { useGetApprovalSatus } from "../../utils/hooks/useGetResources";

const Units: NextPage = () => {
    const { address } = useAccount();
    const router = useRouter()
    const cityId = useGetOwnerCityId(address!)
    const id = Number(cityId.id)
    const [hasCity, setHasCity] = useState(cityId.id !== undefined && cityId.id.length > 0)
    // console.log('has a city?', hasCity, cityId.data)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const unitApproval = useGetApprovalSatus(address!, unitsAddress)
    // console.log('unit approval:', unitApproval.data)
    const { config } = usePrepareContractWrite({
        address: resourcesAddress,
        abi: resourcesABI,
        functionName: 'setApprovalForAll',
        args: [unitsAddress, true],
    })
    const approveUnits = useContractWrite({...config, onSuccess(){setShowApprovalModal(false);console.log('Yay, recruiters can hire troops!')}})

    const handleApprove = () => {
        approveUnits.write?.()
    }
    useEffect(() => {
        !unitApproval.isLoading && unitApproval.data == false && setShowApprovalModal(true)
        unitApproval.data && setShowApprovalModal(false)
    }, [unitApproval.data])

    useEffect(() => {
        !hasCity && router.push('/kingdom')
    })


    return (<>
        <div className="flex flex-row w-full gap-2">
            <ClientOnly>
                {address === undefined ? <ConnectWalletMsg />
                : <>
                    <ResourcePanel address={address!} cityId={id} />
                    <div className="flex justify-center  w-full p-2 border rounded border-gray-200">
                        <PlayerUnits account={address!} cityId={id} />
                    </div>
                    {showApprovalModal &&
                        <Modal setShowModal={setShowApprovalModal}>
                            <p className="text-lg font-bold ">
                                Welcome to troop recruitment!
                            </p>
                            <p className="mb-4 max-w-lg">
                                The first step to hiring troops is to approve your recruiters to spend resources, otherwise they cannot hire anyone!
                            </p>
                            <button onClick={handleApprove} disabled={approveUnits.isLoading}>Approve Recruiters</button>
                        </Modal>
                    }
                </>
                }
            </ClientOnly>
        </div>
        </>
    )
}

export default Units
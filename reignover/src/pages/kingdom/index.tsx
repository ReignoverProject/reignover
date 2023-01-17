import { NextPage } from "next";
import { useEffect, useState } from "react";
import { useAccount, useContractWrite, usePrepareContractWrite } from "wagmi";
import ClientOnly from "../../components/clientOnly";
import { ConnectWalletMsg } from "../../components/connectWalletMsg";
import { CreateCity } from "../../components/createCity";
import { Modal } from "../../components/modal";
import { PlayerBuildings } from "../../components/playerBuildings";
import { ResourcePanel } from "../../components/resourcePanel";
import { builderABI } from "../../utils/abis/Builder";
import { resourcesABI } from "../../utils/abis/Resources";
import { builderAddress, resourcesAddress } from "../../utils/constants";
import { useGetOwnerCityId } from "../../utils/hooks/useGetBuildings";
import { useGetApprovalSatus } from "../../utils/hooks/useGetResources";

const Kingdom: NextPage = () => {
    const { address } = useAccount();
    
    const id = useGetOwnerCityId(address!)
    const [showModal, setShowModal] = useState(false)
    const [hasCity, setHasCity] = useState(id !== undefined)
    const {isBuilderApproved, approvalCheckLoading} = useGetApprovalSatus(address!, builderAddress)
    const { config } = usePrepareContractWrite({
        addressOrName: resourcesAddress,
        contractInterface: resourcesABI,
        functionName: 'setApprovalForAll',
        args: [builderAddress, true],
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite({...config, onSuccess(){setShowModal(false)}})

    const handleApprove = () => {
        write?.()
    }
    useEffect(() => {
        !approvalCheckLoading && !isBuilderApproved && setShowModal(true)
    }, [isBuilderApproved])


    return (<>
        <div className="flex flex-row w-full gap-2">
            <ClientOnly>
                {address === undefined ? <ConnectWalletMsg />
                : <>
                    <ResourcePanel address={address!} />
                    <div className="flex justify-center  w-full p-2 border rounded border-gray-200">
                        {!hasCity 
                            ? <CreateCity setHasCity={setHasCity} /> 
                            : <PlayerBuildings account={address!} cityId={id!} />
                        }
                    </div>
                    {showModal &&
                        <Modal setShowModal={setShowModal}>
                            <p className="text-lg font-bold ">
                                Welcome to Reignover!
                            </p>
                            <p className="mb-4 max-w-lg">
                                The first step to building your city is to make sure your workers are getting paid, otherwise they will not build anything!
                            </p>
                            <button onClick={handleApprove} disabled={isLoading}>Approve Builders</button>
                        </Modal>
                    }
                </>
                }
            </ClientOnly>
        </div>
        </>
    )
}

export default Kingdom
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
    
    const cityId = useGetOwnerCityId(address!)
    const id = Number(cityId.id)
    const [hasCity, setHasCity] = useState(cityId.id !== undefined && cityId.id.length > 0)
    // console.log('has a city?', hasCity, Number(cityId.id))
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const builderApproval = useGetApprovalSatus(address!, builderAddress)
    //console.log('builder approval:', builderApproval.data)
    const { config } = usePrepareContractWrite({
        address: resourcesAddress,
        abi: resourcesABI,
        functionName: 'setApprovalForAll',
        args: [builderAddress, true],
    })
    const { data, isLoading, isSuccess, write, isError } = useContractWrite({...config, onSuccess(){setShowApprovalModal(false);console.log('Yay, builders can work!')}})

    const handleApprove = () => {
        write?.()
    }
    useEffect(() => {
        !builderApproval.isLoading && builderApproval.data == false && setShowApprovalModal(true)
        builderApproval.data && setShowApprovalModal(false)
    }, [builderApproval.data])


    return (<>
        <div className="flex flex-row w-full gap-2">
            <ClientOnly>
                {address === undefined ? <ConnectWalletMsg />
                : <>
                    {hasCity && <ResourcePanel address={address!} cityId={id} />}
                    <div className="flex justify-center  w-full p-2 border rounded border-gray-200">
                        {!hasCity 
                            ? <CreateCity setHasCity={setHasCity} /> 
                            : <PlayerBuildings account={address!} cityId={id} />
                        }
                    </div>
                    {showApprovalModal &&
                        <Modal setShowModal={setShowApprovalModal}>
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
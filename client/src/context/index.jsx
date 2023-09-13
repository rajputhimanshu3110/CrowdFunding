import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";
import { ethers } from "ethers";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract, isLoading, error } = useContract(
    "0x79458796f2238a3BdD5Fb866A5154046721497eF"
  );
  const { mutateAsync: createCampaign } = useContractWrite(
    contract,
    "createCampaign"
  );
  const connectWithMetamask = useMetamask();
  const address = useAddress();
  
  const publishCampaign = async (form) => {
    try {
      const data = await createCampaign({args:[
        address,
        form.title,
        form.description,
        form.target,
        new Date(form.deadline).getTime(),
        form.image,
      ]});
      console.log("Contracty call success",data);
    } catch (error) {
      console.log("contact fail", error);
    }
  };

  const getCampaigns = async ()=>{
    const campaigns = await contract.call('getDonators');
    
     const parsedCampaings = campaigns.map((campaign, i) => ({
       owner: campaign.owner,
       title: campaign.title,
       description: campaign.description,
       deadline: campaign.deadline.toNumber(),
       amountCollected: ethers.utils.formatEther(
         campaign.amountCollected.toString()
       ),
       target: ethers.utils.formatEther(
         campaign.goalAmount.toString()
       ),
       image: campaign.image,
       pId:i
     }));
     return parsedCampaings;
  }

  const getUserCampaigns = async()=>{
    const campaigns = await contract.call("getDonators");
    const filteredCampaign = campaigns.filter((campaign)=>campaign.owner===address);

    const parsedCampaings = filteredCampaign.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(
        campaign.amountCollected.toString()
      ),
      target: ethers.utils.formatEther(campaign.goalAmount.toString()),
      image: campaign.image,
      pId: i,
    }));
    return parsedCampaings;
  }

  const donate = async(pId,amount) =>{
    const data = await contract.call('donateToCampaign',[pId],{value:ethers.utils.parseEther(amount)})
  }

   const getDonations = async (pId) => {
     const donations = await contract.call("getCampaign", [pId]);
     const numberOfDonations = donations[0].length;

     const parsedDonations = [];

     for (let i = 0; i < numberOfDonations; i++) {
       parsedDonations.push({
         donator: donations[0][i],
         donation: ethers.utils.formatEther(donations[1][i].toString()),
       });
     }

     return parsedDonations;
   };
  
 

  return (
    <StateContext.Provider
      value={{ address,donate,getDonations, contract,getCampaigns,getUserCampaigns ,connectWithMetamask, createCampaign: publishCampaign }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

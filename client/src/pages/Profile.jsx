import React, { useState, useEffect } from "react";
import { useStateContext } from "../context";
import { DisplayCampaign } from "../components";
const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [Campaigns, setCampaigns] = useState([]);
  const { address, contract, getUserCampaigns } = useStateContext();

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  if(address){
  return (
   <DisplayCampaign
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={Campaigns}
    />
  );
  }else{
    return(<div className="flex text-white font-semibold">Please Connect to Metamask</div>)
  }
  
};

export default Profile;

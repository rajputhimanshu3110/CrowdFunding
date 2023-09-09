import React, { useContext, createContext } from "react";
import {
  useAddress,
  useContract,
  useMetamask,
  useContractWrite,
} from "@thirdweb-dev/react";

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract } = useContract('0xd695968e66b211cE483D700F25C017Dc6b91D09F')
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
      console.log("Contracty call success");
    } catch (error) {
      console.log("contact fail", error);
    }
  };
  return (
    <StateContext.Provider
      value={{ address, contract, connectWithMetamask, createCampaign: publishCampaign }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);

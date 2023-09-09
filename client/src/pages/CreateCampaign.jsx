import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import { createCampaign, money } from "../assets";
import { CustomButton, FormField } from "../components";
import { checkIfImage } from "../utils";

const CreateCampaign = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    title: "",
    description: "",
    target: "",
    deadline: "",
    image: "",
  });
  const handleFormFieldChange = (fieldname, e) => {
    setForm({ ...form, [fieldname]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    checkIfImage(form.image, async (exists) => {
      if (exists) {
        setIsLoading(true);
        await createCampaign({
          ...form,
          target: ethers.utils.parseUnits(form, target, 18),
        });
        setIsLoading(false);
        navigate("/");
      } else {
        alert("Provide valid image URL");
        setForm({ ...form, image: "" });
      }
    });
  };

  return (
    <div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
      {isLoading && "Loader.."}
      <div className="flex justify-center items-center p-[16px] sm:min-w-[300px] bg-[#3a3a43] rounded-[10px]">
        <h1 className="font epilogue font-bold sm:text-[25px] leading-[30px] text-white">
          Start a Campaign
        </h1>
      </div>
      <form
        className="w-full mt-[65px] flex flex-col gap-[40px]"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Your Name*"
            placeholder="Shree Ram"
            inputTYpe="text"
            value={form.name}
            handleChange={(e) => handleFormFieldChange("name", e)}
          />
          <FormField
            LabelName="Campaign Title*"
            placeholder="Feeding Child"
            inputTYpe="text"
            value={form.title}
            handleChange={(e) => handleFormFieldChange("title", e)}
          />
        </div>
        <FormField
          LabelName="Story"
          placeholder="Write your Story"
          isTextArea
          value={form.description}
          handleChange={(e) => handleFormFieldChange("description", e)}
        />
        <div className="w-full flex justify-center items-center p-4 bg-[#8c6dfd] h-[120px] rounded-[10px]">
          <img drc={money} className="h-[40px] w-[40px] object-contain" />
          <h4 className="font-epilogue font-bold text-[25px] ml-[20px] text-white">
            You Will get 100% of the raised amount
          </h4>
        </div>
        <div className="flex flex-wrap gap-[40px]">
          <FormField
            LabelName="Goal*"
            placeholder="ETH 1.2"
            inputTYpe="text"
            value={form.target}
            handleChange={(e) => handleFormFieldChange("target", e)}
          />
          <FormField
            LabelName="End date*"
            placeholder="End Date"
            inputTYpe="date"
            value={form.deadline}
            handleChange={(e) => handleFormFieldChange("deadline", e)}
          />
        </div>
        <FormField
          LabelName="Campaign Url*"
          placeholder="Place url of your image"
          inputTYpe="url"
          value={form.image}
          handleChange={(e) => handleFormFieldChange("image", e)}
        />
        <div className="flex jsutify-center items-center mt-[40px]">
          <CustomButton
            btnType="submit"
            title="Submit new Campaign"
            styles="bg-[#1dc071]"
          />
        </div>
      </form>
    </div>
  );
};

export default CreateCampaign;

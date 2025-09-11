import { useEffect, useState } from "react";
import { Input } from "./ui/input";

const OpenAICredentials = ({onDataChange}: {onDataChange: (state : {} )=>void }) => {
    const [apikey,setApiKey] = useState("");

    useEffect(()=>{
        onDataChange({apikey})
    },[apikey,onDataChange])
  return (
    <div className="font-inter flex flex-col gap-2 mb-5">
      <div className="text-center">
        Sign Up at{" "}
        <a href="https://platform.openai.com/docs/overview"  target="_blank" className="underline text-black dark:text-white">
          OpenAI Platform
        </a>{" "}
        and Provide the API key for it!
      </div>{" "}
      <label className="text-black dark:text-orange-500 font-bold font-kode">OpenAI API Key<span className="text-red-600">*</span></label>
      <Input placeholder="sk-aYnrdyuotm..." required onChange={(e)=>setApiKey(e.target.value)}/>
    </div>
  );
};

export default OpenAICredentials;

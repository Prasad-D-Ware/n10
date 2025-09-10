
import { useEffect, useState } from 'react'
import { Input } from './ui/input'

const WpCredentials =({onDataChange}: {onDataChange: (state : {} )=>void }) => {
    const [accessToken,setAccessToken] = useState("");
    const [businessAccountId,setBusinessAccountId] = useState("");


    useEffect(()=>{
      onDataChange({accessToken,businessAccountId})
  },[accessToken,businessAccountId,onDataChange])

  return (
    <div className="font-inter flex flex-col gap-2 mb-5">
      <div className="text-center">
          Sign Up at{" "}
          <a href="https://business.facebook.com/business/loginpage/?next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fwhatsapp%2Fpricing%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc&app=436761779744620&login_options[0]=FB&login_options[1]=SSO&is_work_accounts=1&config_ref=biz_login_tool_flavor_dfc"  target="_blank" className="underline text-green-400">
            Meta Developers
          </a>{" "}
          and Provide the Access Token and Business Account Id for it!
      </div>{" "}
    <label className="text-black font-bold font-kode">Access Token<span className="text-red-600">*</span></label>
    <Input placeholder="Access Token" required onChange={(e)=>setAccessToken(e.target.value)}/>
    <label className="text-black font-bold font-kode">Business Account ID<span className="text-red-600">*</span></label>
    <Input placeholder="Business Account ID" required onChange={(e)=>setBusinessAccountId(e.target.value)}/>
  </div>
  )
}

export default WpCredentials
import { Input } from './ui/input'
import { useState ,useEffect } from 'react'

const SolanaCredential = ({onDataChange}: {onDataChange: (state : {} )=>void }) => {
  const [privateKey,setPrivateKey] = useState("");

  useEffect(()=>{
    onDataChange({privateKey})
  },[privateKey,onDataChange])

  return (
    <div>
      <div className="font-inter flex flex-col gap-2 mb-5">
        <div className="text-center">
          Create a new wallet and provide the Private Key for it!
        </div>
        <label className="text-black font-bold font-kode dark:text-orange-500">Private Key<span className="text-red-600">*</span></label>
        <Input placeholder="Private Key" required onChange={(e)=>setPrivateKey(e.target.value)}/>
      </div>
    </div>
  )
}

export default SolanaCredential

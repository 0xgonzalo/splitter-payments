"use client"

import { useState } from "react"
import {
  CreatorWallet,
  Recipients,
  CreatorPercentageSettings,
  MilestoneSettings,
  AdditionalInfo,
  SubmitButton,
  type Recipient
} from "./DynamicForm/index"

export default function DynamicForm() {
  const [creatorWallet, setCreatorWallet] = useState("")
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", percentage: "0.00" },
    { address: "", percentage: "0.00" },
  ])
  const [creatorInitialPercentage, setCreatorInitialPercentage] = useState("30.00")
  const [maxCreatorPercentage, setMaxCreatorPercentage] = useState("70.00")
  const [percentageIncrease, setPercentageIncrease] = useState("5.00")
  const [milestoneEth, setMilestoneEth] = useState("")
  const [pricePerMint, setPricePerMint] = useState("")
  const [splitName, setSplitName] = useState("")
  const [description, setDescription] = useState("")

  return (
    <div className="bg-white/10 shadow-2xl rounded-3xl p-10 backdrop-blur-lg border border-white/20">
      <CreatorWallet
        creatorWallet={creatorWallet}
        setCreatorWallet={setCreatorWallet}
      />
      
      <Recipients
        recipients={recipients}
        setRecipients={setRecipients}
      />
      
      <CreatorPercentageSettings
        creatorInitialPercentage={creatorInitialPercentage}
        setCreatorInitialPercentage={setCreatorInitialPercentage}
        maxCreatorPercentage={maxCreatorPercentage}
        setMaxCreatorPercentage={setMaxCreatorPercentage}
        percentageIncrease={percentageIncrease}
        setPercentageIncrease={setPercentageIncrease}
      />
      
      <MilestoneSettings
        milestoneEth={milestoneEth}
        setMilestoneEth={setMilestoneEth}
        pricePerMint={pricePerMint}
        setPricePerMint={setPricePerMint}
      />
      
      <AdditionalInfo
        splitName={splitName}
        setSplitName={setSplitName}
        description={description}
        setDescription={setDescription}
      />
      
      <SubmitButton />
    </div>
  )
} 
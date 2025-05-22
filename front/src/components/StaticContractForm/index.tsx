"use client"

import { useState } from "react"
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi"
// Import ABI
import SplitterStaticFactoryJSON from "../../../abi/SplitterStaticFactory.json"
// Import Components
import RecipientsList from "./RecipientsList"
import ControllerInput from "./ControllerInput"
import BountySettings from "./BountySettings"
import MonitoringSettings from "./MonitoringSettings"
import AdditionalInfo from "./AdditionalInfo"
import TransactionStatus from "./TransactionStatus"
import SubmitButton from "./SubmitButton"

// Extract the ABI array from the imported JSON
const SplitterStaticFactoryABI = SplitterStaticFactoryJSON.abi

interface Recipient {
  address: string
  percentage: string
}

export default function StaticContractForm() {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", percentage: "0.00" },
    { address: "", percentage: "0.00" },
  ])
  const [controller, setController] = useState("")
  const [bounty, setBounty] = useState("0.05")
  const [monitoring, setMonitoring] = useState("1")
  const [contractName, setContractName] = useState("")
  const [description, setDescription] = useState("")
  const [txError, setTxError] = useState<string | null>(null)

  // Get user's account
  const { address } = useAccount()

  // Factory contract address - replace with your actual deployed contract address
  const factoryAddress = "0xa38e93caaec44b8d9d9cfaa902ec6b4782b0e3e1" 

  // Set up the write contract hook
  const { data: hash, isPending, error, writeContract } = useWriteContract()
  
  // Track transaction status
  const { isLoading: isConfirming, isSuccess: isConfirmed } = 
    useWaitForTransactionReceipt({ 
      hash 
    })

  const calculateTotalPercentage = () => {
    return recipients.reduce((sum, recipient) => sum + parseFloat(recipient.percentage || "0"), 0)
  }

  const handleSubmit = () => {
    setTxError(null)
    
    // Check if wallet is connected
    if (!address) {
      setTxError("Please connect your wallet first")
      return
    }
    
    // Basic validation
    if (recipients.some(r => !r.address || r.percentage === "0.00")) {
      setTxError("All recipients must have an address and non-zero percentage")
      return
    }
    
    // Calculate total percentage to ensure it's 100%
    const totalPercentage = calculateTotalPercentage()
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      setTxError(`Total percentage must be 100%. Current total: ${totalPercentage.toFixed(2)}%`)
      return
    }

    // Format the data for the contract
    const addresses = recipients.map(r => r.address)
    
    // Convert percentages to basis points (100% = 10000)
    const percentages = recipients.map(r => 
      Math.round(parseFloat(r.percentage) * 100)
    )
    
    // Whether the contract is permanent or not (permanent if no controller is set)
    const isPermanent = controller === ""
    
    try {
      writeContract({
        address: factoryAddress,
        abi: SplitterStaticFactoryABI,
        functionName: 'createStaticSplitter',
        args: [
          address, // _creator - use connected wallet address
          contractName || "Split Contract", // _name
          "SPLIT", // _symbol - default token symbol
          "", // _baseURI - empty string for now
          0, // _pricePerMint - set to 0 for now
          Math.round(parseFloat(monitoring) * 100), // _percentageToSplit - use monitoring percentage
          isPermanent, // setToPermanent - true if no controller
          addresses, // _membersAddressesForSubSplit
          percentages, // _membersPercentagesForSubSplit
        ]
      })
    } catch (e) {
      console.error(e)
      setTxError("Failed to submit transaction. Please check your inputs and try again.")
    }
  }

  return (
    <div className="bg-white/10 shadow-2xl rounded-3xl p-10 backdrop-blur-lg border border-white/20">
      <RecipientsList 
        recipients={recipients} 
        setRecipients={setRecipients} 
        calculateTotalPercentage={calculateTotalPercentage} 
      />

      <ControllerInput 
        controller={controller} 
        setController={setController} 
      />

      <BountySettings 
        bounty={bounty} 
        setBounty={setBounty} 
      />

      <MonitoringSettings 
        monitoring={monitoring} 
        setMonitoring={setMonitoring} 
      />

      <AdditionalInfo 
        contractName={contractName} 
        setContractName={setContractName} 
        description={description} 
        setDescription={setDescription} 
      />

      <TransactionStatus 
        txError={txError} 
        error={error} 
        isConfirmed={isConfirmed} 
        hash={hash} 
      />

      <SubmitButton 
        handleSubmit={handleSubmit} 
        isPending={isPending} 
        isConfirming={isConfirming} 
      />
    </div>
  )
} 
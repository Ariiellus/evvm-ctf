'use client'
import { useState, useMemo } from 'react'
import { switchChain, getAccount, getChainId, readContract } from '@wagmi/core'
import { config, networks } from '@/config/index'
import { EvvmABI } from '@evvm/viem-signature-library'
import { isAddress } from 'viem'
import { FaucetFunctionsComponent } from './FaucetFunctions/FaucetFunctionsComponent'
import { PaySignaturesComponent } from './PaymentFunctions/PaySignaturesComponent'
import { DispersePayComponent } from './PaymentFunctions/DispersePayComponent'
import { GoldenStakingComponent } from './StakingFunctions/GoldenStakingComponent'
import { PresaleStakingComponent } from './StakingFunctions/PresaleStakingComponent'
import { PublicStakingComponent } from './StakingFunctions/PublicStakingComponent'
import { PreRegistrationUsernameComponent } from './NameServiceFunctions/PreRegistrationUsernameComponent'
import { RegistrationUsernameComponent } from './NameServiceFunctions/RegistrationUsernameComponent'
import { EmailRegistrationComponent } from './NameServiceFunctions/EmailRegistrationComponent'
import { PhoneRegistrationComponent } from './NameServiceFunctions/PhoneRegistrationComponent'
import { MakeOfferComponent } from './NameServiceFunctions/MakeOfferComponent'
import { WithdrawOfferComponent } from './NameServiceFunctions/WithdrawOfferComponent'
import { AcceptOfferComponent } from './NameServiceFunctions/AcceptOfferComponent'
import { RenewUsernameComponent } from './NameServiceFunctions/RenewUsernameComponent'
import { AddCustomMetadataComponent } from './NameServiceFunctions/AddCustomMetadataComponent'
import { RemoveCustomMetadataComponent } from './NameServiceFunctions/RemoveCustomMetadataComponent'
import { FlushCustomMetadataComponent } from './NameServiceFunctions/FlushCustomMetadataComponent'
import { FlushUsernameComponent } from './NameServiceFunctions/FlushUsernameComponent'
import { FaucetBalanceChecker } from './FaucetFunctions/FaucetBalanceChecker'
import { MakeOrderComponent } from './P2PSwap/MakeOrderComponent'
import { CancelOrderComponent } from './P2PSwap/CancelOrderComponent'
import { DispatchOrderFillPropotionalFeeComponent } from './P2PSwap/DispatchOrderPropotionalComponent'
import { DispatchOrderFillFixedFeeComponent } from './P2PSwap/DispatchOrderFixedComponent'

const boxStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  width: '100%',
  marginBottom: '1rem',
} as const

const selectStyle = {
  padding: '1rem',
  border: '1px solid #ccc',
  borderRadius: '8px',
  width: '100%',
  backgroundColor: '#f9f9f9',
  color: '#333',
  marginBottom: '1rem',
} as const

export const SigMenu = () => {
  const [menu, setMenu] = useState('faucet')
  const [evvmID, setEvvmID] = useState('')
  const [evvmAddress, setEvvmAddress] = useState('')
  const [nameserviceAddress, setNameserviceAddress] = useState('')
  const [stakingAddress, setStakingAddress] = useState('')
  const [p2pswapAddress, setP2pswapAddress] = useState('')
  const [loadingIDs, setLoadingIDs] = useState(false)
  // Map selector value to network object
  const networkOptions = [
    { value: 'sepolia', label: 'Sepolia' },
    { value: 'arbitrumSepolia', label: 'Arbitrum Sepolia' },
    { value: 'hederaTestnet', label: 'Hedera Testnet' },
    { value: 'zircuitGarfieldTestnet', label: 'Zircuit Garfield Testnet' },
  ]
  const [network, setNetwork] = useState('sepolia')

  const handleNetworkChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = e.target.value
    setNetwork(value)
    // Find the chainId for the selected network
    let chainId: number | undefined
    if (value === 'sepolia') {
      const id = networks.find(
        (n) =>
          n.name?.toLowerCase().includes('sepolia') &&
          !n.name?.toLowerCase().includes('arbitrum')
      )?.id
      chainId = typeof id === 'string' ? parseInt(id) : id
    } else if (value === 'arbitrumSepolia') {
      const id = networks.find((n) =>
        n.name?.toLowerCase().includes('arbitrum')
      )?.id
      chainId = typeof id === 'string' ? parseInt(id) : id
    } else if (value === 'zircuitGarfieldTestnet') {
      const id = networks.find((n) =>
        n.name === 'zircuitGarfieldTestnet' || n.name?.toLowerCase().includes('zircuit')
      )?.id
      chainId = typeof id === 'string' ? parseInt(id) : id
    } else if (value === 'hederaTestnet') {
      const id = networks.find((n) =>
        n.name?.toLowerCase().includes('hedera')
      )?.id
      chainId = typeof id === 'string' ? parseInt(id) : id
    }
    if (typeof chainId === 'number' && !isNaN(chainId)) {
      try {
        await switchChain(config, { chainId })
      } catch (err) {
        // Optionally show error to user
        // eslint-disable-next-line no-console
        console.error('Failed to switch chain:', err)
      }
    }
  }

  // Fetch summary info for EVVM contract: evvmID, stakingAddress, and NameService address
  const fetchEvvmSummary = async () => {
    if (!evvmAddress) {
      alert('Please enter a valid EVVM address')
      return
    }

    // Validate address format
    const trimmedAddress = evvmAddress.trim()
    if (!isAddress(trimmedAddress)) {
      alert('Please enter a valid Ethereum address (must start with 0x and be 42 characters)')
      return
    }

    // Check if wallet is connected
    const account = getAccount(config)
    if (!account.address) {
      alert('Please connect your wallet first')
      return
    }

    // Get current chain ID and ensure we're on the correct network
    let targetChainId: number | undefined
    if (network === 'sepolia') {
      const id = networks.find(
        (n) =>
          n.name?.toLowerCase().includes('sepolia') &&
          !n.name?.toLowerCase().includes('arbitrum')
      )?.id
      targetChainId = typeof id === 'string' ? parseInt(id) : id
    } else if (network === 'arbitrumSepolia') {
      const id = networks.find((n) =>
        n.name?.toLowerCase().includes('arbitrum')
      )?.id
      targetChainId = typeof id === 'string' ? parseInt(id) : id
    } else if (network === 'zircuitGarfieldTestnet') {
      const id = networks.find((n) =>
        n.name?.toLowerCase().includes('zircuit')
      )?.id
      targetChainId = typeof id === 'string' ? parseInt(id) : id
    } else if (network === 'hederaTestnet') {
      const id = networks.find((n) =>
        n.name?.toLowerCase().includes('hedera')
      )?.id
      targetChainId = typeof id === 'string' ? parseInt(id) : id
    }

    // Switch to correct network if needed
    if (typeof targetChainId === 'number' && !isNaN(targetChainId)) {
      try {
        const currentChainId = getChainId(config)
        if (currentChainId !== targetChainId) {
          await switchChain(config, { chainId: targetChainId })
          // Wait for chain switch to complete
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
      } catch (err: any) {
        console.error('Failed to switch chain:', err)
        // If user rejects, don't proceed
        if (err?.code === 4902 || err?.message?.includes('rejected')) {
          alert('Please switch to the correct network to continue')
          return
        }
      }
    }

    setLoadingIDs(true)
    try {
      console.log('Reading contracts from:', trimmedAddress, 'on network:', network)
      
      // Read contracts individually (more reliable than readContracts)
      const [evvmIDResult, stakingAddrResult, nsAddrResult] = await Promise.all([
        readContract(config, {
          abi: EvvmABI as any,
          address: trimmedAddress as `0x${string}`,
          functionName: 'getEvvmID',
          args: [],
        }),
        readContract(config, {
          abi: EvvmABI as any,
          address: trimmedAddress as `0x${string}`,
          functionName: 'getStakingContractAddress',
          args: [],
        }),
        readContract(config, {
          abi: EvvmABI as any,
          address: trimmedAddress as `0x${string}`,
          functionName: 'getNameServiceAddress',
          args: [],
        }),
      ])
      
      console.log('Contract read results:', { evvmIDResult, stakingAddrResult, nsAddrResult })

      const evvmID = evvmIDResult !== undefined && evvmIDResult !== null
        ? String(evvmIDResult)
        : ''
      const stakingAddr = typeof stakingAddrResult === 'string'
        ? stakingAddrResult
        : ''
      const nsAddr = typeof nsAddrResult === 'string' ? nsAddrResult : ''

      // Verify we got valid data
      if (!evvmID || !stakingAddr || !nsAddr) {
        throw new Error('Contract does not appear to be a valid EVVM contract. Some required data is missing.')
      }

      setEvvmID(evvmID)
      setStakingAddress(stakingAddr)
      setNameserviceAddress(nsAddr)
      setEvvmAddress(trimmedAddress) // Update with trimmed address
    } catch (err: any) {
      setEvvmID('')
      setStakingAddress('')
      setNameserviceAddress('')
      const errorMessage = err?.message || 'Could not fetch data (evvmID, stakingAddress, NameService address)'
      console.error('Error fetching EVVM summary:', err)
      alert(errorMessage)
    } finally {
      setLoadingIDs(false)
    }
  }

  // Pass evvmID, evvmAddress, and stakingAddress as props to all components
  const FaucetFunctions = useMemo(
    () => [
      <FaucetFunctionsComponent key="faucet" evvmAddress={evvmAddress} />,
      <FaucetBalanceChecker key="faucetBalance" evvmAddress={evvmAddress} />,
    ],
    [evvmAddress]
  )

  const payComponents = useMemo(
    () => [
      <PaySignaturesComponent
        key="pay"
        evvmID={evvmID}
        evvmAddress={evvmAddress}
      />,
      <DispersePayComponent
        key="disperse"
        evvmID={evvmID}
        evvmAddress={evvmAddress}
      />,
    ],
    [evvmID, evvmAddress]
  )

  const stakingComponents = useMemo(
    () => [
      <GoldenStakingComponent
        key="golden"
        evvmID={evvmID}
        stakingAddress={stakingAddress}
      />,
      <PresaleStakingComponent
        key="presale"
        evvmID={evvmID}
        stakingAddress={stakingAddress}
      />,
      <PublicStakingComponent
        key="public"
        evvmID={evvmID}
        stakingAddress={stakingAddress}
      />,
    ],
    [evvmID, stakingAddress]
  )

  const mnsComponents = useMemo(
    () => [
      <PreRegistrationUsernameComponent
        key="preReg"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <RegistrationUsernameComponent
        key="reg"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <EmailRegistrationComponent
        key="emailReg"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <PhoneRegistrationComponent
        key="phoneReg"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <MakeOfferComponent
        key="makeOffer"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <WithdrawOfferComponent
        key="withdrawOffer"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <AcceptOfferComponent
        key="acceptOffer"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <RenewUsernameComponent
        key="renewUsername"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <AddCustomMetadataComponent
        key="addCustomMetadata"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <RemoveCustomMetadataComponent
        key="removeCustomMetadata"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <FlushCustomMetadataComponent
        key="flushCustomMetadata"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
      <FlushUsernameComponent
        key="flushUsername"
        evvmID={evvmID}
        nameServiceAddress={nameserviceAddress}
      />,
    ],
    [evvmID, nameserviceAddress]
  )

  const p2pComponents = useMemo(
    () => [
      <MakeOrderComponent
        key="makeOrder"
        evvmID={evvmID}
        p2pSwapAddress={p2pswapAddress}
      />,
      <CancelOrderComponent
        key="cancelOrder"
        evvmID={evvmID}
        p2pSwapAddress={p2pswapAddress}
      />,
      <DispatchOrderFillPropotionalFeeComponent
        key="dispatchOrder_fillPropotionalFee"
        evvmID={evvmID}
        p2pSwapAddress={p2pswapAddress}
      />,
      <DispatchOrderFillFixedFeeComponent
        key="dispatchOrder_fillFixedFee"
        evvmID={evvmID}
        p2pSwapAddress={p2pswapAddress}
      />,
    ],
    [evvmID, p2pswapAddress]
  )

  const components =
    menu === 'faucet'
      ? FaucetFunctions
      : menu === 'pay'
        ? payComponents
        : menu === 'staking'
          ? stakingComponents
          : menu === 'mns'
            ? mnsComponents
            : menu === 'p2pswap'
              ? p2pComponents
              : []

  return (
    <div
      style={{
        maxWidth: 900,
        margin: '0rem auto',
        padding: '2rem 1.5rem',
        background: '#fff',
        borderRadius: 16,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.08)',
        border: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <h1>EVVM Signature Constructor Toolkit For Devs</h1>
        <h3>Select an EVVM contract to connect and get started:</h3>
        {evvmID && stakingAddress && nameserviceAddress ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              background: '#f8fafc',
              border: '1.5px solid #d1d5db',
              borderRadius: 10,
              padding: '1rem 1.5rem',
              minWidth: 0,
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>evvmID:</strong> {String(evvmID)}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>evvm:</strong> {evvmAddress}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>staking:</strong> {stakingAddress}
            </div>
            <div
              style={{ fontSize: 15, color: '#444', fontFamily: 'monospace' }}
            >
              <strong>nameService:</strong> {nameserviceAddress}
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: '1rem',
              alignItems: 'center',
            }}
          >
            <input
              type="text"
              placeholder="EVVM Address"
              value={evvmAddress}
              onChange={(e) => setEvvmAddress(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: 8,
                background: '#f9fafb',
                color: '#222',
                border: '1.5px solid #d1d5db',
                width: 420,
                fontFamily: 'monospace',
                fontSize: 16,
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border 0.2s',
              }}
            />
            <select
              style={{
                padding: '0.7rem 1.2rem',
                borderRadius: 8,
                border: '1.5px solid #d1d5db',
                background: '#f9fafb',
                color: '#222',
                fontWeight: 500,
                fontSize: 15,
                minWidth: 180,
                marginRight: 8,
                boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
                outline: 'none',
                transition: 'border 0.2s',
                cursor: 'pointer',
              }}
              value={network}
              onChange={handleNetworkChange}
            >
              {networkOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={fetchEvvmSummary}
              style={{
                padding: '0.7rem 1.5rem',
                borderRadius: 8,
                border: '1.5px solid #d1d5db',
                background: loadingIDs ? '#e5e7eb' : '#f3f4f6',
                color: '#222',
                fontWeight: 600,
                fontSize: 15,
                cursor: loadingIDs ? 'not-allowed' : 'pointer',
                transition: 'background 0.2s',
                minWidth: 140,
              }}
              disabled={loadingIDs}
            >
              {loadingIDs ? 'Loading...' : 'Use this EVVM'}
            </button>
          </div>
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        <input
          type="text"
          placeholder="P2P Swap Address"
          value={p2pswapAddress}
          onChange={(e) => setP2pswapAddress(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            margin: '0 auto',
            borderRadius: 8,
            background: '#f9fafb',
            color: '#222',
            border: '1.5px solid #d1d5db',
            width: 420,
            fontFamily: 'monospace',
            fontSize: 16,
            boxSizing: 'border-box',
            outline: 'none',
            transition: 'border 0.2s',
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          width: '100%',
        }}
      >
        <label
          htmlFor="sig-menu-select"
          style={{
            fontWeight: 600,
            fontSize: 16,
            color: '#333',
            marginBottom: 4,
            textAlign: 'center',
            width: '100%',
          }}
        >
          Select a function:
        </label>
        <select
          id="sig-menu-select"
          onChange={(e) => setMenu(e.target.value)}
          style={{
            ...selectStyle,
            fontSize: 16,
            fontWeight: 500,
            border: '1.5px solid #d1d5db',
            background: '#f9fafb',
            color: '#222',
            maxWidth: 400,
            minWidth: 260,
            margin: '0 auto',
            textAlign: 'center',
            boxShadow: '0 1px 4px 0 rgba(0,0,0,0.02)',
            display: 'block',
          }}
          value={menu}
        >
          <option value="faucet">Faucet and Balance functions</option>
          <option value="pay">Payment signatures</option>
          <option value="staking">Staking signatures</option>
          <option value="mns">Name Service signatures</option>
          <option value="p2pswap">P2P Swap signatures</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {components.map((Component, index) => (
          <div
            key={(Component as React.ReactElement).key || index}
            style={{
              ...boxStyle,
              background: '#f9fafb',
              boxShadow: '0 1px 4px 0 rgba(0,0,0,0.03)',
            }}
          >
            {Component}
          </div>
        ))}
      </div>
    </div>
  )
}

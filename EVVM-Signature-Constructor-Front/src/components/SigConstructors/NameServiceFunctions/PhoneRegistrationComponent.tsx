"use client";
import React from "react";
import { config } from "@/config/index";
import { getWalletClient, readContract } from "@wagmi/core";
import {
  TitleAndLink,
  NumberInputWithGenerator,
  PrioritySelector,
  DataDisplayWithClear,
  HelperInfo,
  NumberInputField,
  TextInputField,
} from "@/components/SigConstructors/InputsAndModules";

import { getAccountWithRetry } from "@/utils/getAccountWithRetry";
import { NameServiceABI } from "@evvm/viem-signature-library";
import {
  executePhoneRegistration,
  PhoneRegistrationInputData
} from "@/utils/TransactionExecuter/useNameServiceTransactionExecuter";
import {
  EvvmABI,
  PayInputData,
  NameServiceSignatureBuilder,
} from "@evvm/viem-signature-library";

type InfoData = {
  PayInputData: PayInputData;
  PhoneRegistrationInputData: PhoneRegistrationInputData;
};

interface PhoneRegistrationComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const PhoneRegistrationComponent = ({
  evvmID,
  nameServiceAddress,
}: PhoneRegistrationComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(null);
  const [otcCode, setOtcCode] = React.useState<string>("");
  const [otcSent, setOtcSent] = React.useState(false);
  const [otcVerified, setOtcVerified] = React.useState(false);

  const getValue = (id: string) => {
    const el = document.getElementById(id) as HTMLInputElement | null;
    if (!el) {
      throw new Error(
        `Input element with id '${id}' not found. Ensure the input is rendered and the id is correct.`
      );
    }
    return el.value;
  };

  const sendOTC = async () => {
    const phone = getValue("phoneInput_phoneRegistration");
    if (!phone || phone.length < 10) {
      alert("Please enter a valid phone number");
      return;
    }

    // TODO: Implement actual OTC sending via SMS carrier service
    // For now, we'll simulate it
    console.log("Sending OTC to phone:", phone);
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtcCode(generatedCode);
    setOtcSent(true);
    alert(`OTC Code (simulated): ${generatedCode}\n\nIn production, this would be sent via SMS to your phone.`);
  };

  const verifyOTC = () => {
    const inputCode = getValue("otcInput_phoneRegistration");
    if (inputCode === otcCode) {
      setOtcVerified(true);
      alert("Phone number verified successfully!");
    } else {
      alert("Invalid OTC code. Please try again.");
    }
  };

  const makeSig = async () => {
    if (!otcVerified) {
      alert("Please verify your phone number with OTC first");
      return;
    }

    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      evvmId: evvmID,
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_phoneRegistration"),
      phone: getValue("phoneInput_phoneRegistration"),
      priorityFee_EVVM: getValue("priorityFeeInput_phoneRegistration"),
      nonceEVVM: getValue("nonceEVVMInput_phoneRegistration"),
      priorityFlag: priority === "high",
    };

    // Validate that required fields are not empty
    if (!formData.phone || formData.phone.length < 10) {
      throw new Error("Valid phone number is required");
    }
    if (!formData.nonceNameService) {
      throw new Error("NameService nonce is required");
    }
    if (!formData.nonceEVVM) {
      throw new Error("EVVM nonce is required");
    }
    if (!formData.priorityFee_EVVM) {
      throw new Error("Priority fee is required");
    }

    try {
      const walletClient = await getWalletClient(config);
      const signatureBuilder = new (NameServiceSignatureBuilder as any)(
        walletClient,
        walletData
      );

      await readRewardAmount();

      if (rewardAmount === null) {
        throw new Error("Failed to read reward amount. Please try again.");
      }

      const { paySignature, actionSignature } =
        await signatureBuilder.signRegistrationPhoneNumber(
          BigInt(formData.evvmId),
          formData.addressNameService as `0x${string}`,
          formData.phone,
          0n, // clowNumber - using 0n as default for phone registration
          BigInt(formData.nonceNameService),
          rewardAmount,
          BigInt(formData.priorityFee_EVVM),
          BigInt(formData.nonceEVVM),
          formData.priorityFlag
        );

      setDataToGet({
        PayInputData: {
          from: walletData.address as `0x${string}`,
          to_address: formData.addressNameService as `0x${string}`,
          to_identity: "",
          token: "0x0000000000000000000000000000000000000001" as `0x${string}`,
          amount: rewardAmount * BigInt(100),
          priorityFee: BigInt(formData.priorityFee_EVVM),
          nonce: BigInt(formData.nonceEVVM),
          priority: priority === "high",
          executor: formData.addressNameService as `0x${string}`,
          signature: paySignature,
        },
        PhoneRegistrationInputData: {
          user: walletData.address as `0x${string}`,
          nonce: BigInt(formData.nonceNameService),
          phone: formData.phone,
          timestampUser: BigInt(Math.floor(Date.now() / 1000)),
          signatureUser: actionSignature,
          timestampAuthority: 0n,
          signatureAuthority: "0x" as `0x${string}`,
          priorityFee_EVVM: BigInt(formData.priorityFee_EVVM),
          nonce_EVVM: BigInt(formData.nonceEVVM),
          priorityFlag_EVVM: formData.priorityFlag,
          signature_EVVM: paySignature,
        },
      });
    } catch (error) {
      console.error("Error creating signatures:", error);
    }
  };

  const readRewardAmount = async () => {
    if (!nameServiceAddress) {
      setRewardAmount(null);
    } else {
      await readContract(config, {
        abi: NameServiceABI,
        address: nameServiceAddress as `0x${string}`,
        functionName: "getEvvmAddress",
        args: [],
      })
        .then((evvmAddress) => {
          if (!evvmAddress) {
            setRewardAmount(null);
          }

          readContract(config, {
            abi: EvvmABI,
            address: evvmAddress as `0x${string}`,
            functionName: "getRewardAmount",
            args: [],
          })
            .then((reward) => {
              console.log("Mate reward amount:", reward);
              setRewardAmount(reward ? BigInt(reward.toString()) : null);
            })
            .catch((error) => {
              console.error("Error reading mate reward amount:", error);
              setRewardAmount(null);
            });
        })
        .catch((error) => {
          console.error("Error reading NameService address:", error);
          setRewardAmount(null);
        });
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    console.log("Executing phone registration...");

    executePhoneRegistration(
      dataToGet.PhoneRegistrationInputData,
      nameServiceAddress as `0x${string}`
    )
      .then(() => {
        console.log("Phone registration executed successfully");
      })
      .catch((error) => {
        console.error("Error executing phone registration:", error);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <TitleAndLink
        title="Phone Registration Service"
        link="https://www.evvm.info/docs/SignatureStructures/NameService/phoneRegistrationStructure"
      />

      <br />

      <p>
        Register your phone number onchain, verified with carrier OTC. This allows users to send to phone numbers in place of addresses or names!
      </p>
      <br />

      <TextInputField
        label="Phone Number"
        inputId="phoneInput_phoneRegistration"
        placeholder="Enter phone number (e.g., +1234567890)"
      />

      {!otcSent && (
        <button
          onClick={sendOTC}
          style={{
            padding: "0.5rem",
            marginTop: "1rem",
            backgroundColor: "#4CAF50",
            color: "white",
          }}
        >
          Send OTC Code via SMS
        </button>
      )}

      {otcSent && !otcVerified && (
        <>
          <TextInputField
            label="Enter OTC Code"
            inputId="otcInput_phoneRegistration"
            placeholder="Enter 6-digit code"
          />
          <button
            onClick={verifyOTC}
            style={{
              padding: "0.5rem",
              marginTop: "0.5rem",
              backgroundColor: "#2196F3",
              color: "white",
            }}
          >
            Verify OTC
          </button>
        </>
      )}

      {otcVerified && (
        <>
          <p style={{ color: "green", marginTop: "1rem" }}>✓ Phone Verified</p>

          <NumberInputWithGenerator
            label="NameService Nonce"
            inputId="nonceNameServiceInput_phoneRegistration"
            placeholder="Enter nonce"
          />

          <NumberInputField
            label="Priority fee"
            inputId="priorityFeeInput_phoneRegistration"
            placeholder="Enter priority fee"
          />

          <PrioritySelector onPriorityChange={setPriority} />

          <NumberInputWithGenerator
            label="EVVM Nonce"
            inputId="nonceEVVMInput_phoneRegistration"
            placeholder="Enter nonce"
            showRandomBtn={priority !== "low"}
          />

          <div>
            {priority === "low" && (
              <HelperInfo label="How to find my sync nonce?">
                <div>
                  You can retrieve your next sync nonce from the EVVM contract using
                  the <code>getNextCurrentSyncNonce</code> function.
                </div>
              </HelperInfo>
            )}
          </div>

          <button
            onClick={makeSig}
            style={{
              padding: "0.5rem",
              marginTop: "1rem",
            }}
          >
            Create signature
          </button>

          <DataDisplayWithClear
            dataToGet={dataToGet}
            onClear={() => setDataToGet(null)}
            onExecute={execute}
          />
        </>
      )}
    </div>
  );
};

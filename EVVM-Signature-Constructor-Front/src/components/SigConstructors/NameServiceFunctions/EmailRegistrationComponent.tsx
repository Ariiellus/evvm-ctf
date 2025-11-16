"use client";
import React from "react";
import { config } from "@/config/index";
import { getWalletClient, readContract } from "@wagmi/core";
import {
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
  executeEmailRegistration,
  EmailRegistrationInputData
} from "@/utils/TransactionExecuter/useNameServiceTransactionExecuter";
import {
  EvvmABI,
  PayInputData,
  NameServiceSignatureBuilder,
} from "@evvm/viem-signature-library";

type InfoData = {
  PayInputData: PayInputData;
  EmailRegistrationInputData: EmailRegistrationInputData;
};

interface EmailRegistrationComponentProps {
  evvmID: string;
  nameServiceAddress: string;
}

export const EmailRegistrationComponent = ({
  evvmID,
  nameServiceAddress,
}: EmailRegistrationComponentProps) => {
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(null);
  const [otcCode, setOtcCode] = React.useState<string>("");
  const [otcSent, setOtcSent] = React.useState(false);
  const [otcVerified, setOtcVerified] = React.useState(false);
  const [timestampUser, setTimestampUser] = React.useState<bigint | null>(null);
  const [signatureUser, setSignatureUser] = React.useState<`0x${string}` | null>(null);
  // According to documentation, these should be hardcoded to zero/empty
  const timestampAuthority = BigInt(0);
  const signatureAuthority = "0x" as `0x${string}`;

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
    const email = getValue("emailInput_emailRegistration");
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    // TODO: Implement actual OTC sending via email service
    // For now, we'll simulate it
    console.log("Sending OTC to email:", email);
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    setOtcCode(generatedCode);
    setOtcSent(true);
    alert(`OTC Code (simulated): ${generatedCode}\n\nIn production, this would be sent to your email.`);
  };

  const verifyOTC = async () => {
    const inputCode = getValue("otcInput_emailRegistration");
    if (inputCode === otcCode) {
      const walletData = await getAccountWithRetry(config);
      if (!walletData) return;

      // Generate timestamp for user
      const userTimestamp = BigInt(Math.floor(Date.now() / 1000));
      setTimestampUser(userTimestamp);

      // Generate signature for user - sign just the email address
      // The email registry contract expects a signature over the email
      const walletClient = await getWalletClient(config);
      if (!walletClient) return;

      const email = getValue("emailInput_emailRegistration");
      // Sign just the email address - this is a common pattern for email verification
      const userSig = await walletClient.signMessage({ 
        message: email 
      });
      setSignatureUser(userSig as `0x${string}`);

      // timestampAuthority and signatureAuthority are hardcoded to zero/empty per documentation

      setOtcVerified(true);
      alert("Email verified successfully!");
    } else {
      alert("Invalid OTC code. Please try again.");
    }
  };

  const makeSig = async () => {
    if (!otcVerified) {
      alert("Please verify your email with OTC first");
      return;
    }

    if (!timestampUser || !signatureUser) {
      alert("Please verify your email with OTC first to generate required signatures");
      return;
    }

    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    const formData = {
      evvmId: evvmID,
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_emailRegistration"),
      email: getValue("emailInput_emailRegistration"),
      priorityFee_EVVM: getValue("priorityFeeInput_emailRegistration"),
      nonceEVVM: getValue("nonceEVVMInput_emailRegistration"),
      priorityFlag: priority === "high",
    };

    // Validate that required fields are not empty
    if (!formData.email || !formData.email.includes("@")) {
      throw new Error("Valid email is required");
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

      const reward = await readRewardAmount();
      if (reward === null) {
        throw new Error("Failed to fetch reward amount. Please try again.");
      }

      const { paySignature, actionSignature } =
        await signatureBuilder.signRegistrationEmail(
          BigInt(formData.evvmId),
          formData.addressNameService as `0x${string}`,
          formData.email,
          0n, // clowNumber - using 0n as default for email registration
          BigInt(formData.nonceNameService),
          reward,
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
          amount: reward ? reward * BigInt(100) : BigInt(0),
          priorityFee: BigInt(formData.priorityFee_EVVM),
          nonce: BigInt(formData.nonceEVVM),
          priority: priority === "high",
          executor: formData.addressNameService as `0x${string}`,
          signature: paySignature,
        },
        EmailRegistrationInputData: {
          user: walletData.address as `0x${string}`,
          nonce: BigInt(formData.nonceNameService),
          email: formData.email,
          timestampUser: timestampUser!,
          signatureUser: signatureUser!,
          timestampAuthority: timestampAuthority,
          signatureAuthority: signatureAuthority,
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

  const readRewardAmount = async (): Promise<bigint | null> => {
    if (!nameServiceAddress) {
      setRewardAmount(null);
      return null;
    }
    
    try {
      const evvmAddress = await readContract(config, {
        abi: NameServiceABI,
        address: nameServiceAddress as `0x${string}`,
        functionName: "getEvvmAddress",
        args: [],
      });

      if (!evvmAddress) {
        setRewardAmount(null);
        return null;
      }

      const reward = await readContract(config, {
        abi: EvvmABI,
        address: evvmAddress as `0x${string}`,
        functionName: "getRewardAmount",
        args: [],
      });

      console.log("Mate reward amount:", reward);
      const rewardBigInt = reward ? BigInt(reward.toString()) : null;
      setRewardAmount(rewardBigInt);
      return rewardBigInt;
    } catch (error) {
      console.error("Error reading reward amount:", error);
      setRewardAmount(null);
      return null;
    }
  };

  const execute = async () => {
    if (!dataToGet) {
      console.error("No data to execute payment");
      return;
    }

    console.log("Executing email registration...");
    console.log("Email registration data:", dataToGet.EmailRegistrationInputData);

    executeEmailRegistration(
      dataToGet.EmailRegistrationInputData,
      nameServiceAddress as `0x${string}`
    )
      .then(() => {
        console.log("Email registration executed successfully");
        alert("Email registration successful!");
      })
      .catch((error: any) => {
        console.error("Error executing email registration:", error);
        const errorMessage = error?.message || error?.toString() || "Unknown error";
        alert(`Email registration failed: ${errorMessage}\n\nThe email registry contract may be rejecting the signatures. Please ensure the email registry is properly configured and the signature format matches what it expects.`);
      });
  };

  return (
    <div className="flex flex-1 flex-col justify-center items-center">
      <br />

      <p>
        Register your email address onchain, verified with email OTC. This allows users to send to emails in place of addresses or names!
      </p>
      <br />

      <TextInputField
        label="Email Address"
        inputId="emailInput_emailRegistration"
        placeholder="Enter email address"
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
          Send OTC Code
        </button>
      )}

      {otcSent && !otcVerified && (
        <>
          <TextInputField
            label="Enter OTC Code"
            inputId="otcInput_emailRegistration"
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
          <p style={{ color: "green", marginTop: "1rem" }}>✓ Email Verified</p>

          <NumberInputWithGenerator
            label="NameService Nonce"
            inputId="nonceNameServiceInput_emailRegistration"
            placeholder="Enter nonce"
          />

          <NumberInputField
            label="Priority fee"
            inputId="priorityFeeInput_emailRegistration"
            placeholder="Enter priority fee"
          />

          <PrioritySelector onPriorityChange={setPriority} />

          <NumberInputWithGenerator
            label="EVVM Nonce"
            inputId="nonceEVVMInput_emailRegistration"
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
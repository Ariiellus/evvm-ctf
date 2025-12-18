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
import { useMagic, MagicRPCError, RPCErrorCode } from "@/hooks/useMagic";

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
  const { loginWithEmailOTP, getUserEmail, logout, isLoggedIn } = useMagic();
  const [priority, setPriority] = React.useState("low");
  const [dataToGet, setDataToGet] = React.useState<InfoData | null>(null);
  const [rewardAmount, setRewardAmount] = React.useState<bigint | null>(null);
  const [emailVerified, setEmailVerified] = React.useState(false);
  const [verifiedEmail, setVerifiedEmail] = React.useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
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

  const authenticateWithMagic = async () => {
    const email = getValue("emailInput_emailRegistration");
    if (!email || !email.includes("@")) {
      alert("Please enter a valid email address");
      return;
    }

    setIsAuthenticating(true);

    try {
      // First, check if user is already logged in with Magic
      const loggedIn = await isLoggedIn();
      if (loggedIn) {
        console.log("🔓 User already logged in with Magic, logging out to start fresh...");
        await logout();
      }

      // Show Magic's Email OTP UI - user will receive OTP code in email
      console.log("📧 Sending Email OTP to:", email);
      console.log("⏳ Magic will send an email with a 6-digit code...");
      console.log("👀 Watch for Magic's modal to appear!");

      const didToken = await loginWithEmailOTP(email, true);

      if (didToken) {
        console.log("✅ Email OTP authentication successful!");
        console.log("DID Token:", didToken);

        // Get the verified email from Magic
        const userInfo = await getUserEmail();
        console.log("📧 Verified email from Magic:", userInfo);

        // Generate timestamp for when email was verified
        const userTimestamp = BigInt(Math.floor(Date.now() / 1000));
        setTimestampUser(userTimestamp);

        // We'll generate the wallet signature later in makeSig()
        // For now just mark email as verified
        setEmailVerified(true);
        setVerifiedEmail(email);
        alert(`✅ Email verified successfully via Magic OTP!\n\nEmail: ${email}\n\nNext: Fill in the nonces and click "Create signature" to complete registration.`);
      }
    } catch (err) {
      console.error("❌ Error during Email OTP authentication:", err);

      if (err instanceof MagicRPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkRateLimited:
            alert("⏰ Too many authentication attempts. Please wait a moment and try again.");
            break;
          case RPCErrorCode.UserAlreadyLoggedIn:
            // This shouldn't happen since we logout first, but handle it anyway
            const email = getValue("emailInput_emailRegistration");
            const userTimestamp = BigInt(Math.floor(Date.now() / 1000));
            setTimestampUser(userTimestamp);
            setEmailVerified(true);
            setVerifiedEmail(email);
            alert("✅ You're already logged in with Magic. Continuing...");
            break;
          default:
            alert(`❌ Authentication error: ${err.message}\n\nPlease try again.`);
        }
      } else {
        alert("❌ Failed to authenticate. Please try again.");
      }
    } finally {
      setIsAuthenticating(false);
    }
  };

  const makeSig = async () => {
    if (!emailVerified) {
      alert("Please verify your email with Magic first");
      return;
    }

    if (!timestampUser || !verifiedEmail) {
      alert("Please verify your email with Magic first to generate required signatures");
      return;
    }

    const walletData = await getAccountWithRetry(config);
    if (!walletData) return;

    // Generate the wallet signature for the verified email if not already done
    if (!signatureUser) {
      try {
        console.log("🔏 Generating wallet signature for email verification...");
        const walletClient = await getWalletClient(config);
        if (!walletClient) {
          alert("❌ Failed to get wallet client. Please ensure your wallet is connected.");
          return;
        }

        // Create the message to sign: timestamp + email
        const messageToSign = `${timestampUser.toString()}:${verifiedEmail}`;
        console.log("📝 Message to sign:", messageToSign);

        // Sign the message with the user's wallet
        const signature = await walletClient.signMessage({
          account: walletData.address,
          message: messageToSign,
        });

        console.log("✅ Wallet signature generated:", signature);
        setSignatureUser(signature);

        // Continue with the rest of the signature generation
        // We need to wait a tiny bit for state to update
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error("Error generating wallet signature:", error);
        alert("❌ Failed to generate wallet signature. Please try again.");
        return;
      }
    }

    const formData = {
      evvmId: evvmID,
      addressNameService: nameServiceAddress,
      nonceNameService: getValue("nonceNameServiceInput_emailRegistration"),
      email: verifiedEmail, // Use the Magic-verified email
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
        Register your email address onchain, verified with Magic Email OTP.
        This allows users to send to emails in place of addresses or names!
      </p>
      <br />

      {!emailVerified && (
        <>
          <TextInputField
            label="Email Address"
            inputId="emailInput_emailRegistration"
            placeholder="Enter email address"
          />

          <button
            onClick={authenticateWithMagic}
            disabled={isAuthenticating}
            style={{
              padding: "0.75rem 1.5rem",
              marginTop: "1rem",
              backgroundColor: isAuthenticating ? "#9E9E9E" : "#4CAF50",
              color: "white",
              cursor: isAuthenticating ? "not-allowed" : "pointer",
              fontSize: "16px",
              fontWeight: "500",
              borderRadius: "8px",
              border: "none",
            }}
          >
            {isAuthenticating ? "Authenticating..." : "Verify Email with Magic OTP"}
          </button>
        </>
      )}

      {emailVerified && verifiedEmail && (
        <>
          <p style={{ color: "green", marginTop: "1rem", fontWeight: "600" }}>
            ✓ Email Verified: {verifiedEmail}
          </p>

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
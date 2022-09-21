import React from "react";
import { Typography, Button } from "@mui/material";
import { Event, POAP} from "../pages/Mint";
import { EventCardProps } from "./EventCard";
import styles from "./MintWidget.module.scss";
import { ArrowDownCircleIcon } from "@heroicons/react/24/outline";
import Loading from 'react-loading'
import JSConfetti from 'js-confetti'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useSignMessage, useContract, useSigner } from "wagmi";
import { updateMerkle } from "zkpoaps/src/merkletree";
// import { updateMerkle } from "../mina/src/merkletree";
import { createEnvironment } from "zkpoaps/src/helpers";
// import { createEnvironment } from "../mina/src/helpers";
import { BytesLike, verifyMessage } from "ethers/lib/utils";
import { ContractInterface, ethers } from "ethers";
// import { updateMerkle } from "mina"
const EventListItem: React.FC<EventCardProps> = ({ event }) => {
  return (
    <>
      <div className="flex justify-between items-center ">
        <div className="flex justify-center items-center gap-2">
          <img
            src={event.logoURI}
            alt={event.name}
            height="32px"
            width="32px"
          />
          <Typography>{event.name}</Typography>
        </div>
      </div>
    </>
  );
};

const SOHOHousePOAP: Event = {
  name: "SOHO HOUSE POAP",
  description: "SOHO house event",
  logoURI: "https://s2.coinmarketcap.com/static/img/coins/64x64/6535.png",
};

export interface ClaimWidgetProps {
  selectedEvents: POAP[];
  onClaim: () => void;
}

export const ClaimWidget: React.FC<ClaimWidgetProps> = ({ selectedEvents, onClaim }) => {
  const { data: signer } = useSigner()
  let recoveredAddress = React.useRef<string>();

  const { data, variables, signMessage } = useSignMessage({
    message: 'Claiming SOHO House POAP',
    onSuccess(data, variables) {
      const address = verifyMessage(variables.message, data)
      recoveredAddress.current = address
    },
  })

  const [isClaiming, setIsClaiming] = React.useState(false);
  
  const poapInterface: ContractInterface = new ethers.utils.Interface([
    "function mintPOAP(bytes32 nullifierHash, address recipient, string calldata tokenURI_) public returns(bool)",
  ])
  
  const contract = useContract({
    addressOrName: process.env.POAP!,
    contractInterface: poapInterface,
    signerOrProvider: signer,
  })
  // await contract.mint()

  // const getTotalBalance = () => {
  //   const totalBalance = selectedEvents.reduce((acc, token) => {
  //     return acc + token.balance;
  //   }, 0);

  //   return parseFloat(totalBalance.toFixed(2));
  // };

  const handleClaimPOAP = async() => {

    const [zkPOAPApp, feePayer, tree, zkAppKey] = await createEnvironment();
    const poapId = 234n
    setIsClaiming(true);
    signMessage();

    const [nullifier, tokenURI] = await updateMerkle(
      variables?.message as BytesLike, 
      data!,
      poapId,
      zkPOAPApp,
      tree,
      feePayer,
      zkAppKey,
      true
    )

    await contract.mint(
      nullifier.toString(), 
      recoveredAddress.current!, 
      tokenURI, 
      // signer!
    )

    const jsConfetti = new JSConfetti()
    jsConfetti.addConfetti({
      emojis: ['🤠', '🧹', '✨', '🚀', '🔥'],
      confettiNumber: 100,
    })
    toast.success("POAP privately claimed!")
    onClaim && onClaim();
    setIsClaiming (false)
  };

  return (
    <div
      className={[
        "flex flex-col fixed bg-slate-800 px-4 h-full z-10 pt-24",
        styles.cleanWidgetContainer,
      ].join(" ")}
    >
      <div
        className={[
          styles.cleanWidget,
          "bg-slate-600 p-12 w-full flex flex-col items-center",
        ].join(" ")}
      >
        <div className="flex gap-5 flex-col w-full mb-8">
          {selectedEvents.map((eventBalance) => (
            <EventListItem
              event={eventBalance.event}
            />
          ))}
        </div>
        <div className="w-8 h-8">
          <ArrowDownCircleIcon />
        </div>
        <div className="w-full">
          <Typography variant="subtitle1">Claiming</Typography>
          <div className="w-full ">
            <EventListItem event={SOHOHousePOAP} />
          </div>
        </div>
        <div className="w-full m-8 flex items-center justify-center">
          <Button variant="contained" onClick={handleClaimPOAP} disabled={isClaiming}>
            { isClaiming? <Loading /> : "Claim POAP" }
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClaimWidget;

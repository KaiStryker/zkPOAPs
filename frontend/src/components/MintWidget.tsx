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
import { mint } from "../../../evm/scripts/mintPOAP";
import { updateMerkle } from "../../../mina/src/merkletree"
import {createEnvironment } from "../../../mina/src/helpers"

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
  const [isClaiming, setIsClaiming] = React.useState(false);

  // const getTotalBalance = () => {
  //   const totalBalance = selectedEvents.reduce((acc, token) => {
  //     return acc + token.balance;
  //   }, 0);

  //   return parseFloat(totalBalance.toFixed(2));
  // };

  const handleClaimPOAP = () => {
    setIsClaiming(true);


    setTimeout(() => {
    
      const jsConfetti = new JSConfetti()
      jsConfetti.addConfetti({
        emojis: ['🤠', '🧹', '✨', '🚀', '🔥'],
        confettiNumber: 100,
      })
      toast.success("Wallet cleaned successfully!")
      onClaim && onClaim();
      setIsClaiming (false)
    }, 2000);
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
          <Typography variant="subtitle1">Receiving</Typography>
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

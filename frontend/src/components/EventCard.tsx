import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { Typography, Card } from "@mui/material";
import { Event } from "../pages/Mint";
import styles from "./EventCard.module.scss";

export interface EventCardProps {
  event: Event;
  isSelected?: boolean;
  onClick?: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  isSelected,
  onClick,
}) => {
  return (
    <>
      <Card
        className={[
          "px-6",
          styles.tokenCard,
          isSelected ? styles.selected : "",
        ].join(" ")}
        onClick={onClick}
      >
        {isSelected && (
          <div className={styles.selectIcon}>
            <CheckCircleIcon />
          </div>
        )}

        <div className="card-body flex justify-center items-center">
          <div className="flex justify-center items-center gap-2">
            <img
              src={event.logoURI}
              alt={event.name}
              height="32px"
              width="32px"
            />
            <Typography>{event.name}</Typography>
          </div>
          {/* <Typography>{balance}</Typography> */}
        </div>
      </Card>
    </>
  );
};

export default EventCard;

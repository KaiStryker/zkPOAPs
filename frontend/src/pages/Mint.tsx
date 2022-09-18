import React from "react";

// components
import NavBar from "../components/NavBar";
import { EventCard } from "../components/EventCard";
import { ClaimWidget } from "../components/MintWidget";
import { Typography, Grid, Button } from "@mui/material";
import Loading from "react-loading";

// hooks
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export type Event = {
  name: string;
  description: string;
  logoURI: string;
};

export type POAP = {
  event: Event;
  balance: number;
};

const sampleEventBalances = [
  {
    event: {
      name: "DUMBO House - 9/18/2022 ",
      description: "Open Bar at DUMBO House",
      logoURI: "https://cryptoicons.org/api/icon/usdc/200",
    },
    balance: 100,
  },
  {
    event: {
      name: "SOHO House - 8/27/2022 ",
      description: "Live Jazz at SOHO House",
      logoURI: "https://cryptoicons.org/api/icon/usdc/200",
    },
    balance: 35,
  },
  {
    event: {
      name: "SOHO House - 12/31/2021 ",
      description: "NYE at SOHO House",
      logoURI: "https://cryptoicons.org/api/icon/usdc/200",
    },
    balance: 3,
  },
  {
    event: {
      name: "DUMBO House - 3/20/2022 ",
      description: "Hip Hop Night at SOHO House",
      logoURI: "https://cryptoicons.org/api/icon/usdc/200",
    },
    balance: 300,
  },
];

function Mint() {
  // wallet hooks
  const { isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();

  // state hooks
  const [isloading, setIsLoading] = React.useState(true);
  const [selectedEvent, setSelectedEvent] = React.useState<POAP[]>(
    []
  );
  const [eventBalances, setEventBalances] = React.useState<POAP[]>([]);

  // effect hooks
  const eventIsSelected = (event: Event) => {
    return selectedEvent.some((t) => t.event.name === event.name);
  };

  const toggleToken = (poapBalance: POAP) => {
    if (eventIsSelected(poapBalance.event)) {
      setSelectedEvent(
        selectedEvent.filter(
          (t) => t.event.name !== poapBalance.event.name
        )
      );
    } else {
      setSelectedEvent([...selectedEvent, poapBalance]);
    }
  };

  const loadBalances = () => {
    setTimeout(() => {
      setEventBalances(sampleEventBalances);
      setSelectedEvent([]);
      setIsLoading(false);
    }, 2000);
  };

  const handleOnClaim = () => {
    setEventBalances([]);
    setSelectedEvent([]);
  };

  React.useEffect(() => {
    loadBalances();
  }, []);

  React.useEffect(() => {
    if (isConnected) {
      setIsLoading(true);
      loadBalances();
    }
  }, [isConnected]);

  if (!isConnected) {
    return (
      <>
        <div className="h-screen w-screen flex bg-black">
          <div className="relative w-full h-full bg-black">
            <NavBar></NavBar>
            <section className="container mx-auto ">
              <div className="w-100 flex flex-col justify-center items-center mt-6 gap-4">
                <Typography variant="h6">
                  Your wallet is not connected, please connect your wallet to
                  continue
                </Typography>
                <div>
                  <Button
                    onClick={() => {
                      openConnectModal && openConnectModal();
                    }}
                    variant="contained"
                  >
                    Connect your wallet
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="h-screen w-screen flex bg-black">
        <div className="relative w-full h-full bg-black">
          <NavBar></NavBar>
          <section className="container mx-auto">
            <div>
              <Typography variant="h4" className="pt-6 pb-2">
                Events to claim
              </Typography>
              <Typography variant="body1">
                SOHO House POAPs.
              </Typography>
            </div>

            {!isloading ? (
              <div
                className={[
                  "transition-all",
                  selectedEvent.length > 0 ? "mr-96 " : "",
                ].join(" ")}
              >
                {eventBalances.length > 0 ? (
                  <>
                    <div className="mt-12 mb-6">
                      <Typography>
                        Select the POAP you want to claim
                      </Typography>
                    </div>
                    <div>
                      <Grid container spacing={4}>
                        {eventBalances.map((eventBalance) => (
                          <Grid
                            item
                            xs={12}
                            sm={6}
                            md={3}
                            key={eventBalance.event.name}
                          >
                            <EventCard
                              event={eventBalance.event}
                              isSelected={eventIsSelected(eventBalance.event)}
                              onClick={() => toggleToken(eventBalance)}
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </>
                ) : (
                  <div className="mt-8">
                    <Typography variant="h6">
                      POAP claimed!
                    </Typography>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-100 flex flex-col items-center my-6">
                <Loading />
                <Typography variant="body1">
                  Loading your POAP..
                </Typography>
              </div>
            )}

            {selectedEvent.length > 0 && (
              <ClaimWidget
                selectedEvents={selectedEvent}
                onClaim={handleOnClaim}
              />
            )}
          </section>
        </div>
      </div>
    </>
  );
}

export default Mint;

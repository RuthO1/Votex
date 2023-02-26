import React from "react";
import { useState } from "react";
import { Notification } from "./components/ui/Notifications";
import Cover from "./utils/Cover";
import Wallet from "./components/wallet";
import { Container, Nav } from "react-bootstrap";
import CandidateList from "./components/pages";
import VotingContract from "./contracts/VotingContract.json";
import VotingContractAddress from "./contracts/VotingContract-address.json";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import "./App.css";
require("dotenv").config({ path: ".env" });

function App() {
  const [address, setAddress] = useState(null);
  const getAPIKey = () => {
    return process.env.REACT_APP_ALCHEMY_API_KEY;
  };
  const web3 = createAlchemyWeb3(
    `https://eth-goerli.g.alchemy.com/v2/${getAPIKey()}`
  );

  const votingContract = new web3.eth.Contract(
    VotingContract.abi,
    VotingContractAddress.VotingContract
  );

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAddress(addressArray[0]);
        const obj = {
          status: "",
          address: addressArray[0],
        };

        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😞" + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href="https://metamask.io/download.html">
                You must install MetaMask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  return (
    <>
      <Notification />

      {address ? (
        <Container fluid="md">
          <Nav className="justify-content-end pt-3 pb-5">
            <Nav.Item>
              {/*display user wallet*/}
              <Wallet address={address} />
            </Nav.Item>
          </Nav>
          <main>
            {
              <CandidateList
                name="Votex"
                votingContract={votingContract}
                address={address}
              />
            }
          </main>
        </Container>
      ) : (
        //  if user wallet is not connected display cover page
        <Cover
          name="Decentralized Voting Platform For Governments and Organizations"
          coverImg="https://repository-images.githubusercontent.com/473491878/f987f3bc-1c6b-49fb-868c-c8d47f07435f"
          connect={connectWallet}
        />
      )}
    </>
  );
}

export default App;

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import AddCandidates from "./addCandidate";
import GiveVotingRight from "./giveRight";
import CandidateCard from "./Candidates";
import Loader from ".././ui/Loader";
import {getCandidate, addCandidate, givetVotingRight, voting, getVotersList, uploadImage, getLeaderboard, fetchAdmin} from "../../utils/voters"
import { NotificationSuccess, NotificationError } from ".././ui/Notifications";
import { Row } from "react-bootstrap";
import { Voters } from "./Voters";
import { Leaderboard } from "./Leaderboard";
import Web3 from "web3";

const CandidateList = ({ votingContract, address, name }) => {

  /* performActions : used to run smart contract interactions in order
  *  address : fetch the address of the connected wallet
  */
  const [candidates, setCandidates] = useState([]);
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [leaderboard, setLeaderBoard] = useState([]);
  const [admin, setAdmin] = useState("")
  const [checksumAddress, setChecksumAddress] = useState([]);
  



  const getCandidates = useCallback(async () => {
    try {
      setLoading(true);
      // fetch all nfts from the smart contract
      const allCandidates = await getCandidate(votingContract);
      if (!allCandidates) return
      setCandidates(allCandidates);
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [getCandidate]);

  const getVoters = useCallback (async () => {
    try {
      setLoading(true);
      const allVoters = await getVotersList(votingContract);
      if(!allVoters) return
      setVoters(allVoters)
      console.log(allVoters)
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [getVotersList]);

  const getLeaderBoard = useCallback (async () => {
    try {
      setLoading(true);
      const allCandidates = await getLeaderboard(votingContract);
      if(!allCandidates) return
      setLeaderBoard(allCandidates)
    } catch (error) {
      console.log({ error });
    } finally {
      setLoading(false);
    }
  }, [getLeaderboard]);

  const fetchContractAdmin = useCallback(async () => {
  try{
    // get the address of the admin
    const _address = await fetchAdmin(votingContract);
    setAdmin(Web3.utils.toChecksumAddress(_address));
    setChecksumAddress(Web3.utils.toChecksumAddress(address))
    console.log(_address)
    console.log(address)
  }catch (error) {
    console.log({ error });
    toast(<NotificationError text="Failed to fetch admin." />);
  }
  }, [fetchAdmin]);

  

  const AddCandidate = async (name, age, image, description, candidateAddress) => {
    try {
      setLoading(true);
      await addCandidate(name, age, image, description, candidateAddress, address, votingContract);
      toast(<NotificationSuccess text="Adding Candidates...."/>);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add Candidate." />);
    } finally {
      setLoading(false);
      getCandidates();
      getVoters();
      getLeaderBoard();
    }
  };


  const giveVotingright = async (_address) => {
    try {
      setLoading(true);
      await givetVotingRight( votingContract, _address, address);
      toast(<NotificationSuccess text="Adding Voter"/>);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to add Voter." />);
    } finally {
      setLoading(false);
      getCandidates();
      getVoters();
      getLeaderBoard();
    }
  };


  const Vote = async (index) => {
    try {
      setLoading(true);
      await voting( votingContract, index, address );
      toast(<NotificationSuccess text="Voting for Candidate"/>);
    } catch (error) {
      console.log({ error });
      toast(<NotificationError text="Failed to vote for candidate." />);
    } finally {
      setLoading(false);
      getCandidates();
      getVoters();
      getLeaderBoard();
     
    }
  };


  useEffect(() => {
    try {
      if (address) {
        getCandidates();
        getVoters();
        getLeaderBoard();
        fetchContractAdmin();
      }
    } catch (error) {
      console.log({ error });
    }
  }, [address, getCandidates, getVoters, getLeaderBoard, fetchContractAdmin]);
  if (address) {
    return (
      <>
        {!loading ? (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h1 className="fs-4 fw-bold mb-0">{name}</h1>

              {admin === checksumAddress ? (
                <AddCandidates save={AddCandidate} admin={admin} address ={address} uploadImage={uploadImage}/>
              ) : null
              }

               {admin === checksumAddress ? (
                <GiveVotingRight save={giveVotingright} admin={admin} address={address}/>
              ) : null
              }
                  
                  
            
            </div>

            <Voters VotersList={voters} />
            <Row xs={1} sm={2} lg={3} className="g-3  mb-5 g-xl-4 g-xxl-5">

              {/* display all Candidates */}
              {candidates.map((_candidate) => (
                  <CandidateCard
                      key={_candidate.index}
                      candidate={{
                        ..._candidate,
                      }}
                      Vote={Vote}
                  />
              ))}
            </Row>
            <Leaderboard leaderboard={leaderboard} />
          </>
        ) : (
          <Loader />
        )}
      </>
    );
  }
  return null;
};

CandidateList.propTypes = {

  // props passed into this component
  votingContract: PropTypes.instanceOf(Object),
};

CandidateList.defaultProps = {
  votingContract: null,
};

export default CandidateList;

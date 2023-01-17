 //SPDX-License-Identifier: UNLICENSED

 pragma solidity ^0.8.9;

 import "@openzeppelin/contracts/utils/Counters.sol";
 import "hardhat/console.sol";


 contract VotingContract {
     using Counters for Counters.Counter;

     Counters.Counter public _voterId;
     Counters.Counter public _candidateId;

     address public votingOrganizer;

     constructor (){
         votingOrganizer = msg.sender;
     }

     // --------CANDIDATE
     struct Candidate {
         uint256 candidateId;
         uint256 voteCount;
         address _address;
         string ipfs;
     }

     event CreatingCandidate (
         uint256 indexed candidateId,
         uint256 voteCount,
         address _address,
         string ipfs
     );

     address[] public candidateAddress;
     mapping(uint256 => Candidate) public candidates;


     // --------VOTER

     struct Voter{
         uint256 voter_voterId;
         uint256 voter_allowed;
         uint256 voter_vote;
         address voter_address;
         bool voter_voted;
     }

     event CreatingVoter (
         uint256 indexed voterId,
         uint256 voter_allowed,
         uint256 voter_vote,
         address voter_address,
         bool voter_voted
     );

     address[] public votedVoters;
     address[] public votersAddress;
     mapping(address => Voter) public voters;


     //---------FUNCTIONS
     function setCandidate(
         address _address, 
         string memory _ipfs
         ) public {
          require(msg.sender == votingOrganizer, "Oly Organizer can set Candidate");
          uint256 idNumber = _candidateId.current();

          Candidate storage candidate = candidates[idNumber];
          
          candidate.candidateId = idNumber;
          candidate.voteCount = 0;
          candidate._address = _address;
          candidate.ipfs = _ipfs;

          _candidateId.increment();

          candidateAddress.push(_address);

          emit CreatingCandidate(idNumber, 0, _address, _ipfs);
     }

     function getCandidateLength() public view returns (uint256){
         return _candidateId.current();
     }

     function getCandidateData(uint256 _index) public view returns(
          uint256, uint256, address, string memory){

              return(
                candidates[_index].candidateId,
                candidates[_index].voteCount,
                candidates[_index]._address,
                candidates[_index].ipfs
              );
          }

      function giveVoterRight(address _address) external{
          require(msg.sender == votingOrganizer, "Only organizer can give right to vote");
          _voterId.increment();
          uint256 idNumber = _voterId.current();

          Voter storage voter = voters[_address];
          require(voter.voter_allowed == 0);

          voter.voter_voterId = idNumber;
          voter.voter_allowed = 1;
          voter.voter_vote = 1000;
          voter.voter_address = _address;
          voter.voter_voted = false;

          votersAddress.push(_address);

          emit CreatingVoter(
              idNumber,
              voter.voter_allowed,
              voter.voter_vote,
              voter.voter_address,
              voter.voter_voted
              );
      }


    function vote(uint256 candidateId) external {
        Voter storage voter = voters[msg.sender];
        require(!voter.voter_voted, "You have already voted");
        require(voter.voter_allowed !=0, "You have no right to vote");
        require(candidates[candidateId]._address != msg.sender, "You cannot vote for your self");

        voter.voter_voted = true;
        voter.voter_vote = candidateId;

        votedVoters.push(msg.sender);
        candidates[candidateId].voteCount += voter.voter_allowed;
    }

    function getVotersList() public view returns (address[] memory){
        return votersAddress;
    }


    function getVoterLength() public view returns (uint256){
        return votersAddress.length;
    }



 }  


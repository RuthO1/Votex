//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Counters.sol";
import "hardhat/console.sol";

contract VotingContract {
    using Counters for Counters.Counter;

    Counters.Counter public _voterId;
    Counters.Counter public _candidateId;

    address public votingOrganizer = 0xa1B94ef0f24d7F4fd02285EFcb9202E6C6EC655B;

    // --------CANDIDATE
    struct Candidate {
        uint256 candidateId;
        uint256 voteCount;
        address _address;
        string ipfs;
        string name;
    }

    event CreatingCandidate(
        uint256 indexed candidateId,
        uint256 voteCount,
        address _address,
        string ipfs
    );

    address[] public candidateAddress;
    mapping(uint256 => Candidate) public candidates;

    // --------VOTER

    struct Voter {
        uint256 voter_voterId;
        uint256 voter_allowed;
        uint256 voter_vote;
        address voter_address;
        bool voter_voted;
    }

    event CreatingVoter(
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
        string memory _ipfs,
        string memory _name
    ) public {
        require(
            msg.sender == votingOrganizer,
            "Oly Organizer can set Candidate"
        );
        uint256 idNumber = _candidateId.current();

        Candidate storage candidate = candidates[idNumber];

        candidate.candidateId = idNumber;
        candidate.voteCount = 0;
        candidate._address = _address;
        candidate.ipfs = _ipfs;
        candidate.name = _name;

        _candidateId.increment();

        candidateAddress.push(_address);

        emit CreatingCandidate(idNumber, 0, _address, _ipfs);
    }

    function getCandidateLength() public view returns (uint256) {
        return _candidateId.current();
    }

    function getCandidateData(
        uint256 _index
    )
        public
        view
        returns (uint256, uint256, address, string memory, string memory)
    {
        return (
            candidates[_index].candidateId,
            candidates[_index].voteCount,
            candidates[_index]._address,
            candidates[_index].ipfs,
            candidates[_index].name
        );
    }

    function giveVoterRight(address _address) external {
        require(
            msg.sender == votingOrganizer,
            "Only organizer can give right to vote"
        );
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
        require(voter.voter_allowed != 0, "You have no right to vote");
        require(
            candidates[candidateId]._address != msg.sender,
            "You cannot vote for your self"
        );

        voter.voter_voted = true;
        voter.voter_vote = candidateId;

        votedVoters.push(msg.sender);
        candidates[candidateId].voteCount += voter.voter_allowed;
    }

    function getLeaderboard() public view returns (Candidate[] memory) {
        uint256 candidateLength = getCandidateLength();
        Candidate[] memory sortedCandidates = new Candidate[](candidateLength);

        // Copy candidates to the sortedCandidates array
        for (uint256 i = 0; i < candidateLength; i++) {
            sortedCandidates[i] = candidates[i];
        }

        // Bubble sort algorithm for sorting candidates by voteCount
        for (uint256 i = 0; i < candidateLength - 1; i++) {
            for (uint256 j = 0; j < candidateLength - 1 - i; j++) {
                if (
                    sortedCandidates[j].voteCount <
                    sortedCandidates[j + 1].voteCount
                ) {
                    Candidate memory temp = sortedCandidates[j];
                    sortedCandidates[j] = sortedCandidates[j + 1];
                    sortedCandidates[j + 1] = temp;
                }
            }
        }

        return sortedCandidates;
    }

    function getVotersList() public view returns (address[] memory) {
        return votersAddress;
    }

    function getVoterLength() public view returns (uint256) {
        return votersAddress.length;
    }

    function getAdmin() public view returns (address) {
        return (votingOrganizer);
    }
}

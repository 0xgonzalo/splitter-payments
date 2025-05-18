// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

abstract contract VotingMechanism {
    // --- Errors ---
    error VoteFuseExploded();
    error OngoingVote(bytes1 decisionID);
    error AddressNotAllowedToPropose();
    error NoOngoingVote();
    error AddressNotAllowedToVote();
    error AddressHasAlreadyVoted();
    error DiferentDecisionID(bytes1 decisionID);
    error NotEnoughVotesToExecute();

    // --- Events ---
    event VoteProposed(bytes1 decisionID, uint256 proposal);
    event VoteCast(address indexed voter, bool approve);
    event VoteExecuted(bytes1 decisionID, bool answer);

    struct VoterMetadata {
        bytes1 hasVoted;
        bytes1 isAllowed;
    }

    struct BallotBoxMetadata {
        bytes1 decicionID;
        uint256 proposal;
        uint256 totalOfVotes;
        uint256 executeVoteAmount;
        uint256 cancelVoteAmount;
    }

    bytes1 fuse;
    BallotBoxMetadata ballotBox;
    mapping(address => VoterMetadata) voter;
    address[] internal voterAddresses;

    modifier checkVoteFuse() {
        if (fuse == bytes1(0x00)) {
            revert VoteFuseExploded();
        }
        _;
    }

    constructor(bool setToPermanent, address[] memory initialVoters) {
        fuse = setToPermanent ? bytes1(0x00) : bytes1(0x01);
        voterAddresses = initialVoters;
        for (uint256 i = 0; i < initialVoters.length; i++) {
            voter[initialVoters[i]] = VoterMetadata({
                hasVoted: 0x00,
                isAllowed: 0x01 // está permitido para votar
            });
        }
    }

    function _proposeVote(
        bytes1 decisionID,
        uint256 proposal
    ) internal checkVoteFuse {
        if (ballotBox.decicionID != 0x00) {
            revert OngoingVote(ballotBox.decicionID);
        }

        if (!imAllowedToVote()) {
            revert AddressNotAllowedToPropose();
        }

        ballotBox = BallotBoxMetadata({
            decicionID: decisionID,
            proposal: proposal,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });

        emit VoteProposed(decisionID, proposal);
    }

    function _vote(bool answer) internal {
        if (ballotBox.decicionID == 0x00) {
            revert NoOngoingVote();
        }

        if (!imAllowedToVote()) {
            revert AddressNotAllowedToVote();
        }

        if (userAlreadyVoted()) {
            revert AddressHasAlreadyVoted();
        }

        voter[msg.sender].hasVoted = 0x01;
        ballotBox.totalOfVotes++;

        if (answer) {
            ballotBox.executeVoteAmount++;
        } else {
            ballotBox.cancelVoteAmount++;
        }

        emit VoteCast(msg.sender, answer);
    }

    function _execute(
        bytes1 decisionID
    ) internal returns (bool successful, uint256 proposalToChange) {
        if (ballotBox.decicionID != decisionID) {
            revert DiferentDecisionID(ballotBox.decicionID);
        }

        if (voterAddresses.length != ballotBox.totalOfVotes) {
            revert NotEnoughVotesToExecute();
        }

        // Check if the vote was successful (unanimous)
        successful = ballotBox.executeVoteAmount == ballotBox.totalOfVotes;
        proposalToChange = ballotBox.proposal;

        if (decisionID == 0x01 && successful) {
            // If the decision is to explode the fuse, we set it to 0x00
            fuse = bytes1(0x00);
        }

        // Reset the ballot box
        ballotBox = BallotBoxMetadata({
            decicionID: 0x00,
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });

        // Reset all voters
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            voter[voterAddresses[i]].hasVoted = 0x00;
        }

        emit VoteExecuted(decisionID, successful);
    }

    // internal getters
    function userAlreadyVoted() internal view returns (bool) {
        return voter[msg.sender].hasVoted == 0x01;
    }

    // getters

    function imAllowedToVote() internal view returns (bool) {
        return voter[msg.sender].isAllowed == 0x01;
    }
}

// SPDX-License-Identifier: MIT

/**
 ____        _ _ _      __     ___            
/ ___| _ __ | (_) |_   / /    / / |_ ___ _ __ 
\___ \| '_ \| | | __| / /    / /| __/ _ \ '__|
 ___) | |_) | | | |_ / /    / / | ||  __/ |   
|____/| .__/|_|_|\__/_/    /_/   \__\___|_|   
      |_|                                     

░  ░░░░  ░░      ░░        ░        ░   ░░░  ░░      ░░                           
▒  ▒▒▒▒  ▒  ▒▒▒▒  ▒▒▒▒  ▒▒▒▒▒▒▒  ▒▒▒▒    ▒▒  ▒  ▒▒▒▒▒▒▒                           
▓▓  ▓▓  ▓▓  ▓▓▓▓  ▓▓▓▓  ▓▓▓▓▓▓▓  ▓▓▓▓  ▓  ▓  ▓  ▓▓▓   ▓                           
███    ███  ████  ████  ███████  ████  ██    █  ████  █                           
████  █████      █████  ████        █  ███   ██      ██                                                                                                 
░  ░░░░  ░        ░░      ░░  ░░░░  ░░      ░░   ░░░  ░        ░░      ░░  ░░░░  ░
▒   ▒▒   ▒  ▒▒▒▒▒▒▒  ▒▒▒▒  ▒  ▒▒▒▒  ▒  ▒▒▒▒  ▒    ▒▒  ▒▒▒▒  ▒▒▒▒  ▒▒▒▒▒▒▒   ▒▒   ▒
▓        ▓      ▓▓▓  ▓▓▓▓▓▓▓        ▓  ▓▓▓▓  ▓  ▓  ▓  ▓▓▓▓  ▓▓▓▓▓      ▓▓        ▓
█  █  █  █  ███████  ████  █  ████  █        █  ██    ████  ██████████  █  █  █  █
█  ████  █        ██      ██  ████  █  ████  █  ███   █        ██      ██  ████  █
                                                
 * @title Splitter Voting Mechanism (Abstract Contract)
 * @author jistro.eth
 * @notice This contract manages the voting mechanism for the Splitter contract.
 */

pragma solidity ^0.8.13;

abstract contract VotingMechanism {
    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Errors ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    error VoteFuseExploded();
    error OngoingVote(bytes1 decisionID);
    error AddressNotAllowedToPropose();
    error NoOngoingVote();
    error AddressNotAllowedToVote();
    error AddressHasAlreadyVoted();
    error DiferentDecisionID(bytes1 decisionID);
    error NotEnoughVotesToExecute();

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Events ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    event VoteProposed(bytes1 decisionID, uint256 proposal);
    event VoteCast(address indexed voter, bool approve);
    event VoteExecuted(bytes1 decisionID, bool answer);

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Structures ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

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

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Variables ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

    bytes1 fuse;
    BallotBoxMetadata ballotBox;
    mapping(address => VoterMetadata) voter;
    address[] internal voterAddresses;

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Modifiers ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄

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
            /// @dev Initialize the voter metadata
            voter[initialVoters[i]] = VoterMetadata({
                hasVoted: 0x00,
                isAllowed: 0x01
            });
        }
    }

    /**
     *  @notice Proposes a vote with a decision ID and a proposal.
     *  @param decisionID The decision ID for the vote (0x01 for explode fuse, 0x02 for change proposal).
     *  @param proposal The proposal to be voted on, which can be a new fuse value or a new proposal value.
     */
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

    /**
     *  @notice Casts a vote for the current ongoing vote.
     *  @param answer The answer to the vote (true for approve, false for cancel).
     */
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

    /**
     *  @notice Executes the vote based on the decision ID.
     *  @param decisionID The decision ID for the vote (0x01 for explode fuse, 0x02 for change proposal).
     *  @return successful A boolean indicating if the vote was successful (unanimous).
     *  @return proposalToChange The proposal that was voted on.
     */
    function _execute(
        bytes1 decisionID
    ) internal returns (bool successful, uint256 proposalToChange) {
        if (ballotBox.decicionID != decisionID) {
            revert DiferentDecisionID(ballotBox.decicionID);
        }

        if (voterAddresses.length != ballotBox.totalOfVotes) {
            revert NotEnoughVotesToExecute();
        }

        /// @dev A vote is considered successful if the number of execute votes equals the total number of votes.
        successful = ballotBox.executeVoteAmount == ballotBox.totalOfVotes;
        proposalToChange = ballotBox.proposal;

        if (decisionID == 0x01 && successful) {
            /// @dev If the decision is to explode the fuse, set it to 0x00.
            fuse = bytes1(0x00);
        }

        /// @dev Resets the ballot box for the next vote
        ballotBox = BallotBoxMetadata({
            decicionID: 0x00,
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });

        /// @dev Resets the hasVoted status for all voters
        for (uint256 i = 0; i < voterAddresses.length; i++) {
            voter[voterAddresses[i]].hasVoted = 0x00;
        }

        emit VoteExecuted(decisionID, successful);
    }

    // ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄ Internal Functions ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄
    function userAlreadyVoted() internal view returns (bool) {
        return voter[msg.sender].hasVoted == 0x01;
    }

    function imAllowedToVote() internal view returns (bool) {
        return voter[msg.sender].isAllowed == 0x01;
    }

    function _isMember(address _user) internal view returns (bool) {
        return voter[_user].isAllowed == 0x01;
    }

    function getBallotBoxMetadata()
        external
        view
        returns (BallotBoxMetadata memory)
    {
        return ballotBox;
    }

    function getFuse() external view returns (bytes1) {
        return fuse;
    }
}

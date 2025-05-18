// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {NFT} from "./NFT.sol";

contract DynamicSplitter is Ownable {
    struct SubSplitMetadata {
        address account;
        uint16 percentage;
        uint256 amountToBeRetired;
    }

    struct PercentageSplitMetadata {
        uint16 actual;
        uint16 max;
        uint16 toIncrease;
    }

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
    uint16 constant BPS_DENOMINATOR = 10000; // 100% in Basis Points

    PercentageSplitMetadata percentageSplit;

    uint256 pricePerMint;
    uint256 amountToBeRetiredForCreator;
    uint256 payCounter;
    uint256 goalForIncreasePercentage;

    address creator;
    address tokenAddress;

    BallotBoxMetadata ballotBox;

    SubSplitMetadata[] subSplits;
    mapping(address => VoterMetadata) voter;

    // --- Modifiers ---

    modifier checkVoteFuse() {
        if (fuse == bytes1(0x00)) {
            revert("Fuse is exploded, you cannot perform this action.");
        }
        _;
    }

    constructor(
        address _creator,
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _pricePerMint,
        // este tiene 2 decimales, por ejemplo 1500 para 15.00%
        uint16 _percentageToBeginSplit,
        uint16 _maxPercentageSplit,
        uint16 _toIncreasePercentageSplit,
        uint256 _goalForIncreasePercentage,
        bool setToPermanent,
        address[] memory _addressToSplit,
        uint16[] memory _percentageToSplit
    ) Ownable(_creator) {
        uint256 sumSubSplitPercentages = 0;

        for (uint256 i = 0; i < _percentageToSplit.length; i++) {
            sumSubSplitPercentages += _percentageToSplit[i];
        }
        if (sumSubSplitPercentages != BPS_DENOMINATOR) {
            revert("Sub-split percentages must sum to 100%");
        }

        for (uint256 i = 0; i < _addressToSplit.length; i++) {
            subSplits.push(
                SubSplitMetadata({
                    account: _addressToSplit[i],
                    percentage: _percentageToSplit[i],
                    amountToBeRetired: 0
                })
            );
            voter[_addressToSplit[i]] = VoterMetadata({
                hasVoted: 0x00,
                isAllowed: 0x01 // está permitido para votar
            });
        }

        percentageSplit = PercentageSplitMetadata({
            actual: _percentageToBeginSplit,
            max: _maxPercentageSplit,
            toIncrease: _toIncreasePercentageSplit
        });
        goalForIncreasePercentage = _goalForIncreasePercentage;
        creator = _creator;
        pricePerMint = _pricePerMint;
        tokenAddress = address(
            new NFT(address(this), _name, _symbol, _baseURI)
        );

        // si se establece como permanente, fuse se pone en 0
        fuse = setToPermanent ? bytes1(0x00) : bytes1(0x01); 
    }

    function makePayment(address _to) public payable {
        if (msg.sender == creator) {
            revert();
        }

        //validar si el monto es suficiente
        if (msg.value != pricePerMint) {
            revert();
        }

        // si todavía no se ha alcanzado el límite
        if (percentageSplit.actual < percentageSplit.max) {
            payCounter++; // incrementar el contador de pagos
            if (payCounter % goalForIncreasePercentage == 0) {
                // cada que se alcance el objetivo de pagos, aumentar el porcentaje
                percentageSplit.actual += percentageSplit.toIncrease; // aumentar el porcentaje
                payCounter = 0; // reiniciar el contador
            }
        }

        // calcular la cantidad para el creador
        amountToBeRetiredForCreator += getCreatorShare(msg.value);

        // calcular la cantidad para los sub-splits
        uint256[] memory calculatedShares = getAllSubSplitShares(msg.value);

        // comienza a dividir el monto entre los sub-splits
        for (uint256 i = 0; i < subSplits.length; i++) {
            subSplits[i].amountToBeRetired += calculatedShares[i];
        }

        // mintar el NFT
        NFT(tokenAddress).safeMint(_to);
    }

    // --- Funciones View de Cálculo ---

    /**
     * @notice Calcula la porción que le corresponde al dueño del link de referido (creador).
     * @param _totalAmount El monto total (en unidades atómicas del token) a dividir.
     * @return amountForCreator La cantidad (en unidades atómicas) para el creador.
     */
    function getCreatorShare(
        uint256 _totalAmount
    ) public view returns (uint256 amountForCreator) {
        // totalPercentageReferLink está en puntos base (ej: 1500 para 15.00%)
        amountForCreator =
            (_totalAmount * percentageSplit.actual) /
            BPS_DENOMINATOR;
        return amountForCreator;
    }

    /**
     * @notice Calcula las porciones para todos los integrantes del sub-split listados en `subSplits`.
     * Estas porciones se calculan sobre el monto restante DESPUÉS de la parte del creador.
     * @param _totalAmount El monto total (en unidades atómicas del token) a dividir.
     * @return calculatedShares Un array con las direcciones y las cantidades calculadas
     * para cada integrante del array `subSplits`.
     */
    function getAllSubSplitShares(
        uint256 _totalAmount
    ) public view returns (uint256[] memory calculatedShares) {
        // 1. Calcular cuánto se lleva el creador del link de referido.
        uint256 amountForCreator = getCreatorShare(_totalAmount);

        // 2. Determinar el monto restante que se dividirá entre los `subSplits`.
        uint256 remainingAmountForSubSplits = _totalAmount - amountForCreator;

        // Preparar el array de resultados.
        calculatedShares = new uint256[](subSplits.length);

        // 3. Iterar sobre la lista `subSplits` y calcular la parte de cada uno.
        for (uint256 i = 0; i < subSplits.length; i++) {
            SubSplitMetadata storage currentSubSplit = subSplits[i];

            // El `currentSubSplit.percentage` se aplica sobre el `remainingAmountForSubSplits`.
            uint256 individualShareAmount = (remainingAmountForSubSplits *
                currentSubSplit.percentage) / BPS_DENOMINATOR;

            calculatedShares[i] = individualShareAmount;
        }

        return calculatedShares;
    }

    // funciones de retiro

    function creatorWithdraw() public onlyOwner {
        (bool success, ) = creator.call{value: amountToBeRetiredForCreator}("");
        require(success, "Transfer failed.");
        amountToBeRetiredForCreator = 0;
    }

    function withdraw() public {
        for (uint256 i = 0; i < subSplits.length; i++) {
            (bool success, ) = subSplits[i].account.call{
                value: subSplits[i].amountToBeRetired
            }("");

            subSplits[i].amountToBeRetired = 0;
            if (!success) {
                revert("Transfer failed.");
            }
        }
    }

    // funciones de votación

    // votacion para explotar el fuse (id: 0x01)
    // es decir que las deciciones de 
    // - cambiar el porcentaje máximo de split
    // - aumentar el porcentaje de split
    // - cambiar el goalForIncreasePercentage
    // - cambiar el percentageSplit.toIncrease
    // ya no se puedan hacer y esta decisión es permanente
    
    function proposeExplodeFuse() external checkVoteFuse {

        if (ballotBox.decicionID != 0x00) {
            revert("There is already an ongoing vote.");
        }

        // el que esta ejecutando la votación se le permite votar
        if (!imAllowedToVote()) {
            revert("You are not allowed to cast a vote.");
        }

        ballotBox = BallotBoxMetadata({
            decicionID: 0x01, // id para la votación de explosión del fuse
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    function voteForExplodeFuse(bool approve) external {
        // verificar si el votante está permitido
        if (!imAllowedToVote()) {
            revert("You are not allowed to vote.");
        }

        // verificar si ya votó
        if (!userAlreadyVoted()) {
            revert("You have already voted.");
        }

        // marcar como votado
        voter[msg.sender].hasVoted = 0x01;

        // incrementar el total de votos
        ballotBox.totalOfVotes++;

        // incrementar la cantidad de votos a favor o en contra
        if (approve) {
            ballotBox.executeVoteAmount++;
        } else {
            ballotBox.cancelVoteAmount++;
        }
    }

    function executeExplodeFuse() external {
        if (ballotBox.decicionID != 0x01) {
            revert("There is no ongoing vote.");
        }
        // ver si se ha llegado al maximo de votos
        if (subSplits.length != ballotBox.totalOfVotes) {
            revert("Not enough votes to execute.");
        }
        // verificar si la votación fue exitosa
        if (ballotBox.executeVoteAmount == ballotBox.totalOfVotes) {
            // si se aprueba, se pone el fuse en 0 (explota el fuse)
            fuse = bytes1(0x00);
        }
        // reiniciar la votación
        ballotBox = BallotBoxMetadata({
            decicionID: 0x00,
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }


    // votaciones para aumentar el máximo porcentaje de split (id: 0x02)
    function proposeNewMaxPercentageSplit(
        uint16 newMaxPercentageSplit
    ) external checkVoteFuse {

        if (ballotBox.decicionID != 0x00) {
            revert("There is already an ongoing vote.");
        }

        // el que esta ejecutando la votación se le permite votar
        if (!imAllowedToVote()) {
            revert("You are not allowed to cast a vote.");
        }

        ballotBox = BallotBoxMetadata({
            decicionID: 0x02, // id para la votación de aumento de porcentaje
            proposal: uint256(newMaxPercentageSplit),
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    function voteForNewMaxPercentageSplit(bool approve) external {
        // verificar si el votante está permitido

        if (!imAllowedToVote()) {
            revert("You are not allowed to vote.");
        }

        // verificar si ya votó
        if (!userAlreadyVoted()) {
            revert("You have already voted.");
        }

        // marcar como votado
        voter[msg.sender].hasVoted = 0x01;

        // incrementar el total de votos
        ballotBox.totalOfVotes++;

        // incrementar la cantidad de votos a favor o en contra
        if (approve) {
            ballotBox.executeVoteAmount++;
        } else {
            ballotBox.cancelVoteAmount++;
        }
    }

    function executeNewMaxPercentageSplit() external {
        if (ballotBox.decicionID != 0x02) {
            revert("There is no ongoing vote.");
        }
        // ver si se ha llegado al maximo de votos
        if (subSplits.length != ballotBox.totalOfVotes) {
            revert("Not enough votes to execute.");
        }

        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        if (ballotBox.executeVoteAmount == ballotBox.totalOfVotes) {
            percentageSplit.max = uint16(ballotBox.proposal);
        }

        // reiniciar la votación
        ballotBox = BallotBoxMetadata({
            decicionID: 0x00,
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    // votaciones para cambiar el goalForIncreasePercentage (id: 0x03)
    function proposeNewGoalForIncreasePercentage(
        uint256 newGoalForIncreasePercentage
    ) external checkVoteFuse {


        if (ballotBox.decicionID != 0x00) {
            revert("There is already an ongoing vote.");
        }

        // el que esta ejecutando la votación se le permite votar
        if (!imAllowedToVote()) {
            revert("You are not allowed to cast a vote.");
        }

        ballotBox = BallotBoxMetadata({
            decicionID: 0x03, // id para la votación de cambio de goalForIncreasePercentage
            proposal: newGoalForIncreasePercentage,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    function voteForNewGoalForIncreasePercentage(bool approve) external {
        // verificar si el votante está permitido
        if (!imAllowedToVote()) {
            revert("You are not allowed to vote.");
        }

        // verificar si ya votó
        if (!userAlreadyVoted()) {
            revert("You have already voted.");
        }

        // marcar como votado
        voter[msg.sender].hasVoted = 0x01;

        // incrementar el total de votos
        ballotBox.totalOfVotes++;

        // incrementar la cantidad de votos a favor o en contra
        if (approve) {
            ballotBox.executeVoteAmount++;
        } else {
            ballotBox.cancelVoteAmount++;
        }
    }

    function executeNewGoalForIncreasePercentage() external {
        if (ballotBox.decicionID != 0x03) {
            revert("There is no ongoing vote.");
        }
        // ver si se ha llegado al maximo de votos
        if (subSplits.length != ballotBox.totalOfVotes) {
            revert("Not enough votes to execute.");
        }

        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        if (ballotBox.executeVoteAmount == ballotBox.totalOfVotes) {
            goalForIncreasePercentage = ballotBox.proposal;
        }

        // reiniciar la votación
        ballotBox = BallotBoxMetadata({
            decicionID: 0x00,
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    // votaciones para cambiar el percentageSplit.toIncrease por goal (id: 0x04)
    function proposeNewPercentageSplitToIncrease(
        uint16 newPercentageSplitToIncrease
    ) external checkVoteFuse {


        if (ballotBox.decicionID != 0x00) {
            revert("There is already an ongoing vote.");
        }

        // el que esta ejecutando la votación se le permite votar
        if (!imAllowedToVote()) {
            revert("You are not allowed to cast a vote.");
        }

        ballotBox = BallotBoxMetadata({
            decicionID: 0x04, // id para la votación de cambio de percentageSplit.toIncrease
            proposal: uint256(newPercentageSplitToIncrease),
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    function voteForNewPercentageSplitToIncrease(bool approve) external {
        // verificar si el votante está permitido
        if (!imAllowedToVote()) {
            revert("You are not allowed to vote.");
        }

        // verificar si ya votó
        if (!userAlreadyVoted()) {
            revert("You have already voted.");
        }

        // marcar como votado
        voter[msg.sender].hasVoted = 0x01;

        // incrementar el total de votos
        ballotBox.totalOfVotes++;

        // incrementar la cantidad de votos a favor o en contra
        if (approve) {
            ballotBox.executeVoteAmount++;
        } else {
            ballotBox.cancelVoteAmount++;
        }
    }

    function executeNewPercentageSplitToIncrease() external {
        if (ballotBox.decicionID != 0x04) {
            revert("There is no ongoing vote.");
        }
        // ver si se ha llegado al maximo de votos
        if (subSplits.length != ballotBox.totalOfVotes) {
            revert("Not enough votes to execute.");
        }

        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        if (ballotBox.executeVoteAmount == ballotBox.totalOfVotes) {
            percentageSplit.toIncrease = uint16(ballotBox.proposal);
        }

        // reiniciar la votación
        ballotBox = BallotBoxMetadata({
            decicionID: 0x00,
            proposal: 0,
            totalOfVotes: 0,
            executeVoteAmount: 0,
            cancelVoteAmount: 0
        });
    }

    // internal getters
    function userAlreadyVoted() internal view returns (bool) {
        return voter[msg.sender].hasVoted == 0x01;
    }

    

    // getters

    function imAllowedToVote() public view returns (bool) {
        return voter[msg.sender].isAllowed == 0x01;
    }

    
}

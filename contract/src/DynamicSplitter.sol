// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {VotingMechanism} from "./VotingMechanism.sol";
import {NFT} from "./NFT.sol";

contract DynamicSplitter is VotingMechanism {
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

    uint16 constant BPS_DENOMINATOR = 10000; // 100% in Basis Points

    PercentageSplitMetadata percentageSplit;

    uint256 pricePerMint;
    uint256 amountToBeRetiredForCreator;
    uint256 payCounter;
    uint256 goalForIncreasePercentage;

    address creator;
    address tokenAddress;

    SubSplitMetadata[] subSplits;

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
    ) VotingMechanism(setToPermanent, _addressToSplit) {
        uint256 sumSubSplitPercentages = 0;

        for (uint256 i = 0; i < _percentageToSplit.length; i++) {
            subSplits.push(
                SubSplitMetadata({
                    account: _addressToSplit[i],
                    percentage: _percentageToSplit[i],
                    amountToBeRetired: 0
                })
            );
            sumSubSplitPercentages += _percentageToSplit[i];
        }

        if (sumSubSplitPercentages != BPS_DENOMINATOR) {
            revert("Sub-split percentages must sum to 100%");
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

    function creatorWithdraw() public {
        if (msg.sender != creator) {
            revert("Only the creator can withdraw.");
        }
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

    // cuando se ha hecho una propuesta de votación se llama a esta función
    // para efectuar el sufrágio de la votación
    function voteProposal(bool answer) external {
        _vote(answer);
    }

    // votacion para explotar el fuse (id: 0x01)
    // es decir que las deciciones de
    // - cambiar el porcentaje máximo de split
    // - aumentar el porcentaje de split
    // - cambiar el goalForIncreasePercentage
    // - cambiar el percentageSplit.toIncrease
    // ya no se puedan hacer y esta decisión es permanente

    function proposeExplodeFuse() external {
        _proposeVote(0x01, 0);
    }

    function executeExplodeFuse() external {
        _execute(0x01);
    }

    // votaciones para aumentar el máximo porcentaje de split (id: 0x02)
    function proposeNewMaxPercentageSplit(
        uint16 newMaxPercentageSplit
    ) external {
        _proposeVote(0x02, uint256(newMaxPercentageSplit));
    }

    function executeNewMaxPercentageSplit() external {
        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        (bool answer, uint256 dataToChange) = _execute(0x02);
        if (answer) {
            percentageSplit.max = uint16(dataToChange);
        }
    }

    // votaciones para cambiar el goalForIncreasePercentage (id: 0x03)
    function proposeNewGoalForIncreasePercentage(
        uint256 newGoalForIncreasePercentage
    ) external {
        _proposeVote(0x03, newGoalForIncreasePercentage);
    }

    function executeNewGoalForIncreasePercentage() external {
        (bool answer, uint256 dataToChange) = _execute(0x03);
        if (answer) {
            goalForIncreasePercentage = dataToChange;
        }
    }

    // votaciones para cambiar el percentageSplit.toIncrease por goal (id: 0x04)
    function proposeNewPercentageSplitToIncrease(
        uint16 newPercentageSplitToIncrease
    ) external {
        _proposeVote(0x04, uint256(newPercentageSplitToIncrease));
    }

    function executeNewPercentageSplitToIncrease() external {
        // verificar si la votación fue exitosa si es asi se aumenta el porcentaje
        (bool answer, uint256 dataToChange) = _execute(0x02);
        if (answer) {
            percentageSplit.toIncrease = uint16(dataToChange);
        }
    }
}

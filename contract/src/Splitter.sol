// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {NFT} from "./NFT.sol";

contract Splitter is Ownable {
    struct SubSplitMetadata {
        address account;
        uint256 percentage;
        uint256 amountToBeRetired;
    }

    uint256 constant BPS_DENOMINATOR = 10000; // 100% in Basis Points
    uint256 private totalPercentageSplit;
    uint256 private payCounter;
    uint256 private pricePerMint;
    address private creator;
    SubSplitMetadata[] private subSplits;
    uint256 private amountToBeRetiredForCreator;
    address private tokenAddress;

    constructor(
        address[] memory _addressToSplit,
        uint256[] memory _percentageToSplit,
        address _creator,
        string memory _name,
        string memory _symbol,
        uint256 _pricePerMint
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
        }
        totalPercentageSplit = 1500; // 1500 para 15.00%
        creator = _creator;
        pricePerMint = _pricePerMint;
        tokenAddress = address(new NFT(address(this), _name, _symbol));
    }

    function makePayment(address _to) public payable {
        if (msg.sender == creator) {
            revert();
        }

        //validar si el monto es suficiente
        if (msg.value != pricePerMint) {
            revert();
        }

        // si todavía no se ha alcanzado el límite de 45%
        if (totalPercentageSplit < 4500) {
            payCounter++; // incrementar el contador de pagos
            if (payCounter % 7000 == 0) { // cada 7000 pagos
                totalPercentageSplit += 100; // aumentar el porcentaje en 1%
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
            (_totalAmount * totalPercentageSplit) /
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

    // getters
    function getSubSplits()
        public
        view
        returns (SubSplitMetadata[] memory)
    {
        return subSplits;
    }
    function getCreator() public view returns (address) {
        return creator;
    }
    function getPricePerMint() public view returns (uint256) {
        return pricePerMint;
    }
    function getTokenAddress() public view returns (address) {
        return tokenAddress;
    }
    function getTotalPercentageSplit() public view returns (uint256) {
        return totalPercentageSplit;
    }
    function getPayCounter() public view returns (uint256) {
        return payCounter;
    }
    function getAmountToBeRetiredForCreator() public view returns (uint256) {
        return amountToBeRetiredForCreator;
    }
    function getAmountToBeRetiredForSubSplit(
        uint256 index
    ) public view returns (uint256) {
        return subSplits[index].amountToBeRetired;
    }
    function getSubSplitAccount(
        uint256 index
    ) public view returns (address) {
        return subSplits[index].account;
    }
    function getSubSplitPercentage(
        uint256 index
    ) public view returns (uint256) {
        return subSplits[index].percentage;
    }
    function getSubSplitAmountToBeRetired(
        uint256 index
    ) public view returns (uint256) {
        return subSplits[index].amountToBeRetired;
    }
    function getSubSplitLength() public view returns (uint256) {
        return subSplits.length;
    }

}

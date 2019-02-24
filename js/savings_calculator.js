"use strict";

/**
 * Savings Account class
 * @author Sergio Berlinches
 */
class savingsAccount {

    /**
     * @param amountDeposit The amount to deposit
     * @param marginalTaxRate The income tax rate
     * @param taxRateWithdrawal The average tax rate for withdrawal (RRSP)
     * @param yearsInvestment The number of years of the investment
     * @param nominalRate The rate at which the invested money grows per year
     * @param inflationRate The expected rate of inflation per year
     * @param periodsNumber
     * @param precision
     */
    constructor(amountDeposit, marginalTaxRate, taxRateWithdrawal, yearsInvestment, nominalRate, inflationRate, periodsNumber = 12, precision = 2) {

        if (this.constructor === savingsAccount)
            throw new TypeError('Abstract class "savingsAccount" cannot be instantiated directly.');

        this._amountDeposit     = Number(amountDeposit);
        this._marginalTaxRate   = Number(marginalTaxRate);
        this._taxRateWithdrawal = Number(taxRateWithdrawal);
        this._yearsInvestment   = Number(yearsInvestment);
        this._nominalRate       = Number(nominalRate);
        this._inflationRate     = Number(inflationRate);
        this._numberOfPeriods   = Number(periodsNumber);
        this._precision         = Number(precision);
        this._netContribution   = null;
        this._futureValue       = null;
        this._netWithdrawal     = null;
    }

    /**
     * Returns the invested amount after taxes (If applicable)
     * @returns {number}
     * @public
     */
    get netContribution() {
        return roundNumber(this._netContribution, this._precision);
    }

    /**
     * Returns the future value of the savings at the end of the
     * investment period
     * @returns {number}
     * @public
     */
    get futureValue() {
        return roundNumber(this._futureValue, this._precision);
    }

    /**
     * Returns the invested amount to be withdrawn after taxes
     * (If applicable)
     * @returns {number}
     * @public
     */
    get netWithdrawal() {
        return roundNumber(this._netWithdrawal, this._precision);
    }

    /**
     * Calculates the future value of the savings at the end of the investment
     * period
     * @returns {number}
     * @protected
     */
    _calcFutureValue() {
        return this._netContribution * Math.pow((1 + this._calcRateOfReturn()/this._numberOfPeriods), this._numberOfPeriods * this._yearsInvestment);
    }

    /**
     * Calculates the return on an investment after adjusting for inflation
     * @returns {number}
     * @private
     */
    _calcRateOfReturn() {
        return ((1 + this._nominalRate/100) / (1 + this._inflationRate/100)) - 1;
    }
}

/**
 * TFSA (Tax-Free Savings Account) class
 * @author Sergio Berlinches
 */
class TFSA extends savingsAccount {

    constructor(amountDeposit, marginalTaxRate, yearsInvestment, nominalRate, inflationRate, periodsNumber, precision) {
        super(amountDeposit, marginalTaxRate, null, yearsInvestment, nominalRate, inflationRate, periodsNumber, precision);

        this._taxContribution   = this._calcTaxContribution();
        super._netContribution  = this._calcNetContribution();
        super._futureValue      = this._calcFutureValue();
        super._netWithdrawal    = this._futureValue;
    }

    /**
     * Returns the calculated tax over the invested amount
     * @returns {number}
     * @public
     */
    get taxContribution() {
        return roundNumber(this._taxContribution, this._precision);
    }

    /**
     * Calculates the tax over the invested amount
     * @returns {number}
     * @private
     */
    _calcTaxContribution() {
        return (this._marginalTaxRate * this._amountDeposit) / 100;
    }

    /**
     * Calculates the invested amount after taxes
     * @returns {number}
     * @private
     */
    _calcNetContribution() {
        return this._amountDeposit - this._taxContribution;
    }
}


/**
 * RRSP (Registered Retirement Savings Plan) class
 * @author Sergio Berlinches
 */
class RRSP extends savingsAccount {

    constructor(amountDeposit, taxRateWithdrawal, yearsInvestment, nominalRate, inflationRate, periodsNumber, precision) {
        super(amountDeposit, null, taxRateWithdrawal, yearsInvestment, nominalRate, inflationRate, periodsNumber, precision);

        super._netContribution  = this._amountDeposit;
        super._futureValue      = this._calcFutureValue();
        this._taxUponWithdrawal = this._calcTaxUponWithdrawal();
        super._netWithdrawal    = this._calcNetWithdrawal();
    }

    /**
     * Returns the calculated tax over the invested amount
     * @returns {number}
     * @public
     */
    get taxUponWithdrawal() {
        return roundNumber(this._taxUponWithdrawal, this._precision);
    }

    /**
     * Calculates the tax over the invested amount
     * @returns {number}
     * @private
     */
    _calcTaxUponWithdrawal() {
        return (this._futureValue * this._taxRateWithdrawal) / 100;
    }

    /**
     * Calculates the invested amount after taxes
     * @returns {number}
     * @private
     */
    _calcNetWithdrawal() {
        return this._futureValue - this._taxUponWithdrawal;
    }
}


/**
 *
 * @param num
 * @param pos
 * @returns {number}
 */
function roundNumber(num, pos = 2) {
    return Math.round( num * eval('1e' + pos) ) / eval('1e' + pos);
}

// Export classes to be used in spec testing file
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        RRSP: RRSP,
        TFSA: TFSA
    }
}

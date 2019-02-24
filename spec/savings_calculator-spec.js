const { RRSP, TFSA } = require("../js/savings_calculator");

const amountDeposit     = 1000;
const marginalTaxRate   = 40;
const taxRateWithdrawal = 40;
const yearsInvestment   = 20;
const nominalRate       = 6;
const inflationRate     = 0.15;

describe("TFSA", function () {

    const tfsa = new TFSA(amountDeposit, marginalTaxRate, yearsInvestment, nominalRate, inflationRate);

    it("Tax contribution", function () {
        expect(tfsa.taxContribution).toBe(400);
    });

    it("Net contribution", function () {
        expect(tfsa.netContribution).toBe(600);
    });

    it("Future value", function () {
        expect(tfsa.futureValue).toBe(1924.35);
    });

    it("Net withdrawal", function () {
        expect(tfsa.netWithdrawal).toBe(1924.35);
    });
});

describe("RRSP", function () {

    const rrsp = new RRSP(amountDeposit, taxRateWithdrawal, yearsInvestment, nominalRate, inflationRate);

    it("Net contribution", function () {
        expect(rrsp.netContribution).toBe(1000);
    });

    it("Future value", function () {
        expect(rrsp.futureValue).toBe(3207.25);
    });

    it("Tax upon withdrawal", function () {
        expect(rrsp.taxUponWithdrawal).toBe(1282.9);
    });

    it("Net withdrawal", function () {
        expect(rrsp.netWithdrawal).toBe(1924.35);
    });
});


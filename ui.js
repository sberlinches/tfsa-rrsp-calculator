"use strict";

document.getElementById('button_submit')
    .addEventListener('click', (e) => {

    const form = document.getElementById('info');

    if(form.checkValidity()) {

        e.preventDefault();

        const amountDeposit     = form.elements.namedItem('amount_deposit').value;
        const marginalTaxRate   = form.elements.namedItem('marginal_tax_rate').value;
        const taxRateWithdrawal = form.elements.namedItem('tax_rate_withdrawal').value;
        const yearsInvestment   = form.elements.namedItem('years_investment').value;
        const nominalRate       = form.elements.namedItem('nominal_rate').value;
        const inflationRate     = form.elements.namedItem('inflation_rate').value;
        const periodsNumber     = 12;
        const precision         = 0;
        const tfsa = new TFSA(amountDeposit, marginalTaxRate, yearsInvestment, nominalRate, inflationRate, periodsNumber, precision);
        const rrsp = new RRSP(amountDeposit, taxRateWithdrawal, yearsInvestment, nominalRate, inflationRate, periodsNumber, precision);

        document.getElementById('table').innerHTML = `<table>
            <tr>
                <th></th>
                <th>TFSA</th>
                <th>RRSP</th>
            </tr>
            <tr>
                <td>Amount</td>
                <td>$${amountDeposit}</td>
                <td>$${amountDeposit}</td>
            </tr>
            <tr>
                <td>Tax (${marginalTaxRate}%)</td>
                <td>$${tfsa.taxContribution}</td>
                <td>$0</td>
            </tr>
            <tr>
                <td>Net contribution</td>
                <td>$${tfsa.netContribution}</td>
                <td>$${rrsp.netContribution}</td>
            </tr>
            <tr>
                <td>Future value ${yearsInvestment}yr @ ${nominalRate}%</td>
                <td>$${tfsa.futureValue}</td>
                <td>$${rrsp.futureValue}</td>
            </tr>
            <tr>
                <td>Tax upon withdrawal (${taxRateWithdrawal}%)</td>
                <td>$0</td>
                <td>$${rrsp.taxUponWithdrawal}</td>
            </tr>
            <tr>
                <td>Net withdrawal</td>
                <td>$${tfsa.netWithdrawal}</td>
                <td>$${rrsp.netWithdrawal}</td>
            </tr>
        </table>`;
    }
});
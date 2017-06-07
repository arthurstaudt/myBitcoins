/**
 * Format number to real money
 * @param value
 * @returns {string}
 */
function formatValue(value) {
    return 'R$ ' + value.toFixed(2).replace('.',',');
}

/**
 * Format percentage label (positive or negative)
 * @param firstValue
 * @param SecondValue
 * @returns {string}
 */
function getPercentageHtmlString(firstValue, SecondValue) {
    var value = ((1-firstValue/SecondValue)*100).toFixed(2),
        classLabel = value > 0 ? 'success' : 'danger';

    return '<span class="label label-' + classLabel + '">' + value + '%</span>';
}

/**
 * Exec when open the popup
 */
document.addEventListener('DOMContentLoaded', function() {

    /**
     * Call to mercado bitcoin api
     */
    $.ajax({
        method: "GET",
        url: "https://www.mercadobitcoin.net/api/v2/ticker/",
        typeData: 'json'
    }).done(function (data) {
        var response = $.parseJSON(data),
            ticker = response.ticker,
            invested = 1022,
            //invested = 100, // Exemple with R$ 100,00
            myBiticoins = 0.10636,
            // myBiticoins = 0.01317241, // Exemple with R$ 100,00
            current = (myBiticoins * ticker.sell),
            changeTaxe = current * 0.007, // 0,70%
            change = current - changeTaxe,
            pushTaxe = (change * 0.0199) + 2.90, // 1,99% + R$ 2,90
            push = change - pushTaxe;

        /**
         * Set the LIVE values
         */
        $('#buy').text(formatValue(ticker.buy));
        $('#sell').text(formatValue(ticker.sell));
        $('#invested').text(formatValue(invested));
        $('#current').text(formatValue(current));
        $('#changeTaxe').text(formatValue(changeTaxe));
        $('#change').text(formatValue(change));
        $('#changeWin').html(formatValue(change - invested)).prev().append(' ' + getPercentageHtmlString(invested, change));
        $('#pushTaxe').text(formatValue(pushTaxe));
        $('#push').text(formatValue(push));
        $('#pushWin').html(formatValue(push - invested)).prev().append(' ' + getPercentageHtmlString(invested, push));
    });
});

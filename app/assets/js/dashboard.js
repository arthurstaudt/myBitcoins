/**
 * Format number to bitcoin
 * @param value
 * @returns {string}
 */
function formatBitcoinValue(value) {
    return '฿' + value.toString().replace('.',',');
}

/**
 * Format number to real money
 * @param value
 * @returns {string}
 */
function formatRealValue(value) {
    return 'R$' + value.toFixed(2).replace('.',',');
}

/**
 * Format percentage label (positive or negative)
 * @param invested
 * @param current
 * @returns {string}
 */
function getPercentageHtmlString(invested, current) {
    var value = (((current - invested) / invested) * 100).toFixed(2),
        classLabel = value > 0 ? 'success' : 'danger';

    return '<span class="label label-' + classLabel + '">' + value + '%</span>';
}

/**
 * Set blue label for bitcoins
 * @param value
 * @returns {string}
 */
function bitcoinLabel(value) {
    return '<span class="label label-primary">' + value + '</span>';
}

/**
 * Set red label for taxes
 * @param value
 * @returns {string}
 */
function taxesLabel(value) {
    return '<span class="label label-danger">' + value + '</span>';
}

/**
 * Set gray label for reals
 * @param value
 * @returns {string}
 */
function realLabel(value) {
    return '<span class="label label-default">' + value + '</span>';
}

/**
 * Exec when open the popup
 */
document.addEventListener('DOMContentLoaded', function() {

    $.when(MercadoBitcoinCaller()).then(function(result) {
        var data = calcTransactions(result);

        updateIconData(data.percente, data.stringPercent);

        /**
         * Set the LIVE values
         */
        $('#buy').text(formatRealValue(data.ticker.buy));
        $('#sell').text(formatRealValue(data.ticker.sell));
        $('#invested').text(formatRealValue(data.invested));
        $('#current').text(formatRealValue(data.current));

        $('#my-bitcoins').html(bitcoinLabel(formatBitcoinValue(data.myBiticoins)));
        $('#change-taxe').html(taxesLabel(formatBitcoinValue(data.changeBitcoinTaxe)));
        $('#change').html(realLabel(formatRealValue(data.change)));
        $('#push-taxe').html(taxesLabel(formatRealValue(data.pushTaxe)));
        $('#push').html(realLabel(formatRealValue(data.push)));

        $('#change-win').prepend(formatRealValue(data.change)).find('.infos').append(formatRealValue(data.change - data.invested) + '<br/>' + getPercentageHtmlString(data.invested, data.change));
        $('#push-win').prepend(formatRealValue(data.push)).find('.infos').append(formatRealValue(data.push - data.invested) + '<br/>' + getPercentageHtmlString(data.invested, data.push));
    });

    $('.up-down').click(function(){
        var $history = $('#history');
        $(this).addClass('glyphicon-chevron-up').removeClass('glyphicon-chevron-down');
        if ($history.is(':visible')) {
            $(this).addClass('glyphicon-chevron-down').removeClass('glyphicon-chevron-up');
        }
        $history.toggle();
    });
});

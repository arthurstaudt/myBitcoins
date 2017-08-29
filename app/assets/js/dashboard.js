/**
 * Format number to bitcoin
 * @param value
 * @returns {string}
 */
function formatBitcoinValue(value) {
    if (value === 0) return "\u20BF 0,00000";
    return "\u20BF" + value.toString().replace('.',',');
}

/**
 * Format number to real money
 * @param value
 * @returns {string}
 */
function formatRealValue(value) {
    if (value === 0) return 'R$ 0,00';
    return 'R$' + value.toFixed(2).replace('.',',');
}

/**
 * Format percentage label (positive or negative)
 * @param invested
 * @param current
 * @returns {string}
 */
function getPercentageHtmlString(invested, current) {
    if (invested === 0) return '<span class="label label-default">- %</span>';;
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
    /**
     * Load ENV data
     */
    $.ajax('env.json').done(function (data) {
        var result = $.parseJSON(data),
        identifier = result.tapi_id,
        secret = result.secret,
        mb = new MercadoBitcoin(identifier, secret);

        mb.get_account_info(function(info){
            var balance = info.response_data.balance,
                bitcoin = balance.btc.available || 0,
                real = balance.brl.available || 0;

            $.when(MercadoBitcoinCaller()).then(function(result) {
                var data = calcTransactions(result, bitcoin, real);

                if (bitcoin > 0.00001 && real > 0.01) {
                    updateIconData(data.percente, data.stringPercent);
                }

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
        });
    });
});

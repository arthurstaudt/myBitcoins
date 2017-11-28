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
    if (parseFloat(value) === 0) return 'R$ 0,00';
    return 'R$' + parseFloat(value).toFixed(2).replace('.',',');
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
                bitcoin = balance.btc.available || 0;

            $.when(MercadoBitcoinCaller()).then(function(result) {
                var data = calcTransactions(result, bitcoin);

                updateIconData(result.ticker.buy);

                /**
                 * Set the LIVE values
                 */
                $('#buy').text(formatRealValue(data.ticker.buy));
                $('#sell').text(formatRealValue(data.ticker.sell));
                $('#current').text(formatRealValue(data.current));

                $('#my-bitcoins').html(bitcoinLabel(formatBitcoinValue(data.myBiticoins)));
                $('#change-taxe').html(taxesLabel(formatBitcoinValue(data.changeBitcoinTaxe)));
                $('#change').html(realLabel(formatRealValue(data.change)));
                $('#push-taxe').html(taxesLabel(formatRealValue(data.pushTaxe)));
                $('#push').html(realLabel(formatRealValue(data.push)));
                $('#change-win').html(formatRealValue(data.change));
                $('#push-win').html(formatRealValue(data.push));
            });
        });
    });
});

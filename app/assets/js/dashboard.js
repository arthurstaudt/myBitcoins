/**
 * Format number to bitcoin
 * @param value
 * @returns {string}
 */
function formatBitcoinValue(value) {
    if (value === 0) return "\u20BF 0,0000000";
    return "\u20BF " + value.toFixed(7).toString().replace('.',',');
}

/**
 * Format number to real money
 * @param value
 * @returns {string}
 */
function formatRealValue(value) {
    if (parseFloat(value) === 0) return 'R$ 0,00';
    return 'R$ ' + parseFloat(value).toFixed(2).replace('.',',').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
}


/**
 * Format number to percent
 * @param value
 * @param initialValue
 * @returns {string}
 */
function percentResult(value, initialValue) {
    if (parseFloat(value) === 0) return greenLabel('0,00%');
    value = (100 - (((parseFloat(value)) / initialValue) * 100)) * -1;

    if (value < 0) {
        return redLabel(value.toFixed(2).replace('.',',') + "%");
    }
    return greenLabel(value.toFixed(2).replace('.',',') + "%");
}

/**
 * Set blue label for bitcoins
 * @param value
 * @returns {string}
 */
function greenLabel(value) {
    return '<span class="label label-success">' + value + '</span>';
}

/**
 * Set red label for taxes
 * @param value
 * @returns {string}
 */
function redLabel(value) {
    return '<span class="label label-danger">' + value + '</span>';
}

/**
 * Set gray label for reals
 * @param value
 * @returns {string}
 */
function blueLabel(value) {
    return '<span class="label label-primary">' + value + '</span>';
}

function simpleCalculate(data) {
    var initialValue = $('#pure-initial-value').val();

    $('#calc-results').removeClass('hide');
    $('#calc-change-win').html(blueLabel(formatRealValue(data.change)));
    $('#calc-change-win-percent').html(percentResult(data.change, initialValue));
    $('#calc-push-win').html(blueLabel(formatRealValue(data.push)));
    $('#calc-push-win-percent').html(percentResult(data.push, initialValue));
}

function MBinfo(info) {
    if (info.status_code !== 100) {
        chrome.notifications.create('warning', {
            type: 'basic',
            iconUrl: 'assets/images/icon48.png',
            title: 'Alerta!',
            message: info.error_message
        }, function(notificationId) {});
        return false;
    }

    var balance = info.response_data.balance,
        bitcoin = balance.btc.available || 0;

    $.when(MercadoBitcoinCaller()).then(function(result) {
        var data = calcTransactions(result, bitcoin);

        lastCalc = data;

        updateIconData(result.ticker.buy);

        /**
         * Set the LIVE values
         */
        $('#buy').text(formatRealValue(data.ticker.buy));
        $('#sell').text(formatRealValue(data.ticker.sell));
        $('#current').text(formatRealValue(data.current));

        $('#my-bitcoins').html(greenLabel(formatBitcoinValue(data.myBiticoins)));
        $('#change-taxe').html(redLabel(formatBitcoinValue(data.changeBitcoinTaxe)));
        $('#change-taxe-real').html(redLabel("Taxa: Aprox. " + formatRealValue(data.ticker.sell * data.changeBitcoinTaxe)));
        $('#push-taxe-real').html(redLabel("Taxa: 1,99% + R$ 2,90"));
        $('#change').html(blueLabel(formatRealValue(data.change)));
        $('#push-taxe').html(redLabel(formatRealValue(data.pushTaxe)));
        $('#push').html(blueLabel(formatRealValue(data.push)));
        $('#change-win').html(formatRealValue(data.change));
        $('#push-win').html(formatRealValue(data.push));
    });
}

var accountInfo = {},
    lastBuy = 0,
    lastCalc = {};

/**
 * Exec when open the popup
 */
document.addEventListener('DOMContentLoaded', function() {
    /**
     * Load ENV data
     */
    $.ajax('env.json').done(function (data) {
        var result = typeof data !== 'object' ? $.parseJSON(data) : data,
        identifier = result.tapi_id,
        secret = result.secret,
        mb = new MercadoBitcoin(identifier, secret);

        mb.get_account_info(function(info){
            accountInfo = info;
            MBinfo(info);
        });

        setTimeout(function() {
            mb.list_orders(function (list) {
                if (list.response_data.orders) {
                    var alreadyGet = false;

                    $.each(list.response_data.orders, function (key, order) {
                        if (order.order_type == 1 && alreadyGet == false) {
                            alreadyGet = true;
                            lastBuy = order.quantity * order.limit_price;
                        }
                    });

                    $('#pure-initial-value').val(lastBuy);
                    $('#initial-value').val(formatRealValue(lastBuy));
                    simpleCalculate(lastCalc);
                }
            }, 'BRLBTC', {
                'status_list': '[4]',
                'has_fills': true
            });
        }, 1000);

    });
});

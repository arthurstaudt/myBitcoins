var urlData = "https://www.mercadobitcoin.net/api/v2/ticker/",
    urlTAPI = "https://www.mercadobitcoin.net/tapi/v3/",
    identifier = "",
    secret = "",
    pin = "";

/**
 *
 * @returns {*}
 * @constructor
 */
function MercadoBitcoinCaller() {
    var dfd = $.Deferred();

    $.ajax({
        method: "GET",
        url: urlData,
        typeData: 'json',
        cache: false
    }).done(function (data) {
        dfd.resolve($.parseJSON(data));
    }).fail(function () {
        dfd.reject({});
    });

    return dfd.promise();
}

/**
 *
 * @param data
 * @returns {{invested: number, myBiticoins: number, changeBitcoinTaxe: number, current: number, changeTaxe: number, change: number, pushTaxe: number, push: number, percente: number, stringPercent: number, ticker: {}}}
 */
function calcTransactions(data) {
    var result = {
        invested: 0,
        myBiticoins: 0,
        changeBitcoinTaxe: 0,
        current: 0,
        changeTaxe: 0,
        change: 0,
        pushTaxe: 0,
        push: 0,
        percente: 0,
        stringPercent: 0,
        ticker: {}
    };

    if (typeof data.ticker === "object") {
        result.invested = 1022;
        result.myBiticoins = 0.10636;
        result.changeBitcoinTaxe = result.myBiticoins * 0.007; // 0,70%
        result.current = (result.myBiticoins * data.ticker.buy);
        result.changeTaxe = result.current * 0.007; // 0,70%
        result.change = result.current - result.changeTaxe;
        result.pushTaxe = (result.change * 0.0199) + 2.90; // 1,99% + R$ 2,90
        result.push = result.change - result.pushTaxe;
        result.percente = ((result.push - result.invested) / result.invested) * 100;
        result.stringPercent = result.percente > 9 || result.percente < -9 ? result.percente.toFixed(0) : result.percente.toFixed(1);
        result.ticker = data.ticker;
    }

    return result;
}

/**
 *
 * @param percente
 * @param string
 */
function updateIconData(percente, string) {
    chrome.browserAction.setBadgeBackgroundColor({color: (percente > 0 ? '#009800' : '#ff0000')});
    chrome.browserAction.setBadgeText({text: Math.abs(string) + '%'});
}

/**
 * Update data
 */
function reloadValues() {
    /**
     * Update icon data
     */
    $.when(MercadoBitcoinCaller()).then(function (result) {
        var data = calcTransactions(result);
        updateIconData(data.percente, data.stringPercent);
    });
}

function testApi() {
    var tapi_nonce = Math.round(new Date().getTime() / 1000),
        tapi_mac = CryptoJS.HmacSHA512('/tapi/v3/?tapi_method=list_orders&tapi_nonce='+tapi_nonce, secret).toString(),
        settings = {
            "url": urlTAPI,
            "method": "POST",
            "headers": {
                "tapi-id": identifier,
                "tapi-mac": tapi_mac,
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": {
                "tapi_nonce": tapi_nonce,
                "tapi_method": "list_orders"
            }
        };

    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

/**
 * When chrome open starts
 */
chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {

        /**
         * Load ENV data
         */
        $.ajax('env.json').done(function (data) {
            var result = $.parseJSON(data);
            identifier = result.tapi_id;
            secret = result.secret;
            pin = result.pin;

            testApi();
        });

        /**
         * Call the first time
         */
        reloadValues();

        /**
         * Call every minute
         */
        setInterval(reloadValues, 30 * 1000);
    });
});
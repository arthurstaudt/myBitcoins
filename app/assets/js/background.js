var urlData = "https://www.mercadobitcoin.net/api/v2/ticker/",
    identifier = "",
    secret = "",
    balance = [];

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
 * @param currentBitcoin
 * @returns {{myBiticoins: number, changeBitcoinTaxe: number, current: number, changeTaxe: number, change: number, pushTaxe: number, push: number, percente: number, stringPercent: number, ticker: {}}}
 */
function calcTransactions(data, currentBitcoin) {
    var result = {
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

    currentBitcoin = Number(currentBitcoin).toFixed(5) > 0.00001 ? Number(currentBitcoin).toFixed(5) : 0;

    if (typeof data.ticker === "object") {
        result.myBiticoins = currentBitcoin;

        if (currentBitcoin > 0) {
            result.changeBitcoinTaxe = result.myBiticoins * 0.007; // 0,70%
            result.changeBitcoinTaxe = result.changeBitcoinTaxe.toFixed(5);
            result.current = result.myBiticoins * data.ticker.buy;
            result.current.toFixed(5);
            result.changeTaxe = result.current * 0.007; // 0,70%
            result.change = result.current - result.changeTaxe;
            result.pushTaxe = (result.change * 0.0199) + 2.90; // 1,99% + R$ 2,90
            result.push = result.change - result.pushTaxe;
        }

        result.ticker = data.ticker;
    }

    return result;
}

/**
 * @param buy
 */
function updateIconData(buy) {
    chrome.browserAction.setBadgeBackgroundColor({color: '#999999'});
    chrome.browserAction.setBadgeText({text: buy.toString().substr(0, 2) + '.' + buy.toString().substr(2, 1)});
}

/**
 * Get Balance
 */
function getBalance() {
    var mb = new MercadoBitcoin(identifier, secret);

    mb.get_account_info(function(info) {
        balance = info.response_data.balance;
        reloadValues();
    });
}

/**
 * Update data
 */
function reloadValues() {
    $.when(MercadoBitcoinCaller()).then(function(result){
        updateIconData(result.ticker.buy);
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

            /**
             * Call the first time
             */
            getBalance();

            /**
             * Call every minute
             */
            setInterval(reloadValues, 30 * 1000);
        });
    });
});
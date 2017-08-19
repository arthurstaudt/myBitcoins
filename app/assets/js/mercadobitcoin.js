var MercadoBitcoin = function (key, secret) {
    this.key = key;
    this.secret = secret;

    this.url = 'https://www.mercadobitcoin.net';
    this.uri = '/tapi/v3/'
    this.timeout = 5000;
};

MercadoBitcoin.prototype.postRequest = function(method, params, callback) {

    // Verifies if the user has provided the key and the secret
    if (!this.key || !this.secret)
        return callback('You must provide the key and the secret to make requests.');

    // Enrich the parameters with the method and nonce
    params = $.extend(params, {
        tapi_method: method,
        tapi_nonce: parseInt(new Date().getTime() / 1000)
    });

    var paramString = $.param(params),
        hmacString = '/tapi/v3/?' + paramString,
        hmac = CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA512, this.secret),
        options = {
            "url": this.url + this.uri,
            "timeout" : this.timeout,
            "headers": {
                "tapi-id": this.key,
                "tapi-mac": hmac.update(hmacString).finalize().toString(),
                "content-type": "application/x-www-form-urlencoded"
            },
            "data": params
        };

    var req = $.post(options).done(function(response) {
        if (typeof callback === 'function') {
            callback(response);
        }
    }).fail(function(error) {
        if (typeof callback === 'function') {
            callback(new Error('Error in server response: ' + error));
            return;
        }
    });

    return req;
};

// list_system_messages
MercadoBitcoin.prototype.list_system_messages = function(callback, level) {

    var params = {};

    if (level !== undefined) {
        params = { level: level };
    }

    this.postRequest('list_system_messages', params, callback);
};

// get_account_info
MercadoBitcoin.prototype.get_account_info = function(callback) {
    this.postRequest('get_account_info', {}, callback);
};

// get_order
MercadoBitcoin.prototype.get_order = function(callback, coin_pair, order_id) {

    if (coin_pair === undefined || order_id === undefined) {
        callback(new Error('You must inform coin_pair and order_id.'));
    }

    var params = {
        coin_pair: coin_pair,
        order_id: order_id
    };

    this.postRequest('get_order', params, callback);
};

// list_orders
MercadoBitcoin.prototype.list_orders = function(callback, coin_pair, params) {

    if (coin_pair === undefined) {
        callback(new Error('You must inform coin_pair.'));
    }

    var params = $.extend(params, {
        coin_pair: coin_pair
    });

    this.postRequest('list_orders', params, callback);
};

// list_orderbook
MercadoBitcoin.prototype.list_orderbook = function(callback, coin_pair, full) {

    if (coin_pair === undefined) {
        callback(new Error('You must inform coin_pair.'));
    }

    var params = {
        coin_pair: coin_pair
    };

    if (full !== undefined) {
        params = $.extend(params, {
            full: full
        });
    }

    this.postRequest('list_orderbook', params, callback);
};

// place_buy_order
MercadoBitcoin.prototype.place_buy_order = function(callback, coin_pair, quantity, limit_price) {

    if (coin_pair === undefined || quantity === undefined || limit_price === undefined) {
        callback(new Error('You must inform coin_pair, quantity and limit_price.'));
    }

    var params = {
        coin_pair: coin_pair,
        quantity: quantity,
        limit_price: limit_price
    };

    this.postRequest('place_buy_order', params, callback);
};

// place_sell_order
MercadoBitcoin.prototype.place_sell_order = function(callback, coin_pair, quantity, limit_price) {

    if (coin_pair === undefined || quantity === undefined || limit_price === undefined) {
        callback(new Error('You must inform coin_pair, quantity and limit_price.'));
    }

    var params = {
        coin_pair: coin_pair,
        quantity: quantity,
        limit_price: limit_price
    };

    this.postRequest('place_sell_order', params, callback);
};

// cancel_order
MercadoBitcoin.prototype.cancel_order = function(callback, coin_pair, order_id) {

    if (coin_pair === undefined || order_id === undefined) {
        callback(new Error('You must inform coin_pair and order_id.'));
    }

    var params = {
        coin_pair: coin_pair,
        order_id: order_id
    };

    this.postRequest('cancel_order', params, callback);
};

// get_withdrawal
MercadoBitcoin.prototype.get_withdrawal = function(callback, coin, withdrawal_id) {

    if (coin === undefined || withdrawal_id === undefined) {
        callback(new Error('You must inform coin and withdrawal_id.'));
    }

    var params = {
        coin: coin,
        withdrawal_id: withdrawal_id
    };

    this.postRequest('get_withdrawal', params, callback);
};

// withdraw_coin
MercadoBitcoin.prototype.withdraw_coin = function(callback, coin, quantity, destiny, description) {

    if (coin === undefined || quantity === undefined || destiny === undefined) {
        callback(new Error('You must inform coin, quantity and destiny.'));
    }

    var params = {
        coin: coin,
        quantity: quantity,
        destiny: destiny
    };

    if (description !== undefined) {
        params = $.extend(params, {
            description: description
        });
    }

    this.postRequest('withdraw_coin', params, callback);
};
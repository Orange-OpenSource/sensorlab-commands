/**
 *
 * Sensorlab2 commands service.
 * `author`	:	Quentin Lampin <quentin.lampin@orange.com>
 * `license`	:	MPL
 * `date`		:	2016/03/17
 * Copyright 2016 Orange
 *
 * returns a commands set to pilot an observer, provided its host and port.
 * If the third argument (promise) is set to `true` then commands return `Q` promises.
 * Otherwise, commands call supplied callbacks on completion or error (onSuccess, onError)
 */

/**
 *
 * @param {String} host - the observer's API host
 * @param {(String|Number)}port - the observer's API port
 * @param {Boolean} promise - using Q promises
 * @returns {*}
 */
var factory = function(host, port, promise){
    'use strict';

    /* node modules dependencies */
    var log = require('debug')('sensorlab-commands'),
        request = require('request'),
        Q = require('q');

    var partials,
        commands,
        commandsWithPromises;

    function generic(target, command, onSuccess, onError, parameters) {
        var req,
            callback;

        req = {};

        req.url = 'http://' + host + ':' + port + '/';
        if (typeof target === 'string' && target !== '') {
            req.url += target + '/';
        }
        if (typeof  command === 'string') {
            req.url += command;
        }

        req.method = !parameters ? 'GET' : 'POST';

        req.formData = parameters ? parameters : undefined;

        callback = function (error, response, body) {
            log('command ', req, ' callback with (error: ', error, ' response: ', response, ' body: ', body);
            if (!error && response.statusCode == 200) {
                onSuccess(JSON.parse(body));
            } else {
                onError(error, response, body);
            }
        };
        log('command: ', req);
        request(req, callback);
    }

    partials = {
        root: generic.bind(null, ''),
        node: generic.bind(null, 'node'),
        experiment: generic.bind(null, 'experiment'),
        location: generic.bind(null, 'location'),
        io: generic.bind(null, 'io')
    };

    commands = {
        root: {
            /**
             * request the observer's status
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            status: function (onSuccess, onError) {
                partials.root('status', onSuccess, onError);
            }
        },
        node: {
            /**
             * setup the observer's node module
             * @param {File} profile
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            setup: function (profile, onSuccess, onError) {
                partials.node('setup', onSuccess, onError, {'profile': profile})
            },
            /**
             * init the observer's node module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            init: function (onSuccess, onError) {
                partials.node('init', onSuccess, onError)
            },
            /**
             * load a firmware in the observer's node
             * @param {String} firmwareId
             * @param {File} firmware
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            load: function (firmwareId, firmware, onSuccess, onError) {
                partials.node('load', onSuccess, onError, {'firmware_id': firmwareId, 'firmware': firmware})
            },
            /**
             * start the observer's node module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            start: function (onSuccess, onError) {
                partials.node('start', onSuccess, onError)
            },
            /**
             * stop the observer's node module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            stop: function (onSuccess, onError) {
                partials.node('stop', onSuccess, onError)
            },
            /**
             * reset the observer's node module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            reset: function (onSuccess, onError) {
                partials.node('reset', onSuccess, onError)
            },
            /**
             * send a message to the observer's node
             * @param {(String|Buffer)} message
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            send: function (message, onSuccess, onError) {
                partials.node('send', onSuccess, onError, {'message': message})
            },
            /**
             * request the observer's node module status
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            status: function (onSuccess, onError) {
                partials.node('status', onSuccess, onError)
            }
        },
        experiment: {
            /**
             * setup the observer's experiment module
             * @param {String} experimentId
             * @param {File} behavior
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            setup: function (experimentId, behavior, onSuccess, onError) {
                partials.experiment('setup', onSuccess, onError, {'experiment_id': experimentId, 'behavior': behavior});
            },
            /**
             * start the observer's experiment module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            start: function (onSuccess, onError) {
                partials.experiment('start', onSuccess, onError);
            },
            /**
             * stop the observer's experiment module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            stop: function (onSuccess, onError) {
                partials.experiment('stop', onSuccess, onError);
            },
            /**
             * reset the observer's experiment module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            reset: function (onSuccess, onError) {
                partials.experiment('reset', onSuccess, onError);
            },
            /**
             * request the observer's experiment module status
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            status: function (onSuccess, onError) {
                partials.experiment('status', onSuccess, onError);
            }
        },
        location: {
            /**
             * setup the observer's experiment module
             * @param {(number|String)} latitude
             * @param {(number|String)} longitude
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            setup: function (latitude, longitude, onSuccess, onError) {
                partials.location('setup', onSuccess, onError, {'latitude': latitude, 'longitude': longitude});
            },
            /**
             * request the observer's location module status
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            status: function (onSuccess, onError) {
                partials.location('status', onSuccess, onError);
            }
        },
        io: {
            /**
             * setup the observer's experiment module
             * @param {(String)} source
             * @param {(String)} address
             * @param {(number|String)} port
             * @param {(number|String)} keepalivePeriod
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            setup: function (source, address, port, keepalivePeriod, onSuccess, onError) {
                partials.io('setup', onSuccess, onError, {
                    'source': source,
                    'address': address,
                    'port': port,
                    'keepalive_period': keepalivePeriod
                }, onSuccess, onError);
            },
            /**
             * start the observer's IO module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            start: function (onSuccess, onError) {
                partials.io('start', onSuccess, onError);
            },
            /**
             * stop the observer's IO module
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            stop: function (onSuccess, onError) {
                partials.io('stop', onSuccess, onError);
            },
            /**
             * request the observer's IO module status
             * @param {onSuccessCallback} onSuccess
             * @param {onErrorCallback} onError
             */
            status: function (onSuccess, onError) {
                partials.io('status', onSuccess, onError);
            }
        }
    };

    function onSuccessWithPromise(deferred, status){
        deferred.resolve(status);
    }

    function onErrorWithPromise(deferred, error, response, body){
        deferred.reject({error: error, response: response, body: body});
    }

    commandsWithPromises = {
        root:{
            /**
             * request the observer's status
             * @returns {Promise} the request's promise
             */
            status: function () {
                var deferred;

                deferred = Q.defer();
                commands.root.status(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            }
        },
        node: {
            /**
             * setup the observer's node module
             * @param {File} profile
             */
            setup: function (profile) {
                var deferred;

                deferred = Q.defer();
                commands.node.setup(
                    profile,
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * init the observer's node module
             * @returns {Promise} the request's promise
             */
            init: function () {
                var deferred;

                deferred = Q.defer();
                commands.node.init(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * load a firmware in the observer's node
             * @param {File} firmware
             * @returns {Promise} the request's promise
             */
            load: function (firmware) {
                var deferred;

                deferred = Q.defer();
                commands.node.load(
                    firmware,
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * start the observer's node module
             * @returns {Promise} the request's promise
             */
            start: function () {
                var deferred;

                deferred = Q.defer();
                commands.node.start(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * stop the observer's node module
             * @returns {Promise} the request's promise
             */
            stop: function () {
                var deferred;

                deferred = Q.defer();
                commands.node.stop(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * reset the observer's node module
             * @returns {Promise} the request's promise
             */
            reset: function () {
                var deferred;

                deferred = Q.defer();
                commands.node.reset(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * send a message to the observer's node
             * @param {(String|Buffer)} message
             * @returns {Promise} the request's promise
             */
            send: function (message) {
                var deferred;

                deferred = Q.defer();
                commands.node.send(
                    message,
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * request the observer's node module status
             * @returns {Promise} the request's promise
             */
            status: function () {
                var deferred;

                deferred = Q.defer();
                commands.node.status(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            }
        },
        experiment: {
            /**
             * setup the observer's experiment module
             * @param {String} experimentId
             * @param {File} behavior
             * @returns {Promise} the request's promise
             */
            setup: function (experimentId, behavior) {
                var deferred;

                deferred = Q.defer();
                commands.experiment.setup(
                    experimentId,
                    behavior,
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * start the observer's experiment module
             * @returns {Promise} the request's promise
             */
            start: function () {
                var deferred;

                deferred = Q.defer();
                commands.experiment.start(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * stop the observer's experiment module
             * @returns {Promise} the request's promise
             */
            stop: function () {
                var deferred;

                deferred = Q.defer();
                commands.experiment.stop(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * reset the observer's experiment module
             * @returns {Promise} the request's promise
             */
            reset: function () {
                var deferred;

                deferred = Q.defer();
                commands.experiment.reset(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * request the observer's experiment module status
             * @returns {Promise} the request's promise
             */
            status: function () {
                var deferred;

                deferred = Q.defer();
                commands.experiment.status(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            }
        },
        location: {
            /**
             * setup the observer's experiment module
             * @param {(number|String)} latitude
             * @param {(number|String)} longitude
             * @returns {Promise} the request's promise
             */
            setup: function (latitude, longitude) {
                var deferred;

                deferred = Q.defer();
                commands.location.setup(
                    latitude,
                    longitude,
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * request the observer's location module status
             * @returns {Promise} the request's promise
             */
            status: function () {
                var deferred;

                deferred = Q.defer();
                commands.location.status(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            }
        },
        io: {
            /**
             * setup the observer's experiment module
             * @param {(String)} source
             * @param {(String)} address
             * @param {(number|String)} port
             * @param {(number|String)} keepalivePeriod
             * @returns {Promise} the request's promise
             */
            setup: function (source, address, port, keepalivePeriod) {
                var deferred;

                deferred = Q.defer();
                commands.io.setup(
                    source,
                    address,
                    port,
                    keepalivePeriod,
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * start the observer's IO module
             * @returns {Promise} the request's promise
             */
            start: function () {
                var deferred;

                deferred = Q.defer();
                commands.io.start(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * stop the observer's IO module
             * @returns {Promise} the request's promise
             */
            stop: function () {
                var deferred;

                deferred = Q.defer();
                commands.io.stop(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            },
            /**
             * request the observer's IO module status
             * @returns {Promise} the request's promise
             */
            status: function () {
                var deferred;

                deferred = Q.defer();
                commands.io.status(
                    onSuccessWithPromise.bind(null, deferred),
                    onErrorWithPromise.bind(null, deferred)
                );
                return deferred.promise;
            }
        }
    };
    if(promise){
        return commandsWithPromises;
    } else {
        return commands;
    }

    /**
     * @callback onSuccessCallback
     * @param {Object} status - status update of the configured module
     */

    /**
     * @callback onErrorCallback
     * @param {Error} error - request error
     * @param {http.IncomingMessage} response - server's response, if any
     * @param {(Buffer|String)} body - response body, if any
     */
};

module.exports = factory;

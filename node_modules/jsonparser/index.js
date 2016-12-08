/*jslint node: true */
"use strict";
var is   = require("type-is");
var util = require("util");

/**
 * Messages to be used
 * @type {Object}
 */
var messages = {
    "contentType" : "Unexpected Content-Type '%s', expecting 'application/json'.",
    "parseError": "Problems parsing JSON",
    "emptyBody" : "Request body is empty"
};

/**
 * Check if a request has a request body.
 *
 * @param {Object} request
 * @return {Boolean}
 * @api public
 */

 function hasbody(req) {
    return !!req.body;
}

module.exports = function(options) {
    options = options || {};
    var strict = !!options.strict;
    var emptyBodyCheck = !!options.bodyCheck;
    var type = options.type || "json";

    return function(req, res, next) {
        var err;
        
        if(strict && !is(req, type)) {
            var msg = util.format(messages.contentType,req.headers["content-type"]);
            err = new Error(msg);
            err.status = 415;
            return next(err);    
        }

        if(emptyBodyCheck && !hasbody(req)) {
                err = new Error(messages.emptyBody);
                err.status = 400;
                return next(err);
        }

        try {
            req.json = JSON.parse(req.body);
        } catch (e) {
            err = new Error(messages.parseError);
            err.status = 400;
            return next(err);
        }
        next();
    };
};
var placingController = module.exports = {};

var _ = require('lodash');
var q = require('q');
var placingService = require('./placingService');
var Race = require('../race/race').model;
var Greyhound = require('../greyhound/greyhound').model;
var helper = require('../helper');
var mongoService = require('../mongoService');
var expressService = require('../expressService');

expressService.addStandardMethods(placingController, placingService);

placingController.find = function(req, res){
    var query = expressService.buildQueryFromRequest(req, ['greyhoundRef=greyhoundRef', 'raceRef=raceRef']);
    var searchParams = expressService.parseSearchParams(req);

    return expressService.setTotalHeader(res, placingService).then(function(){
        return helper.responseFromPromise(res, placingService.find(query, searchParams.limit, searchParams.offset, searchParams.sort));
    });
};

placingController.create = function(req, res) {
    helper.responseFromPromise(res, placingService.createPlacing(req.body));
};

placingController.update = function(req, res) {
    helper.responseFromPromise(res, placingService.updatePlacing(req.model, req.body));
};

placingController.destroy = function(req, res) {
    helper.responseFromPromise(res, placingService.remove(req.model));
};
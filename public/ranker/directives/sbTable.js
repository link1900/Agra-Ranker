angular.module('directives')
    .directive('sbTable', function(headerHelperService, $filter, localStorageService, $q) {
        function linkBody(scope, element, attrs) {

            scope.noRecords = true;
            scope.showSearch = true;
            scope.selected = {};
            scope.perPageOptions = [{"name":"10","value":10},
                {"name":"15","value":15},
                {"name":"25","value":25},
                {"name":"50","value":50},
                {"name":"100","value":100}];

            if (scope.messageEmpty){
                scope.messageEmpty = "No records";
            }

            if (scope.updateOnEvent){
                scope.$on(scope.updateOnEvent,function() {
                    scope.loadModels();
                });
            }

            scope.changePage = function(page){
                scope.searchParams.page = page;
            };

            scope.toggleAdvancedSearch = function(){
                scope.showAdvancedSearch = !scope.showAdvancedSearch;
            };

            scope.calculatePageRange = function(page, pageSize, total){
                if (total == 0){
                    return 0;
                } else {
                    var start = (page-1) * pageSize;
                    start = start <= 0 ? 1 : start;
                    var end = page * pageSize;
                    end = end > total ? total : end;
                    return start + "-" + end;
                }

            };

            scope.getValueFromModel = function(model, field){
                var finalResult;
                if (model && field){
                    var result = model;
                    field = field.split('.');
                    for (var i = 0, len = field.length; i < len - 1; i++){
                        if (result){
                            result = result[field[i]];
                        }
                    }

                    if (result){
                        finalResult = result[field[len - 1]];
                    } else {
                        finalResult = '';
                    }
                } else {
                    finalResult = '';
                }
                return finalResult;
            };

            scope.getFieldValue = function(model, column) {
                var field = column.field;
                var finalResult = scope.getValueFromModel(model,  column.field);

                //filter final result
                if (column.filter && column.filterFormat){
                    return $filter(column.filter)(finalResult, column.filterFormat);
                } else if(column.filter) {
                    return $filter(column.filter)(finalResult);
                } else {
                    return finalResult;
                }

            };

            scope.resetSearch = function(){
                scope.setSearchFieldsDefaults();
            };

            scope.loadModels = function() {
                scope.modelService.query(scope.searchParams, function(resultModels, headers) {
                    scope.models = resultModels;
                    scope.noRecords = scope.models.length == 0;
                    if (scope.postProcess){
                        scope.postProcess(resultModels);
                    }
                    scope.totalItems = headerHelperService.totalItemsFromHeader(headers());
                    localStorageService.set(scope.getStorageKeyTotalItems(), scope.totalItems);
                });
            };

            scope.loadSearchFieldsOptions = function(){
                if (scope.searchFields != null){
                    var optionProms = _.chain(scope.searchFields).filter(function(field){
                        return field.type === "select" || field.type === "selectRangeSingle";
                    }).map(function(field){
                        if (field.loadOptions != null){
                            return field.loadOptions().then(function(options){
                                field.options = options;
                            })
                        } else {
                            return $q.when();
                        }
                    });

                    return $q.all(optionProms);
                } else {
                    return $q.when([]);
                }
            };

            scope.getStorageKeySearchParam = function(){
                return 'sbTable.'+scope.tableName + ".searchParams";
            };

            scope.getStorageKeyTotalItems = function(){
                return 'sbTable.'+scope.tableName + ".totalItems";
            };

            scope.setDefaultSearchParams = function(){
                if (scope.tableName != null && localStorageService.get(scope.getStorageKeySearchParam())!= null){
                    scope.searchParams = localStorageService.get(scope.getStorageKeySearchParam());
                    scope.totalItems = localStorageService.get(scope.getStorageKeyTotalItems());
                    scope.setSearchFieldsFromSearchParams();
                } else { //load the defaults from directive parameters
                    scope.setSearchFieldsDefaults();
                }
            };

            scope.setSearchFieldsDefaults = function(){
                scope.searchParams = {
                    page : 1,
                    per_page : 10,
                    sort_field: 'name',
                    sort_direction: 'asc'
                };

                if (scope.sortField){
                    scope.searchParams.sort_field = scope.sortField;
                }

                if (scope.sortDirection){
                    scope.searchParams.sort_direction = scope.sortDirection;
                }

                if (scope.perPage){
                    scope.searchParams.per_page = parseInt(scope.perPage);
                }
                if (scope.searchFields != null){
                    _.forEach(scope.searchFields, function(field){
                        if (field.type === "select"){
                            if (field.options.length > 0){
                                scope.searchParams[field.field] = field.options[0]._id;
                            }
                        }
                        if (field.type === "selectRangeSingle"){
                            if (field.options.length > 0){
                                scope.selected[field.name] = field.options[0]._id;
                                scope.searchParams[field.fieldStart] = field.options[0]._id[field.selectedStart];
                                scope.searchParams[field.fieldEnd] = field.options[0]._id[field.selectedEnd];
                            }
                        }
                        if (field.type === "text"){
                            scope.searchParams[field.field] = "";
                        }
                        if (field.type === "hidden"){
                            scope.searchParams[field.field] = field.value;
                        }
                    });
                }
            };

            scope.setSearchFieldsFromSearchParams = function(){
                if (scope.searchFields != null){
                    _.forEach(scope.searchFields, function(field){
                        if (field.type === "selectRangeSingle"){
                            if (field.options.length > 0){
                                var selectedIndex = _.findIndex(field.options, function(item){
                                    return _.isEqual(item._id[field.selectedStart],scope.searchParams[field.fieldStart]);
                                });
                                if (selectedIndex > -1){
                                    scope.selected[field.name] = field.options[selectedIndex]._id;
                                }
                            }
                        }
                    });
                }
            };

            scope.addWatch = function(){
                scope.$watch('searchParams', function(newVal, oldVal){
                    if (oldVal){
                        if (scope.tableName){
                            localStorageService.set(scope.getStorageKeySearchParam(), newVal);
                        }
                        scope.loadModels();
                    }
                }, true);
            };

            scope.loadSearchFieldsOptions().then(function(){
                scope.setDefaultSearchParams();
                scope.addWatch();
            });

        }

        return {
            restrict: 'A',
            scope: {
                perPage : '@',
                sortField: '@',
                sortDirection: '@',
                updateOnEvent: '@',
                messageEmpty: '@',
                modelService: '=',
                columnInfo: '=',
                searchFields: '=',
                postProcess: '=',
                tableName: '@'
            },
            link: linkBody,
            templateUrl: '/ranker/directives/sbTableTemplate.html'
        };
    });


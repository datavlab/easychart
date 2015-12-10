(function () {
    var css = require('../css/style.css');
    var Delegator = require("dom-delegator");
    Delegator();
    function constructor(element){
        var router = require('./services/router.js');
        var dataService = require('./services/data');
        var confService = require('./services/config');
        var optionsService = require('./services/options');
        var mediator = require('mediatorjs');
        var h = require('virtual-dom/h');
        var mInstance = new mediator.Mediator();
        var data = new dataService(mInstance);
        var config = new confService(mInstance, data);
        var services = {
            data: data,
            config: new confService(mInstance, data),
            mediator: mInstance,
            options: new optionsService()
        };

        element.className += ' ec';

        var states = {
            'import': {
                title: 'Import',
                dependencies: function(){
                    var that = {};
                    that.import = require('./components/import.js')(services);
                    return that;
                },
                template: function (dependencies) {
                    return h('div', [dependencies.import.template()]);
                }
            },
            'templates': {
                title: 'Templates',
                dependencies: function(){
                    var that = {};
                    that.templates = require('./components/templates.js')(services);
                    return that;
                },
                template: function (dependencies) {
                    return h('div', [dependencies.templates.template()]);
                }
            },
            'customise': {
                title: 'Customise',
                dependencies: function(){
                    var that = {};
                    that.configurate = require('./components/configurate.js')(services);
                    return that;
                },
                template: function (dependencies) {
                    return h('div', [dependencies.configurate.template()]);
                }
            },
            'debugger':{
                title: 'Debug',
                dependencies: function(){
                    var that = {};
                    that.debug = require('./components/debug.js')(services);
                    return that;
                },
                template: function (dependencies) {
                    return h('div', [dependencies.debug.template()]);
                }
            }
        };

        var mainRouter = new router(element, states , services);
        mainRouter.goToState('import');

        function setData (data){
            services.data.set(data);
        }

        function getData (){
            return services.data.get();
        }
        function setDataCSV(csv){
            services.data.setCSV(csv);
        }
        function setDataUrl(url){
            services.data.setUrl(url);
        }

        function setOptions(options){
            services.options.set(options);
        }

        function setConfig(config){
            services.config.set(config);
        }

        function getConfig(config){
            return services.config.getRaw(config);
        }

        function on(event, callback){
            mInstance.on(event, function (data) {
                callback(data);
            });
        }

        function setConfigTemplate(configTemplate){
            services.config.setConfigTemplate(configTemplate);
        }
        return {
            setData:setData,
            getData:getData,
            setDataUrl:setDataUrl,
            setDataCSV: setDataCSV,
            setOptions:setOptions,
            setConfig:setConfig,
            getConfig:getConfig,
            setDataCSV:setDataCSV,
            on:on,
            setConfigTemplate: setConfigTemplate
        }
    }

    window.ec = constructor;
})();

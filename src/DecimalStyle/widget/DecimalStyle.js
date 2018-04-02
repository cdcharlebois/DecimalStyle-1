define([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "dijit/_TemplatedMixin",
    "mxui/dom",
    "dojo/dom",
    "dojo/dom-prop",
    "dojo/dom-geometry",
    "dojo/dom-class",
    "dojo/dom-style",
    "dojo/dom-construct",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojo/text",
    "dojo/html",
    "dojo/_base/event",

    "dojo/text!DecimalStyle/widget/template/DecimalStyle.html"
], function (declare, _WidgetBase, _TemplatedMixin, dom, dojoDom, dojoProp, dojoGeometry, dojoClass, dojoStyle, dojoConstruct, dojoArray, lang, dojoText, dojoHtml, dojoEvent, widgetTemplate) {
    "use strict";

    return declare("DecimalStyle.widget.DecimalStyle", [ _WidgetBase, _TemplatedMixin ], {

        templateString: widgetTemplate,


        widgetBase: null,

        // Internal variables.
        _handles: null,
        _contextObj: null,

        //Nodes
        beforeNode:null,
        afterNode:null,
        decimalNode:null,

        //Modeler
        beforeClassName:null,
        afterClassName:null,
        field:null,
        OnClickMicroflow: null,

        constructor: function () {
            this._handles = [];
        },

        postCreate: function () {
            logger.debug(this.id + ".postCreate");
        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._contextObj = obj;
            this._resetSubscriptions();
            this._updateRendering(callback);
        },

        _resetSubscriptions: function (){
            this.unsubscribeAll();
            //Add attribute subscription
            this.subscribe({
                guid:this._contextObj.getGuid(),
                attr:this.field,
                callback: this._updateRendering
            });
            //Add object subscription
            this.subscribe({
                guid:this._contextObj.getGuid(),
                callback: this._updateRendering
            });
        },
       
        postCreate: function(){
            this._setupEvents();
        },

        _setupEvents: function(){
            //Subscribe to On click events
            this.connect(this.widgetBase, "onclick", function(){
                mx.data.action({
                    params: {
                        applyto: "selection",
                        actionname: this.onClickMicroflow,
                        guids: [ this._contextObj.getGuid()],
                        
                    },
                    origin: this.mxform,
                    callback:lang.hitch(this, function(obj) {
                        // expect single MxObject
                       console.log("microflow ran sucessfully");
                    }),
                    error: function(error) {
                        console.log(error.description);
                    },
                });
            });
        },


        resize: function (box) {
            logger.debug(this.id + ".resize");
        },

        uninitialize: function () {
            logger.debug(this.id + ".uninitialize");
        },

        _updateRendering: function (callback) {
            logger.debug(this.id + "._updateRendering");
            
            var value = "" + this._contextObj.get(this.field) * 1;
            var splitValues = value.split(".");
            this.beforeNode.innerHTML = splitValues[0];
            this.beforeNode.className += "" + this.beforeClassName;
            this.afterNode.innerHTML = splitValues[1];
            this.afterNode.className += "" + this.afterClassName;

            if (this._contextObj !== null) {
                dojoStyle.set(this.domNode, "display", "block");
            } else {
                dojoStyle.set(this.domNode, "display", "none");
            }

            this._executeCallback(callback, "_updateRendering");
        },

        // Shorthand for running a microflow
        _execMf: function (mf, guid, cb) {
            logger.debug(this.id + "._execMf");
            if (mf && guid) {
                mx.ui.action(mf, {
                    params: {
                        applyto: "selection",
                        guids: [guid]
                    },
                    callback: lang.hitch(this, function (objs) {
                        if (cb && typeof cb === "function") {
                            cb(objs);
                        }
                    }),
                    error: function (error) {
                        console.debug(error.description);
                    }
                }, this);
            }
        },

        // Shorthand for executing a callback, adds logging to your inspector
        _executeCallback: function (cb, from) {
            logger.debug(this.id + "._executeCallback" + (from ? " from " + from : ""));
            if (cb && typeof cb === "function") {
                cb();
            }
        }
    });
});

require(["DecimalStyle/widget/DecimalStyle"]);

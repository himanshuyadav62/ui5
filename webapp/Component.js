sap.ui.define([
    "sap/ui/core/UIComponent",
    "projectui5/model/models"
], (UIComponent, models) => {
    "use strict";

    return UIComponent.extend("projectui5.Component", {
        metadata: {
            manifest: "json",
            interfaces: [
                "sap.ui.core.IAsyncContentCreation"
            ]
        },

        init() {
            // call the base component's init function
            UIComponent.prototype.init.apply(this, arguments);


            var oGlobalModel = models.createModel();
            this.setModel(oGlobalModel, "globalModel");

            // enable routing
            this.getRouter().initialize();
        }
    });
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], (Controller, MessageToast) => {

    "use strict";

    return Controller.extend("projectui5.controller.BaseController", {
        onInit() {
            const oHighlightModel = new sap.ui.model.json.JSONModel({
                selectedRoute: "Home"
            });
            this.getView().setModel(oHighlightModel, "highlight");
        },


        onTilePress(oEvent) {
            const sKey = oEvent.getSource().data("key");
            MessageToast.show(`Tile pressed: ${sKey}`);
            // const oModel = this.getView().getModel("highlight");
            // oModel.setProperty("/selectedRoute", sKey); // Update selected route
            this.getOwnerComponent().getRouter().navTo(sKey);
        }
    });
});

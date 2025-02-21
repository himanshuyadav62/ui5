sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
    "use strict";

    return Controller.extend("pscreen.controller.Admin", {
        onInit: function () {
            // Fetch current column settings
            fetch("http://localhost:3000/api/columnSettings")
                .then((response) => response.json())
                .then((data) => {
                    const oModel = new JSONModel(data);
                    this.getView().setModel(oModel);
                })
                .catch((error) => {
                    console.error("Error fetching column settings:", error);
                });
        },

        onSaveSettings: function () {
            const oModel = this.getView().getModel();
            const updatedSettings = oModel.getData();

            // Validate unique order values
            const orderValues = updatedSettings.map(item => item.order);
            const hasDuplicates = orderValues.some((value, index) => orderValues.indexOf(value) !== index);

            if (hasDuplicates) {
                MessageToast.show("Order values must be unique.");
                return;
            }

            // Save updated settings
            fetch("http://localhost:3000/api/columnSettings", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updatedSettings)
            })
                .then((response) => response.json())
                .then((data) => {
                    MessageToast.show(data.message || "Settings saved successfully!");
                })
                .catch((error) => {
                    console.error("Error saving settings:", error);
                });
        },

        onLabelEdit: function (oEvent) {
            const sNewValue = oEvent.getParameter("value");
            const oContext = oEvent.getSource().getBindingContext();
            oContext.getObject().label = sNewValue;
        },

        onWidthEdit: function (oEvent) {
            const sNewValue = oEvent.getParameter("value");
            const oContext = oEvent.getSource().getBindingContext();
            oContext.getObject().width = sNewValue;
        },

        onVisibilityChange: function (oEvent) {
            const bNewState = oEvent.getParameter("state");
            const oContext = oEvent.getSource().getBindingContext();
            oContext.getObject().visible = bNewState;
        },

        onOrderEdit: function (oEvent) {
            const sNewValue = parseInt(oEvent.getParameter("value"), 10);
            const oContext = oEvent.getSource().getBindingContext();
            oContext.getObject().order = isNaN(sNewValue) ? null : (Number)(sNewValue);
        },

		onReorderRows: function (oEvent) {
            const oModel = this.getView().getModel();
            const updatedSettings = oModel.getData();
        
            // Validate unique order values
            const orderValues = updatedSettings.map(item => item.order);
            const hasDuplicates = orderValues.some((value, index) => orderValues.indexOf(value) !== index);
        
            if (hasDuplicates) {
                MessageToast.show("Order values must be unique.");
                return;
            }
        
            // Set the updated data back to the model
            updatedSettings.sort((a, b) => a.order - b.order);
        
            // Explicitly refresh the bindings for the table
            // const oTable = this.getView().byId("settingsTable");
            // oTable.getBinding("items").refresh();
            this.getView().setModel(oModel);
            this.getView().getModel().refresh();
        }
    });
});

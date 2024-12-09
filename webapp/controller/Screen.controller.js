sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/rowmodes/Fixed",
    "../model/ComplianceModel"
], function (Controller, JSONModel, FixedRowMode, ComplianceModel) {
    "use strict";

    return Controller.extend("pscreen.controller.Screen", {
        onInit: function () {
            this.byId("idComplianceDataTable").setRowMode(new FixedRowMode({ rowCount: 5 }));
            // Set logo path
            this.getView().setModel(this.loadTableData(null)); // Corrected function call

            let oVBox1 = this.getView().byId("idTile1VBox");
            let oVBox2 = this.getView().byId("idTile2VBox");
            let oVBox3 = this.getView().byId("idTile3VBox");

            // Attach click event to all VBoxes
            [oVBox1, oVBox2, oVBox3].forEach(function (oVBox) {
                oVBox.attachBrowserEvent("click", this.onVBoxClick.bind(this));
            }.bind(this));
        },

        loadTableData: function (viewId) {
            const oModel = new JSONModel({
                logoPath: "path/to/paccar-logo.png",
                complianceData: ComplianceModel.getInitialData()
            });
            // fetch Data based on viewId, you can implement your data fetching logic here
            return oModel; 
        },

        onSearch: function () {
            // Implement search logic
        },

        onRefresh: function () {
            // Implement refresh logic
        },

        onUploadExcel: function () {
            // Implement excel upload logic
        },

        onSubmit: function () {
            // Implement submit logic
        },

        onButtonMenuPress: function (oEvent) {
            // Handle menu press
        },

        onSideNavigationItemSelect: function (oEvent) {
            // Handle side navigation item select
        },

        onVBoxClick: function (oEvent) {
            let oClickedVBox = oEvent.currentTarget;

            let oView = this.getView();
            let aVBoxes = [
                oView.byId("idTile1VBox"),
                oView.byId("idTile2VBox"),
                oView.byId("idTile3VBox")
            ];

            aVBoxes.forEach(function (oVBox) {
                oVBox.removeStyleClass("activeVBox");
            });

            sap.ui.getCore().byId(oClickedVBox.id).addStyleClass("activeVBox");
            this.getView().setModel(this.loadTableData(oClickedVBox.id));
        }
    });
});

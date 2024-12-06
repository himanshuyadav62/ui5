sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/rowmodes/Fixed",
    "../model/ComplianceModel"
], function (Controller, JSONModel,FixedRowMode, ComplianceModel) {
    "use strict";

    return Controller.extend("pscreen.controller.Screen", {
        onInit: function () {
            this.byId("idComplianceDataTable").setRowMode(new FixedRowMode({ rowCount: 5 }));
            // Set logo path
            const oModel = new JSONModel({
                logoPath: "path/to/paccar-logo.png",
                complianceData: ComplianceModel.getInitialData()
            });
            this.getView().setModel(oModel);
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


		onButtonMenuPress: function(oEvent) {
			
		},

		onSideNavigationItemSelect: function(oEvent) {
			
		}
        
        
    });
});
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel",
    "sap/m/MessageToast",
    "projectui5/controller/BaseController"
], (Controller, JSONModel, ResourceModel, MessageToast,BaseController) => {
    "use strict";
    return BaseController.extend("projectui5.controller.View", {
        onInit() {
            // Create and set a JSON Model
            const oData = {
                user: {
                    name: "John Doe",
                    age: 30
                },
                settings: {
                    theme: "Light",
                    notifications: true
                }
            };
            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "data");
            
            // Load and set the i18n Resource Model
            const i18nModel = new ResourceModel({
                bundleName: "projectui5.i18n.i18n" // Path to your i18n.properties file
            });
            this.getView().setModel(i18nModel, "i18n");

            
            var oGlobalModel = this.getOwnerComponent().getModel("globalModel");
      
            // Getting a property from the model
            var sUserName = oGlobalModel.getProperty("/user/name");
            console.log("User Name: " + sUserName);
        },
        
        onLiveChange(oEvent) {
            // Get the current model data
            const oModel = this.getView().getModel("data");
            const oData = oModel.getData();
            
            // Show a message toast to demonstrate two-way binding
            MessageToast.show("Data updated: Model reflects the changes");
            
            // Optional: Log the current data to console
            console.log("Current Model Data:", oData);
        },
        
        onNavigateToPosts() {
            this.getOwnerComponent().getRouter().navTo("RoutePosts");
        },
        
        onNavigateToUsers(){
            this.getOwnerComponent().getRouter().navTo("RouteUsers");
        },
       
        onShowTable() {
            const oView = this.getView();
            const oTable = oView.byId("dataTable");
            
            // Get data from the JSON model
            const oData = oView.getModel("data").getData();
            const aTableData = [];
            
            // Flatten the data structure for the table
            const flattenData = (obj, prefix = "") => {
                for (const key in obj) {
                    if (typeof obj[key] === "object") {
                        flattenData(obj[key], `${prefix}${key}.`);
                    } else {
                        aTableData.push({
                            key: `${prefix}${key}`,
                            value: obj[key]
                        });
                    }
                }
            };
            
            flattenData(oData);
            
            // Bind the flattened data to the table
            const oTableModel = new JSONModel(aTableData);
            oTable.setModel(oTableModel);
            oTable.bindItems("/", new sap.m.ColumnListItem({
                cells: [
                    new sap.m.Text({ text: "{key}" }),
                    new sap.m.Text({ text: "{value}" })
                ]
            }));
            
            // Make the table visible
            oTable.setVisible(true);
        }
    });
});
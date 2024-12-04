sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "projectui5/controller/BaseController"
], (Controller, JSONModel, MessageToast, BaseController) => {
    "use strict";
    return BaseController.extend("projectui5.controller.Users", {
        onInit() {
            console.log("init users controller");
            // Create an empty JSON model
            const oModel = new JSONModel();
            this.getView().setModel(oModel, "users");
            
            // Fetch user data and set it to the model
            fetch("https://jsonplaceholder.typicode.com/users")
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Failed to fetch users");
                    }
                    return response.json();
                })
                .then(data => {
                    // Set data to the model
                    oModel.setData({ users: data });
                })
                .catch(error => {
                    console.error("Error fetching user data:", error);
                });
        },

        onUserPress(oEvent) {
            // Get the selected user
            const oItem = oEvent.getSource();
            const oContext = oItem.getBindingContext("users");
            const oUser = oContext.getObject();

            // Show a message with user details
            MessageToast.show(`Selected User: ${oUser.name} (${oUser.email})`);
        },
    });
});
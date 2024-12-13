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
      }
    });
  });
  
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
  
      onReorderItems: function(oEvent) {
        const oDragged = oEvent.getParameter("draggedControl");
        const oDropped = oEvent.getParameter("droppedControl");
        const sDropPosition = oEvent.getParameter("dropPosition");
    
        const oModel = this.getView().getModel();
        // Create a copy of the data array
        const aItems = [...oModel.getData()];
    
        const iDraggedIndex = aItems.findIndex(item => item === oDragged.getBindingContext().getObject());
        const iDroppedIndex = aItems.findIndex(item => item === oDropped.getBindingContext().getObject());
    
        const oDraggedItem = aItems.splice(iDraggedIndex, 1)[0];
        const iNewIndex = sDropPosition === "After" ? iDroppedIndex + 1 : iDroppedIndex;
    
        aItems.splice(iNewIndex, 0, oDraggedItem);
        
        // Set the reordered data back to the model
        oModel.setData(aItems);
        // Force model update
        oModel.updateBindings(true);
    },
  
      onSaveSettings: function () {
        const oModel = this.getView().getModel();
        const updatedSettings = oModel.getData();

        // set the order property based on the index
        updatedSettings.forEach((item, index) => {
          item.order = index;
        });
  
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

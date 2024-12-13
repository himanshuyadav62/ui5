sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/Table",
    "sap/ui/table/Column",
    "sap/m/Text"
  ], function (Controller, JSONModel, Table, Column, Text) {
    "use strict";
  
    return Controller.extend("pscreen.controller.User", {
      onInit: function () {
        this.createDynamicTable();
      },
  
      createDynamicTable: function () {
        const oView = this.getView();
  
        // Step 1: Fetch column settings
        fetch("http://localhost:3000/api/columnSettings")
          .then((response) => response.json())
          .then((columns) => {
            // Create a new table instance
            const oTable = new Table({
              visibleRowCount: 10,
              selectionMode: "Single"
            });
  
            // Add columns dynamically based on visibility
            columns.forEach((column) => {
              if (column.visible) {
                oTable.addColumn(
                  new Column({
                    label: new sap.m.Label({ text: column.label }),
                    template: new Text({ text: `{${column.property}}` }),
                    sortProperty: column.property,
                    filterProperty: column.property,
                    width: column.width
                  })
                );
              }
            });
  
            // Step 2: Fetch data and bind to the table
            fetch("http://localhost:3000/api/data")
              .then((response) => response.json())
              .then((data) => {
                const oModel = new JSONModel();
                oModel.setData(data);
                oTable.setModel(oModel);
                oTable.bindRows("/");
              });
  
            // Add the table to the view
            oView.byId("tableContainer").addItem(oTable);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      }
    });
  });
  
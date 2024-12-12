sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/dnd/DragDropInfo"
], function (Controller, JSONModel, MessageToast, DragDropInfo) {
    "use strict";

    return Controller.extend("pscreen.controller.Admin", {

        onInit: function () {
            this._loadColumnSettings();
        },

        _loadColumnSettings: function () {
            const table = "users"; // Adjust based on the selected table
            const oModel = new JSONModel();

            // Fetch column settings from API
            oModel.loadData(`http://localhost:3000/api/column-settings/${table}`);
            oModel.attachRequestCompleted(() => {
                const columnsData = oModel.getProperty("/");
                this.getView().setModel(oModel, "columns");
                this._createTable(columnsData);
            });
        },

        _createTable: function (columnsData) {
            const oTable = this.byId("adminTable");
            oTable.removeAllColumns();

            // Define fixed columns
            const columns = [
                { label: "Column Name", template: "name" },
                { label: "Is Visible", template: "visible" },
                { label: "Width", template: "width" },
                { label: "Sortable", template: "sortable" }
            ];

            // Add columns to the table
            columns.forEach(column => {
                oTable.addColumn(new sap.ui.table.Column({
                    label: new sap.m.Label({ text: column.label }),
                    template: new sap.m.Text({ text: `{${column.template}}` })
                }));
            });

            // Bind rows to the data from the model
            oTable.setModel(this.getView().getModel("columns"));
            oTable.bindRows({ path: "/" });

            // Enable Drag and Drop for reordering rows
            this._enableDragAndDrop(oTable);
        },

        _enableDragAndDrop: function (oTable) {
            const oDragDropConfig = new DragDropInfo({
                sourceAggregation: "rows",
                targetAggregation: "rows",
                dragStart: this.onDragStart.bind(this),
                drop: this.onDrop.bind(this)
            });
        
            oTable.addDragDropConfig(oDragDropConfig);
        },

        onDragStart: function (oEvent) {

            console.log("Drag start event triggered");
            const oDraggedControl = oEvent.getParameter("draggedControl");
        
            if (oDraggedControl) {
                const oBindingContext = oDraggedControl.getBindingContext("columns");
                if (oBindingContext) {
                    oEvent.getParameter("dragSession").setComplexData("draggedRowContext", oBindingContext);
                }
            }
        },
        
        onDrop: function (oEvent) {
            console.log("Drop event triggered");
            const oDragSession = oEvent.getParameter("dragSession");
            const oDraggedContext = oDragSession.getComplexData("draggedRowContext");
            const oDroppedControl = oEvent.getParameter("droppedControl");
        
            if (!oDraggedContext || !oDroppedControl) {
                console.log("No dragged context or dropped control found");
                return;
            }
        
            const oDroppedContext = oDroppedControl.getBindingContext("columns");
        
            if (!oDroppedContext) {
                console.log("No dropped context found");
                return;
            }

            console.log("Dropped context: ", oDroppedContext.getObject());
        
            const oModel = this.getView().getModel("columns");
            const aColumns = oModel.getProperty("/");
        
            // Get the dragged and dropped indices
            const iDraggedIndex = aColumns.indexOf(oDraggedContext.getObject());
            const iDroppedIndex = aColumns.indexOf(oDroppedContext.getObject());
        
            if (iDraggedIndex === -1 || iDroppedIndex === -1) {
                return;
            }
        
            // Swap the rows in the array
            const oDraggedItem = aColumns.splice(iDraggedIndex, 1)[0];
            aColumns.splice(iDroppedIndex, 0, oDraggedItem);
        
            // Update the `order` property
            aColumns.forEach((col, index) => {
                col.order = index;
            });
        
            // Update the model
            oModel.setProperty("/", aColumns);
            console.log(aColumns);
        }
        ,
        

        onSaveSettings: function () {
            const oModel = this.getView().getModel("columns");
            const updatedColumns = oModel.getProperty("/");
            const table = "users"; // Adjust based on the selected table

            // Save the updated column settings via API
            $.ajax({
                url: `http://localhost:3000/api/column-settings/${table}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify(updatedColumns),
                success: function () {
                    MessageToast.show("Settings saved successfully!");
                },
                error: function () {
                    MessageToast.show("Error saving settings.");
                }
            });
        }
    });
});

sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
], function (Controller, JSONModel) {
    "use strict";

    return Controller.extend("pscreen.controller.User", {

        onInit: function () {
            const table = "users"; // Set this dynamically

            // Load column settings
            $.ajax({
                url: `/api/column-settings/${table}`,
                method: "GET",
                success: function (columns) {
                    const visibleColumns = columns.filter(col => col.visible)
                        .sort((a, b) => a.order - b.order)
                        .map(col => col.id);

                    // Fetch data respecting the visible columns
                    $.ajax({
                        url: `/api/table-data/${table}`,
                        method: "GET",
                        success: function (data) {
                            const filteredData = data.data.map(row => {
                                const filteredRow = {};
                                visibleColumns.forEach(col => {
                                    filteredRow[col] = row[col];
                                });
                                return filteredRow;
                            });

                            const oModel = new JSONModel({
                                columns: columns.filter(col => col.visible).sort((a, b) => a.order - b.order),
                                data: filteredData
                            });

                            this.getView().setModel(oModel);
                        }.bind(this),
                        error: function () {
                            console.error("Error loading table data.");
                        }
                    });
                }.bind(this),
                error: function () {
                    console.error("Error loading column settings.");
                }
            });
        }
    });
});

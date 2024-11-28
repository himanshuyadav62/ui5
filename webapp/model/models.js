// model/model.js

sap.ui.define([
    "sap/ui/model/json/JSONModel"
], function (JSONModel) {
    "use strict";

    return {
        createModel: function () {
            // Creating a simple JSON Model
            var oData = {
                user: {
                    name: "John Doe",
                    age: 30,
                    location: "New York"
                }
            };
            var oModel = new JSONModel(oData);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        }
    };
});

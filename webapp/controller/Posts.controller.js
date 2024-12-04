sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/rowmodes/Fixed",
    "sap/m/MessageToast"
], (Controller, JSONModel, FixedRowMode, MessageToast) => {
    "use strict";

    return Controller.extend("projectui5.controller.Posts", {

        apiBaseUrl :null,

        onInit() {
            const globalConfigModel = this.getOwnerComponent().getModel("globalConfig");
            this.apiBaseUrl = globalConfigModel.getProperty("/apiBaseUrl");
            this.byId("postsTable").setRowMode(new FixedRowMode({ rowCount: 10 }));
            this.byId("commentsTable").setRowMode(new FixedRowMode({ rowCount: 5 }));
            
            const oPostsModel = new JSONModel();
            
            $.ajax({
                url: `${this.apiBaseUrl}/posts`,
                method: "GET",
                dataType: "json",
                success: (posts) => {
                    MessageToast.show("Posts loaded successfully!");
                    
                    posts.forEach(post => {
                        post.selectedOption = post.selectedOption || "option1";
                        post.checkbox1 = post.checkbox1 || false;  
                        post.checkbox2 = post.checkbox2 || false;  
                        post.selectedMultiOptions = post.selectedMultiOptions || [];
                    });
                    
                    oPostsModel.setData(posts);
                    console.log(posts);
                },
                error: () => {
                    MessageToast.show("Failed to load posts");
                }
            });
            
            this.getView().setModel(oPostsModel, "posts");
            
            // Comments Model
            const oCommentsModel = new JSONModel([]);
            this.getView().setModel(oCommentsModel, "comments");
        },

        onToggleComments(oEvent) {
            const oRowContext = oEvent.getSource().getBindingContext("posts");
            const postId = oRowContext.getProperty("id");
            const oCommentsTable = this.byId("commentsTable");
            
            if (oCommentsTable.getVisible()) {
                oCommentsTable.setVisible(false);
            }
            
            const sCommentsUrl = `${this.apiBaseUrl}/posts/${postId}/comments`;
            const oCommentsModel = this.getView().getModel("comments");
            
            $.ajax({
                url: sCommentsUrl,
                method: "GET",
                dataType: "json",
                success: (comments) => {
                    oCommentsModel.setData(comments);
                    oCommentsTable.setVisible(true);
                    MessageToast.show(`Loaded ${comments.length} comments for Post ID: ${postId}`);
                },
                error: () => {
                    MessageToast.show("Failed to load comments");
                }
            });
        },

        onSingleSelectChange(oEvent) {
            const selectedKey = oEvent.getSource().getSelectedKey();
            const rowContext = oEvent.getSource().getBindingContext("posts");
            rowContext.getModel().setProperty(rowContext.getPath() + "/selectedOption", selectedKey);
        },

        onCheckbox1Change(oEvent) {
            const checked = oEvent.getSource().getSelected();
            const rowContext = oEvent.getSource().getBindingContext("posts");
            rowContext.getModel().setProperty(rowContext.getPath() + "/checkbox1", checked);
        },

        onCheckbox2Change(oEvent) {
            const checked = oEvent.getSource().getSelected(); 
            const rowContext = oEvent.getSource().getBindingContext("posts");
            rowContext.getModel().setProperty(rowContext.getPath() + "/checkbox2", checked);
        },

        onMultiSelectChange(oEvent) {
            const selectedKeys = oEvent.getSource().getSelectedKeys(); 
            const rowContext = oEvent.getSource().getBindingContext("posts");
            rowContext.getModel().setProperty(rowContext.getPath() + "/selectedMultiOptions", selectedKeys);
            console.log(this.getView().getModel("posts").oData[0]); 
        },

        onTableRowSelectionChange(oEvent) {
            const oTable = oEvent.getSource();
            const aSelectedIndices = oTable.getSelectedIndices();
            
            // Get the IDs of selected posts
            const aSelectedPostIds = aSelectedIndices.map(index => {
                const oContext = oTable.getContextByIndex(index);
                return oContext.getProperty("id") + " - " + oContext.getProperty("title");
            });
            
            // Show selected post IDs in a MessageToast
            if (aSelectedPostIds.length > 0) {
                MessageToast.show(`Selected Post: ${aSelectedPostIds.join(", ")}`);
            } else {
                MessageToast.show("No posts selected");
            }
        },
        onTilePress(oEvent){
            const sKey = oEvent.getSource().data("key");
            MessageToast.show(`Tile pressed: ${sKey}`);
            this.getOwnerComponent().getRouter().navTo(sKey);
        },
    });
});

sap.ui.define([
	"sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/Input",
    "sap/m/Button"
], function(
	Controller, JSONModel, MessageBox, Dialog, Label, Input, Button
) {
	"use strict";

	return Controller.extend("projectui5.controller.Crud", {

        onInit: function() {            
            const oPostsModel = new JSONModel();

            $.ajax({
                url: "http://localhost:5000/posts",
                method: "GET",
                success: function(data) {
                    console.log(data); 
                    oPostsModel.setData({posts: data});
                },
                error: function() {
                    console.log("Error");
                }
            });

            this.getView().setModel(oPostsModel, "posts");        
        },

		onShowCommentsButtonPress: function(oEvent) {
			// Implement logic to show comments
		},

		onDeleteButtonPress: function(oEvent) {
            const oTable = this.byId("idPostsTable");
            const aSelectedIndices = oTable.getSelectedIndices();
            
            if (aSelectedIndices.length === 0) {
                MessageBox.error("Please select a post to delete.");
                return;
            }
        
            const oModel = this.getView().getModel("posts");
            const oData = oModel.getProperty("/posts");
            const iSelectedIndex = aSelectedIndices[0];  // Assuming single selection, take the first selected index
            const sPostId = oData[iSelectedIndex].id;
        
            $.ajax({
                url: `http://localhost:5000/posts/${sPostId}`,
                method: "DELETE",
                success: () => {
                    // Remove post from model
                    oData.splice(iSelectedIndex, 1);
                    oModel.setProperty("/posts", oData);
                    MessageBox.success("Post deleted successfully.");
                },
                error: () => {
                    MessageBox.error("Error deleting post.");
                }
            });
        },
        
        onEditButtonPress: function(oEvent) {
            const oTable = this.byId("idPostsTable");
            const aSelectedIndices = oTable.getSelectedIndices();
            
            if (aSelectedIndices.length === 0) {
                MessageBox.error("Please select a post to edit.");
                return;
            }
        
            const oModel = this.getView().getModel("posts");
            const oData = oModel.getProperty("/posts");
            const iSelectedIndex = aSelectedIndices[0];  // Assuming single selection, take the first selected index
            const oSelectedPost = oData[iSelectedIndex];
        
            const oDialog = new Dialog({
                title: "Edit Post",
                content: [
                    new Label({ text: "Title" }),
                    new Input({ id: "editTitle", value: oSelectedPost.title }),
                    new Label({ text: "Content" }),
                    new Input({ id: "editContent", value: oSelectedPost.content })
                ],
                beginButton: new Button({
                    text: "Save",
                    press: () => {
                        const sNewTitle = sap.ui.getCore().byId("editTitle").getValue();
                        const sNewContent = sap.ui.getCore().byId("editContent").getValue();
        
                        $.ajax({
                            url: `http://localhost:5000/posts/${oSelectedPost.id}`,
                            method: "PUT",
                            contentType: "application/json",
                            data: JSON.stringify({
                                title: sNewTitle,
                                content: sNewContent
                            }),
                            success: () => {
                                // Update the model
                                oSelectedPost.title = sNewTitle;
                                oSelectedPost.content = sNewContent;
                                oModel.setProperty("/posts", oData);
                                MessageBox.success("Post updated successfully.");
                                oDialog.close();
                            },
                            error: () => {
                                MessageBox.error("Error updating post.");
                            }
                        });
                    }
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: () => oDialog.close()
                })
            });
        
            oDialog.open();
        }
	});
});

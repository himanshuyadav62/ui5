sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], (Controller, JSONModel, MessageToast) => {
    "use strict";
    return Controller.extend("projectui5.controller.Posts", {
        onInit() {
            // Posts Model
            const oPostsModel = new JSONModel();
            oPostsModel.attachRequestCompleted(() => {
                MessageToast.show("Posts loaded successfully!");
            });
            oPostsModel.loadData("https://jsonplaceholder.typicode.com/posts");
            this.getView().setModel(oPostsModel, "posts");

            // Comments Model
            const oCommentsModel = new JSONModel([]);
            this.getView().setModel(oCommentsModel, "comments");
        },

        onLoadComments(oEvent) {
            // Get the selected post's ID
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext("posts");
            const postId = oContext.getProperty("id");

            // Get comments panel
            const oCommentsPanel = this.byId("commentsPanel");
            
            // If comments are already visible, hide them
            if (oCommentsPanel.getVisible()) {
                oCommentsPanel.setVisible(false);
                return;
            }

            // Load comments for this specific post
            const sCommentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
            
            // Get comments model
            const oCommentsModel = this.getView().getModel("comments");

            // Load comments
            const xhr = new XMLHttpRequest();
            xhr.open("GET", sCommentsUrl);
            xhr.onload = () => {
                if (xhr.status === 200) {
                    const comments = JSON.parse(xhr.responseText);
                    oCommentsModel.setData(comments);
                    
                    // Show comments panel
                    oCommentsPanel.setVisible(true);
                    
                    MessageToast.show(`Loaded ${comments.length} comments`);
                } else {
                    MessageToast.show("Failed to load comments");
                }
            };
            xhr.onerror = () => {
                MessageToast.show("Network error occurred");
            };
            xhr.send();
        }
    });
});
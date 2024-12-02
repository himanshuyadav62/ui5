sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/table/rowmodes/Fixed",
    "sap/m/MessageToast"
], (Controller, JSONModel, FixedRowMode, MessageToast) => {
    "use strict";

    return Controller.extend("projectui5.controller.Posts", {
        onInit() {
            this.byId("postsTable").setRowMode(new FixedRowMode({ rowCount: 10 }));
            this.byId("commentsTable").setRowMode(new FixedRowMode({ rowCount: 5 }));

            const oPostsModel = new JSONModel();
            oPostsModel.attachRequestCompleted(() => {
                MessageToast.show("Posts loaded successfully!");
                const posts = oPostsModel.getData();
                posts.forEach(post => {
                    post.selectedOption = post.selectedOption || "option1"; 
                    post.checkbox1 = post.checkbox1 || false;  
                    post.checkbox2 = post.checkbox2 || false;  
                    post.selectedMultiOptions = post.selectedMultiOptions || []; 
                });
                oPostsModel.setData(posts);
                console.log(posts); 
            });
            oPostsModel.loadData("https://jsonplaceholder.typicode.com/posts");
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
                return;
            }

            const sCommentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
            const oCommentsModel = this.getView().getModel("comments");

            fetch(sCommentsUrl)
                .then((response) => {
                    if (!response.ok) throw new Error("Network error");
                    return response.json();
                })
                .then((comments) => {
                    oCommentsModel.setData(comments);

                    oCommentsTable.setVisible(true);
                    MessageToast.show(`Loaded ${comments.length} comments for Post ID: ${postId}`);
                })
                .catch(() => {
                    MessageToast.show("Failed to load comments");
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
        }
    });
});

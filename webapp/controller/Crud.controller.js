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

            // Create edit dialog once during initialization
            this._oEditDialog = new Dialog({
                title: "Edit Post",
                contentWidth: "500px",
                content: [
                    new Label({ text: "Title" }),
                    new Input({
                        placeholder: "Enter post title"
                    }),
                    new Label({ text: "Content" }),
                    new Input({ 
                        placeholder: "Enter post content"
                    })
                ],
                beginButton: new Button({
                    text: "Save",
                    press: this._onSaveEdit.bind(this)
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function(oEvent) {
                        oEvent.getSource().getParent().close();
                    }
                })
            });

            // Create new post dialog
            this._oCreateDialog = new Dialog({
                title: "Create New Post",
                contentWidth: "500px",
                content: [
                    new Label({ text: "Title" }),
                    new Input({
                        placeholder: "Enter post title"
                    }),
                    new Label({ text: "Content" }),
                    new Input({ 
                        placeholder: "Enter post content"
                    })
                ],
                beginButton: new Button({
                    text: "Create",
                    press: this._onCreatePost.bind(this)
                }),
                endButton: new Button({
                    text: "Cancel",
                    press: function(oEvent) {
                        oEvent.getSource().getParent().close();
                    }
                })
            });

            // Fetch posts
            $.ajax({
                url: "http://localhost:5000/posts",
                method: "GET",
                success: function(data) {
                    console.log(data); 
                    oPostsModel.setData({posts: data});
                },
                error: function() {
                    console.log("Error fetching posts");
                }
            });

            this.getView().setModel(oPostsModel, "posts");        
        },

		onShowCommentsButtonPress: function(oEvent) {
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext("posts");
            const oPost = oContext.getObject();
            
            MessageBox.show(`Comments for post ${oPost.id}`);
		},

		onDeleteButtonPress: function(oEvent) {
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext("posts");
            const oPost = oContext.getObject();
        
            MessageBox.confirm("Are you sure you want to delete this post?", {
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: (sAction) => {
                    if (sAction === MessageBox.Action.OK) {
                        $.ajax({
                            url: `http://localhost:5000/posts/${oPost.id}`,
                            method: "DELETE",
                            success: () => {
                                const oModel = this.getView().getModel("posts");
                                const aPosts = oModel.getProperty("/posts");
                                const iIndex = aPosts.findIndex(p => p.id === oPost.id);
                                
                                if (iIndex !== -1) {
                                    aPosts.splice(iIndex, 1);
                                    oModel.setProperty("/posts", aPosts);
                                }
                                
                                MessageBox.success("Post deleted successfully.");
                            },
                            error: () => {
                                MessageBox.error("Error deleting post.");
                            }
                        });
                    }
                }
            });
        },
        
        onEditButtonPress: function(oEvent) {
            const oButton = oEvent.getSource();
            const oContext = oButton.getBindingContext("posts");
            const oSelectedPost = oContext.getObject();

            // Get content inputs dynamically
            const aContent = this._oEditDialog.getContent();
            aContent[1].setValue(oSelectedPost.title);
            aContent[3].setValue(oSelectedPost.content);

            // Store current post for save operation
            this._currentEditPost = oSelectedPost;

            this._oEditDialog.open();
        },

        _onSaveEdit: function() {
            const aContent = this._oEditDialog.getContent();
            const sNewTitle = aContent[1].getValue();
            const sNewContent = aContent[3].getValue();
            const oSelectedPost = this._currentEditPost;

            if (!sNewTitle || !sNewContent) {
                MessageBox.error("Please enter both title and content.");
                return;
            }

            $.ajax({
                url: `http://localhost:5000/posts/${oSelectedPost.id}`,
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({
                    title: sNewTitle,
                    content: sNewContent
                }),
                success: () => {
                    const oModel = this.getView().getModel("posts");
                    const aPosts = oModel.getProperty("/posts");
                    const iIndex = aPosts.findIndex(p => p.id === oSelectedPost.id);
                    
                    if (iIndex !== -1) {
                        aPosts[iIndex].title = sNewTitle;
                        aPosts[iIndex].content = sNewContent;
                        oModel.setProperty("/posts", aPosts);
                    }
                    
                    MessageBox.success("Post updated successfully.");
                    this._oEditDialog.close();
                },
                error: () => {
                    MessageBox.error("Error updating post.");
                }
            });
        },

		onCreateNewPostButtonPress: function() {
            // Reset dialog inputs
            const aContent = this._oCreateDialog.getContent();
            aContent[1].setValue('');
            aContent[3].setValue('');

            this._oCreateDialog.open();
        },

        _onCreatePost: function() {
            const aContent = this._oCreateDialog.getContent();
            const sTitle = aContent[1].getValue();
            const sContent = aContent[3].getValue();

            if (!sTitle || !sContent) {
                MessageBox.error("Please enter both title and content.");
                return;
            }

            $.ajax({
                url: "http://localhost:5000/posts",
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    title: sTitle,
                    content: sContent
                }),
                success: (newPost) => {
                    const oModel = this.getView().getModel("posts");
                    const aPosts = oModel.getProperty("/posts");
                    
                    // Add new post to the beginning of the array
                    aPosts.unshift(newPost);
                    oModel.setProperty("/posts", aPosts);
                    
                    MessageBox.success("Post created successfully.");
                    this._oCreateDialog.close();
                },
                error: () => {
                    MessageBox.error("Error creating post.");
                }
            });
        }
	});
});
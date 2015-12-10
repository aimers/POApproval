// Utility for performing an approve/reject action

sap.ui.define([
	"sap/m/MessageToast",
	"nw/epm/refapps/ext/po/apv/controller/messages"
], function(MessageToast, messages) {
	"use strict";

	return {
		// This method performs approve/reject action on an array of PO IDs which of course might also contain only a single PO ID.
		// More precisely, it offers the following services
		// - Perform the function import for approving/rejecting in the backend
		// - Generic error handling
		// - Generic hiding of BusyIndicator
		// - Generic success message
		// Parameters:
		// - oView         - the view using this service (actually only used for retrieving models)
		// - bApprove      - flag whether this is an approve or a reject action
		// - sApprovalNote - note for this approval/rejection
		// - fnSuccess     - optional custom success handler
		approve: function(oView, bApprove, sApprovalNote, fnSuccess) {
			//var sFunction = bApprove ? "/ApprovePurchaseOrder" : "/RejectPurchaseOrder",
		  var sFunction = "/ApplyDecision",
				oModel = oView.getModel(),
				oResourceBundle = oView.getModel("i18n").getResourceBundle(),
				aPurchaseOrders = oView.getModel("appProperties").getProperty("/selectedPurchaseOrders"),
				i, aWorkItems = [],
				fnOnError = function(oResponse) {
					oView.getModel("appProperties").setProperty("/busy", false);
					messages.showErrorMessage(oResponse, oResourceBundle.getText("xtit.errorTitle"));
				},
				fnOk = function() {
					oView.getModel("appProperties").setProperty("/busy", false);
					if (fnSuccess) {
						fnSuccess();
					}
					var sSuccessMessage = "";
					if (aWorkItems.length === 1) {
						 
						sSuccessMessage = oResourceBundle.getText(bApprove ? "ymsg.approvalMessageToast" : "ymsg.rejectionMessageToast", aWorkItems[0].PO);
					} else {
						sSuccessMessage = oResourceBundle.getText(bApprove ? "ymsg.massApprovalMessageToast" : "ymsg.massRejectionMessageToast");
					}
					MessageToast.show(sSuccessMessage);
				};
			aWorkItems = aPurchaseOrders.map(function(oPurchaseOrder) {
				return {"PO":oPurchaseOrder.PoNumber, "WI":oPurchaseOrder.WorkitemID} ;
			});
			if (aWorkItems.length === 1) {
				oModel.callFunction(sFunction, {
					method: "POST",
					urlParameters: {
						WorkitemID: aWorkItems[0].WI,
						DecisionKey: bApprove ? "0001":"0002",
						Comment: sApprovalNote
					},
					success: fnOk,
					error: fnOnError
				});
			} else {
				for (i = 0; i < aPOIds.length; i++) {
					oModel.callFunction(sFunction, {
						method: "POST",
						urlParameters: {
							POId: aPOIds[i],
							Note: sApprovalNote
						},
						batchGroupId: "POMassApproval",
						changeSetId: i
					});
				}
				oModel.submitChanges({
					batchGroupId: "POMassApproval",
					success: fnOk,
					error: fnOnError
				});
			}
		}
	};
});
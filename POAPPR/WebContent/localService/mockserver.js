sap.ui.define([
	"sap/ui/core/util/MockServer",
	"nw/epm/refapps/ext/po/apv/localService/MockRequests"
], function(MockServer, MockRequests) {
	"use strict";

	return {
		/**
		 * Initializes the mock server. You can configure the delay with the URL parameter "serverDelay"
		 * The local mock data in this folder is returned instead of the real data for testing.
		 *
		 * @public
		 */
		init: function() {
			var oUriParameters = jQuery.sap.getUriParameters(),
				oMockServer = new MockServer({
					rootUri: "https://www.sapfioritrial.com/sap/opu/odata/SAP/GBAPP_POAPPROVAL;mo/"
				}),
				oRequests = new MockRequests(),
				sPath = jQuery.sap.getModulePath("nw.epm.refapps.ext.po.apv.localService"),
				aRequests;

			// configure mock server with a delay of 1s
			MockServer.config({
				autoRespond: true,
				//autoRespondAfter: (oUriParameters.get("serverDelay") || 0)
				autoRespondAfter: 1000
			});

			// load local mock data
//			oMockServer.simulate(sPath + "/metadata.xml", {
//				sMockdataBaseUrl: sPath + "/mockdata"
//			});
			
	  oMockServer.simulate(sPath + "/metadata.xml");
			
			//aRequests = oMockServer.getRequests();
			//oMockServer.setRequests(aRequests.concat(oRequests.getRequests()));
			oMockServer.start();

			alert("Running the app with mock data");
		}
	};
});
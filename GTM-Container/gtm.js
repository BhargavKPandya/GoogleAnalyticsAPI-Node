var admin= false;

window.dataLayer = window.dataLayer || [];
if (!admin){
    window.dataLayer.push({'ua_analytics_id': 'UA-165896120-4'});
}
function ua_record_page_view(page_title){
		window.dataLayer.push({
			'event':'virtualPageViewEvent',
			'virtualPageTitle': page_title
		});
    }	
    

    function ua_record_page_cancel(page_path){
		window.dataLayer.push({
			'event':'virtualPageCancelEvent',
			'virtualPageCancelPath': page_path
		});
	}  

function ua_track_event(event_category,event_action,event_label){
		window.dataLayer.push({
			'event':'portalEvent',
			'ua_event_category': event_category,
			'ua_event_action': event_action,
			'ua_event_label': event_label
		});
	}

function ua_record_rollup_page_title(page_title){
		window.dataLayer.push({
			'event':'rollupPageTitleEvent',
			'virtualPageTitle': page_title
		});
	}

/*
	function ua_track_demographics(demographicsName,demographicsValue,demographicsIndex){
		window.dataLayer.push({
			'event':'demographics',
			demographicsName: demographicsValue
			
		});
	}

	function ua_track_demographics(demographicsName,demographicsValue,demographicsIndex){
		window.dataLayer.push({
			'event':'demographics',
			'ua_demo_name': demographicsName,
			'ua_demo_value': demographicsValue,
			'ua_demo_index': demographicsIndex			
		});
	}

*/
    
    var ua_client_id = {'ua_client_id' : ''};
    var ua_user_login_status = {'ua_user_login_status' : ''};
    var ua_user_login_method = {'ua_user_login_method' : ''};
    var ua_user_portal_id = {'ua_user_portal_id' : ''};
    var ua_is_admin = {'ua_is_admin' : ''};
    var ua_tool_name = {'ua_tool_name' : ''};
    var ua_tool_version = {'ua_tool_version' : ''};
    var ua_demographic_main = [{'custom_dimesnion_8': ''}, {'custom_dimesnion_9': ''}, {'custom_dimesnion_10': ''}];
    var ua_demographic_rollup = [{'DBPLAN': ''}, {'DBSTATUS': ''}, {'DBGROUP': ''}, {'DBDEPARTMENT':''}, {'DBSUBSTATUS':''}, {'SBCWORKSTATUS':''}, {'SBCELIGSET':''}, {'SBCEMPSTAT':''}, {'PFEMPSTAT':''}, {'PFDIV':''}, {'PFSTATUS':''}, {'PFPLANCODE':''}, {'DCHasPEA_Bal':''}];


    function populate_demo(){
        window.dataLayer.push(ua_client_id, ua_user_login_status, ua_user_login_method, ua_user_portal_id, ua_tool_name, ua_tool_version, ua_is_admin);
        for(var i=0; i<ua_demographic_main.length; i++){
             window.dataLayer.push(ua_demographic_main[i]);  
        } 
        for(var i=0; i<ua_demographic_rollup.length; i++){
            window.dataLayer.push(ua_demographic_rollup[i]);          
        }    
    
    }


    var ua_demographic_main2 = [{'custom_dimesnion_8': 'Div1'}, {'custom_dimesnion_9': 'Status_fulltime'}, {'custom_dimesnion_10': 'Plan1'}, {'custom_dimesnion_11': 'Admin'}, {'custom_dimesnion_12': 'UWLM'}, {'custom_dimesnion_13': 'Retire'}];
    var ua_demographic_rollup2 = [{'DBPLAN': 'Active'}, {'DBSTATUS': 'Status_fulltime'}, {'DBGROUP': 'Plan1'}, {'DBDEPARTMENT':''}, {'DBSUBSTATUS':''},{'SBCWORKSTATUS':'InActive'}, {'SBCELIGSET':'State'}, {'SBCEMPSTAT':''}, {'PFEMPSTAT':''}, {'PFDIV':''}, {'PFSTATUS':''}, {'PFPLANCODE':''}, {'DCHasPEA_Bal':''}];
    

    function populate_demo2(){
        for(var i=0; i<ua_demographic_main2.length; i++){
             window.dataLayer.push(ua_demographic_main2[i]);  
        }
        for(var i=0; i<ua_demographic_rollup2.length; i++){
            window.dataLayer.push(ua_demographic_rollup2[i]);          
        }      
    }

//window.dataLayer.push(demographicsDB);





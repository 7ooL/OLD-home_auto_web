"use strict"; // see strict mode



jQuery(document).ready(function() {
	/* Show the HTML page only after the js and css are completely loaded */
	$('#clock').show();
	displayDate()
	date_time('clock'); // refresh every second
	$('#config_content').hide();

	// set off the main script
	grabConfigFile(); // refresh every 10

})

function getTime() {
	var date = new Date();
	var hours = date.getHours();
	if (hours < 10)
		hours = "0" + hours;
	var minutes = date.getMinutes();
	if (minutes < 10)
		minutes = "0" + minutes;
	var seconds = date.getSeconds();
	if (seconds < 10)
		seconds = "0" + seconds;
//	hours = 12;
//	minutes = 36;
	return '' + hours + ':' + minutes + ':' + seconds;
}

function displayDate() {
	var date = new Date();
	var day = date.getDay()
	var month = date.getMonth()
	var daym = date.getDate()
	var dayarray = new Array("Sunday", "Monday", "Tuesday", "Wednesday",
			"Thursday", "Friday", "Saturday")
	var montharray = new Array("January", "February", "March", "April", "May",
			"June", "July", "August", "September", "October", "November",
	"December")

	document.getElementById('day').innerHTML = dayarray[day];
	document.getElementById('month').innerHTML = montharray[month];
	document.getElementById('digit').innerHTML = daym;
}

function date_time(id) {
	document.getElementById(id).innerHTML = getTime();
	setTimeout('date_time("' + id + '");', '1000');
	return true;
}

function parseINIString(data) {
	var regex = {
			section : /^\s*\[\s*([^\]]*)\s*\]\s*$/,
			param : /^\s*([\w\.\-\_]+)\s*=\s*(.*?)\s*$/,
			comment : /^\s*;.*$/
	};
	var value = {};
	var lines = data.split(/\r\n|\r|\n/);
	var section = null;
	lines.forEach(function(line) {
		if (regex.comment.test(line)) {
			return;
		} else if (regex.param.test(line)) {
			var match = line.match(regex.param);
			if (section) {
				value[section][match[1]] = match[2];
			} else {
				value[match[1]] = match[2];
			}
		} else if (regex.section.test(line)) {
			var match = line.match(regex.section);
			value[match[1]] = {};
			section = match[1];
		} else if (line.length == 0 && section) {
			section = null;
		}
		;
	});
	return value;
}

function grabConfigFile() {
	var previous = "";
//	function{
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4) {
			if (ajax.responseText != previous) {
				$('#refresh').show("slow");
				document.getElementById('refresh').innerHTML = 'last updated at '
					+ getTime();
				previous = ajax.responseText;
				main(previous);
			}
		}
	};
	ajax.open("POST", "public.ini", true); // Use POST to avoid
	// caching
	ajax.send();
	// }
	setInterval(
			function() {
				var ajax = new XMLHttpRequest();
				ajax.onreadystatechange = function() {
					if (ajax.readyState == 4) {
						if (ajax.responseText != previous) {
							$('#refresh').show("slow");
							document.getElementById('refresh').innerHTML = 'last updated at '
								+ getTime();
							previous = ajax.responseText;
							main(previous);
						}
					}
				};
				ajax.open("POST", "public.ini", true); // Use POST to avoid
				// caching
				ajax.timeout = 500;
				ajax.send();
			}, 10000);
}


function checkImage(src, name) {
	var img = new Image();
	img.onload = function() {
		// code to set the src on success
		document.getElementById('people_home').innerHTML += '<img class="user_icon" src="/html/home-auto/img/user_img/'+name+'_icon.ico"/>';
	};
	img.onerror = function() {
		// doesn't exist or error loading
		document.getElementById('people_home').innerHTML += '<img class="user_icon" src="/html/home-auto/img/user_img/unknown_icon.ico"/>';
	};
	img.src = src; // fires off loading of image
}



function main(configs) {
	// parse updated config file
	console.log("parsing new config file: " + getTime());
	var settings = parseINIString(configs);

	// set background color
	if (settings.settings["vacation"] == 'on' ) {
		$("body").css("background-color","#580000");
		$("button").css("background", "#922222");
		$(".rubber").html("Vacation Mode Enabled");
		$('.rubber').show();
	} else if (settings.settings["movie"] == 'on'){
		$("body").css("background-color","#002c58");
		$("button").css("background", "#001325");
		$(".rubber").html("Movie Mode Enabled");
		$('.rubber').show();
	} else{
		$("body").css("background-color","#363636");
		$("button").css("background", "#444");
		$('.rubber').hide();
	}

	// build people home list
	document.getElementById('people_home').innerHTML = ""; // clear out names
	for(var name in settings.people_home) {
		if ( settings.people_home[name] == "yes") {
			checkImage('/html/home-auto/img/user_img/'+name+'_icon.ico', name);			
		}
	}

	// build weather bar.
	var wstr = settings.weather['icon_url'];
	if (wstr.includes("nt_")) {
		var w_icon = "nt_"+settings.weather['icon'];
	} else {
		var w_icon = settings.weather['icon'];	
	} 
	document.getElementById('current_weather_icon').innerHTML = '<img src="/html/home-auto/img/weather_icons/white/png/128x128/'+w_icon+'.png"/>';
	document.getElementById('current_weather_word').innerHTML = settings.weather['weather'];
	document.getElementById('current_weather_link').innerHTML = ' <a target="_blank" href="'+settings.weather['forecast_url']+'"><img src="/html/home-auto/img/more.png" width="15" height="15" border="0"></a>';
	// <i class="fa fa-plus-circle" aria-hidden="true" width="15" height="15"
	// border="0"></i>
	document.getElementById('current_weather_degree').innerHTML = settings.weather['ot'];


	// configure current lights scene display
	var lightBulb = '<i class="fa fa-lightbulb-o" aria-hidden="true" style="display: inline-block;"></i>'
		if (settings.auto['currentscene'] != 'null') {
			document.getElementById('lights_text').className = ('lightScene edit');
			switch (settings.auto['currentscene']) {
			case "morn_1":
				document.getElementById('lights_text').innerHTML = lightBulb+" Morning";
				break;
			case "daytime_1":
				document.getElementById('lights_text').innerHTML = lightBulb+" Daytime 1";
				break;
			case "scene_1":
				document.getElementById('lights_text').innerHTML = lightBulb+" Evening 1";
				break;
			case "scene_2":
				document.getElementById('lights_text').innerHTML = lightBulb+" Evening 2";
				break;
			case "scene_3":
				document.getElementById('lights_text').innerHTML = lightBulb+" Evening 3";
				break;
			case "scene_4":
				document.getElementById('lights_text').innerHTML = lightBulb+" Evening 4";
				break;
			case "scene_5":
				document.getElementById('lights_text').innerHTML = lightBulb+" Evening 5";
				break;
			default:
				document.getElementById('lights_text').innerHTML = settings.auto['currentscene'];
			}
		} else {
			document.getElementById('lights_text').className = ('off');
			document.getElementById('lights_text').innerHTML = 'Manual';	
		}

	$("#light_chooser").html('');




	// hvac status
	if (settings.hvac['status'] == "error") {
		console.log("home-auto-hvac offline")
		document.getElementById('hvac_text').className = ('error');
		document.getElementById('hvac_text').innerHTML = 'system unreachable';
		document.getElementById('humid_text').className = ('error');
		document.getElementById('humid_text').innerHTML = 'system unreachable';	
	}else {
		// heat mode if active
		if (settings.hvac_current['heat_mode'] == 'hpheat') {
			document.getElementById('hvac_icon').className = ('heating_icon');
			document.getElementById('hvac_icon').innerHTML = '<i class="fa fa-fire" aria-hidden="true"></i>';
			document.getElementById('hvac_text').className = ('heating');
			document.getElementById('hvac_text').innerHTML = 'Heating';	
		}else if (settings.hvac_current['heat_mode'] == 'hpelectheat') {
			document.getElementById('hvac_icon').className = ('heating_icon hpelectheat');
			document.getElementById('hvac_icon').innerHTML = '<i class="fa fa-fire" aria-hidden="true" style="display: inline-block;"></i> + <i class="fa fa-bolt" aria-hidden="true" style="display: inline-block;"></i>';
			document.getElementById('hvac_text').className = ('heating');
			document.getElementById('hvac_text').innerHTML = 'Heating + Electric';	
		}else if (settings.hvac_current['heat_mode'] == 'off') {
			document.getElementById('hvac_icon').className = ('');
			document.getElementById('hvac_icon').innerHTML = '';
			document.getElementById('hvac_text').className = ('off');
			document.getElementById('hvac_text').innerHTML = 'Off';	
		}else if (settings.hvac_current['heat_mode'] == 'cool') {
			document.getElementById('hvac_icon').className = ('cooling_icon');
			document.getElementById('hvac_icon').innerHTML = '<i class="fa fa-snowflake-o" aria-hidden="true"></i>';	
			document.getElementById('hvac_text').className = ('cooling');
			document.getElementById('hvac_text').innerHTML = 'Cooling';	
		}else {
			document.getElementById('hvac_icon').className = ('unknown_icon');
			document.getElementById('hvac_icon').innerHTML = '<i class="fa fa-question-circle-o" aria-hidden="true"></i>';
			document.getElementById('hvac_text').className = ('unknown');
			document.getElementById('hvac_text').innerHTML = settings.hvac_current['heat_mode'];
		}
		
		// humidity status
		if (settings.hvac_current['humid'] == 'on') {
			document.getElementById('humid_text').className = ('on');
			document.getElementById('humid_text').innerHTML = 'Running';	
		}else {
			document.getElementById('humid_text').className = ('off');
			document.getElementById('humid_text').innerHTML = 'Off';	
		}
		// system mode
		if (settings.hvac['mode'] == 'auto') {
			document.getElementById('hvac_mode').className = ('auto');
			document.getElementById('hvac_mode').innerHTML = "Auto";
		}else if (settings.hvac['mode'] == 'heat') {
			document.getElementById('hvac_mode').className = ('heat');
			document.getElementById('hvac_mode').innerHTML = "Heat";		
		}else if (settings.hvac['mode'] == 'cool') {
			document.getElementById('hvac_mode').className = ('cool');
			document.getElementById('hvac_mode').innerHTML = "Cool";		
		}else if (settings.hvac['mode'] == 'fanonly') {
			document.getElementById('hvac_mode').className = ('fanonly');
			document.getElementById('hvac_mode').innerHTML = "Fan Only ";		
		}else {
			document.getElementById('hvac_mode').className = ('empty');
			document.getElementById('hvac_mode').innerHTML = "none";
			// set the hvac mode to auto so script continues to run, real detail
			// will be updated withn 10 sec
			settings.hvac['mode'] = 'auto'
		}

		// define profile looks
		var home = '<i class="fa fa-home" aria-hidden="true" style="display: inline-block;"></i> Home';
		var sleep = '<i class="fa fa-bed" aria-hidden="true" style="display: inline-block;"></i> Sleep';
		var away = 'Away <i class="fa fa-arrow-right" aria-hidden="true" style="display: inline-block;"></i>';
		var wake = 'Wake <i class="fa fa-sun-o" aria-hidden="true" style="display: inline-block;"></i>';
		var vacation = '<i class="fa fa-suitcase" aria-hidden="true" style="display: inline-block;"></i> Vacation';
		var manual = 'Manual <i class="fa fa-hand-pointer-o" aria-hidden="true" style="display: inline-block;"></i>';
		

		// configure the profile disaply / chooser / edit window
		$("#profile_chooser").html('');

		$("#profile_chooser").append('<div id="profile_box" class="wake">'+wake+
				'<div class="profile_temps"><div class="clsp"><i class="fa fa-caret-down" aria-hidden="true"></i>'+settings.profile_current['wake_clsp']+'</div>' +
				'<div class="htsp"><i class="fa fa-caret-up" aria-hidden="true"></i>'+settings.profile_current['wake_htsp']+'</div></div></div>');

		$("#profile_chooser").append('<div id="profile_box" class="home">'+home+
				'<div class="profile_temps"><div class="clsp"><i class="fa fa-caret-down" aria-hidden="true"></i>'+settings.profile_current['home_clsp']+'</div>' +
				'<div class="htsp"><i class="fa fa-caret-up" aria-hidden="true"></i>'+settings.profile_current['home_htsp']+'</div></div>');

		$("#profile_chooser").append('<div id="profile_box" class="away">'+away+
				'<div class="profile_temps"><div class="clsp"><i class="fa fa-caret-down" aria-hidden="true"></i>'+settings.profile_current['away_clsp']+'</div>' +
				'<div class="htsp"><i class="fa fa-caret-up" aria-hidden="true"></i>'+settings.profile_current['away_htsp']+'</div></div>');

		$("#profile_chooser").append('<div id="profile_box" class="sleep">'+sleep+
				'<div class="profile_temps"><div class="clsp"><i class="fa fa-caret-down" aria-hidden="true"></i>'+settings.profile_current['sleep_clsp']+'</div>' +
				'<div class="htsp"><i class="fa fa-caret-up" aria-hidden="true"></i>'+settings.profile_current['sleep_htsp']+'</div></div>');

		$("#profile_chooser").append('<div id="profile_box" class="manual">'+manual+
				'<div class="profile_temps"><div class="clsp"><i class="fa fa-caret-down" aria-hidden="true"></i>'+settings.profile_current['manual_clsp']+'</div>' +
				'<div class="htsp"><i class="fa fa-caret-up" aria-hidden="true"></i>'+settings.profile_current['manual_htsp']+'</div></div>');

		$("#profile_chooser").append('<div id="profile_box" class="vacation">'+vacation+
				'<div class="profile_temps"><div class="clsp"><i class="fa fa-caret-down" aria-hidden="true"></i>'+settings.profile_current['vacmaxt']+'</div>' +
				'<div class="htsp"><i class="fa fa-caret-up" aria-hidden="true"></i>'+settings.profile_current['vacmint']+'</div></div>');



		// current profile running
		if (settings.hvac_current['currentactivity'] != 'null') {
			switch (settings.hvac_current['currentactivity']) {
			case "home":
				document.getElementById('hvac_profile_mode').className = ('home edit');
				document.getElementById('hvac_profile_mode').innerHTML = home;
				break;
			case "sleep":
				document.getElementById('hvac_profile_mode').className = ('sleep edit');
				document.getElementById('hvac_profile_mode').innerHTML = sleep;
				break;
			case "away":
				document.getElementById('hvac_profile_mode').className = ('away edit');
				document.getElementById('hvac_profile_mode').innerHTML = away;
				break;
			case "wake":
				document.getElementById('hvac_profile_mode').className = ('wake edit');
				document.getElementById('hvac_profile_mode').innerHTML = wake;
				break;
			case "vacation":
				document.getElementById('hvac_profile_mode').className = ('vacation edit');
				document.getElementById('hvac_profile_mode').innerHTML = vacation;
				break;
			case "manual":
				document.getElementById('hvac_profile_mode').className = ('manual edit');
				document.getElementById('hvac_profile_mode').innerHTML = manual;
				break;
			default:
				document.getElementById('hvac_profile_mode').className = ('manual edit');
			document.getElementById('hvac_profile_mode').innerHTML = settings.hvac_current['currentactivity'];

			}

		} else {
			$("#hvac_profile_mode").hide();	
		}
		// display updating if it is pending a refresh from havcauto.py
		if ( (settings.hvac_current['updating'] == "yes") || (settings.mornings['updating'] == "yes")) {
			$("#updating").show();
		} else {
			$("#updating").hide();
		}
		
		// disaply hold information
		if (settings.hvac_current['hold'] == 'on') {
			document.getElementById('hold_indicator').className = ('led-blue-small');
			document.getElementById('led-hold-text').innerHTML = "Hold until "+settings.hvac_current['hold_time'];
			document.getElementById('led-hold-text').className = ('text-on');
		}else {
			document.getElementById('hold_indicator').className = ('led-off');
			document.getElementById('led-hold-text').className = ('text-off');
			document.getElementById('led-hold-text').innerHTML = "Hold until 00:00"	
		}

		document.getElementById('hvac_filter').innerHTML =  "filter "+settings.hvac_current['filtrlvl']+"%";
		document.getElementById('humid_filter').innerHTML = "filter "+settings.hvac_current['humlvl']+"%";
		document.getElementById('hvac_filter').style.color =  getColor(settings.hvac_current['filtrlvl']/100);
		document.getElementById('humid_filter').style.color = getColor(settings.hvac_current['humlvl']/100);

		document.getElementById('current_weather_humid').innerHTML = "humidity "+settings.weather['oh']+"%";
		document.getElementById('current_inside_humid').innerHTML = " humidity "+settings.hvac_current['rh']+'%';
		document.getElementById('current_inside_degree').innerHTML = settings.hvac_current['rt'];
		document.getElementById('current_inside_degree').className = "edit";
		document.getElementById('current_inside_htsp').innerHTML = settings.hvac_current['htsp']
		document.getElementById('current_inside_clsp').innerHTML = settings.hvac_current['clsp'];
	}


	// create buttons for scenes and modes
	let options =["autorun","morning","evening","vacation","movie"]
	for (let id of options)
	{
		if (settings.settings[id] == 'on') {
			if ( settings.settings['autorun'] == 'off' && (id == "morning" || id == "evening") ) {
				document.getElementById(id).className = ('depth button_green_disabled');
				$("#disabled_"+id).show();
			}else {
				document.getElementById(id).className = ('depth button_green ');
				$("#disabled_"+id).hide();
			}
		} else {
			if ( settings.settings['movie'] == 'on' && (id == "autorun" ) ) {
				document.getElementById(id).className = ('depth button_green_disabled');
				$("#disabled_"+id).show();
			}else if (settings.settings['bed'] == 'on' && (id == "evening" ) ){
				document.getElementById(id).className = ('depth button_green_disabled');
				$("#disabled_"+id).show(); 
			}else {
				document.getElementById(id).className = ('depth button_gray');
				$("#disabled_"+id).hide();
			}
		}
	}

	// create buttons for lock status
	document.getElementById('button_label_lock').innerHTML = settings.lock['status'];
	if ( settings.lock['status'] == 'Locked' ) {
		document.getElementById('lock').className = ('depth button_green');
		document.getElementById('lock_symbol').innerHTML = '<i class="fa fa-lock" aria-hidden="true"></i>';
	} else if ( settings.lock['status'] == 'Unlocked' ) {
		document.getElementById('lock').className = ('depth button_red');
		document.getElementById('lock_symbol').innerHTML = '<i class="fa fa-unlock" aria-hidden="true"></i>';
	}else {
		document.getElementById('lock').className = ('depth button_gold');
	}

	
	document.getElementById("nextLight").innerHTML = '';
	document.getElementById("nextHVAC").innerHTML = '';
	// get next light event
	var nextLight = null;
	if (settings.settings["morning"] == 'on' && settings.settings["autorun"] == 'on') {
		var a = new Date('1970/01/01 ' + getTime());
		var b = new Date('1970/01/01 ' + settings.auto["morning_1_on_time"]);
		if ( a < b ) {
			nextLight = 'morning 1 at '+settings.auto["morning_1_on_time"];
		}
	}
	if (nextLight == null ) {
		if (settings.settings["morning"] == 'on' && settings.settings["autorun"] == 'on' ) {
			var a = new Date('1970/01/01 ' + getTime());
			var b = new Date('1970/01/01 ' + settings.auto["daytime_1_on_time"]);
			if ( a < b ) {
				nextLight = 'daytime 1 at '+settings.auto["daytime_1_on_time"];
			}
		}
	}
	if (nextLight == null ) {
		for ( var y = 1; y < 6 ; y++) {
			if (settings.settings["evening"] == 'on' && settings.settings["autorun"] == 'on' ) {
				if (settings.auto["scene_"+y+"_on_time"] != 'null' ) {
					var a = new Date('1970/01/01 ' + getTime());
					var b = new Date('1970/01/01 ' + settings.auto["scene_"+y+"_on_time"]);
					if ( a < b ) {
						nextLight = 'evening '+y+' at '+settings.auto["scene_"+y+"_on_time"];
						break;
					}
				} 
			}
		}
	}
	// get next hvac event for the day
	var nextHVAC ;
	var d = new Date(); 
	var today = d.getDay();
	for ( var y = 0; y < 5 ; y++) {
		if (settings.hvac["day_"+today+"_event_"+y+"_on_time"] != 'null' ) {	
			var a = new Date('1970/01/01 ' + getTime());
			var b = new Date('1970/01/01 ' + settings.hvac["day_"+today+"_event_"+y+"_on_time"]+":00");
			if ( a < b ) {
				nextHVAC = settings.hvac["day_"+today+"_event_"+y+"_activity"]+' at '+settings.hvac["day_"+today+"_event_"+y+"_on_time"]+':00';
				break;
			}
		} 
	}
	
	var nextIcon = '<i class="fa fa-chevron-right nextIcon" aria-hidden="true" style="display: inline-block;"></i>' 
	if ( nextHVAC != null ) {
		document.getElementById("nextHVAC").innerHTML = nextIcon + nextHVAC;
	}
	
	if ( nextLight != null ) {
		document.getElementById("nextLight").innerHTML = nextIcon + nextLight;
	}

//	document.getElementById("lightIcon").innerHTML = '<i class="fa fa-lightbulb-o light" aria-hidden="true" style="display: inline-block;"></i>'
//	document.getElementById("hvacIcon").innerHTML = '<i class="fa fa-thermometer-full hvac" aria-hidden="true" style="display: inline-block;"></i>'
	
	// remove dvr content before adding it again on reload
	for ( var y = 0; y < 3 ; y++) {
		var myNode = document.getElementById("the_schedule_"+y);
		while (myNode.firstChild) {
			myNode.removeChild(myNode.firstChild);
		}
	}
	// get schedule data for a few days
	for ( var y = 0; y < 3 ; y++) {

		var d = new Date(); 
		
		// convert current day javaScript monday(0) to Carrier Sunday(6)
		var mornDay = d.getDay()-1;
		if ( mornDay == -1 ) {
			mornDay = 6;
		}

		var dayDiv = document.createElement('div');
		dayDiv.id = 'day_'+y;
		dayDiv.className = 'day_box';
				
		var dayHeader = document.createElement('strong');
			
		if ( y == 0) {

			dayHeader.innerHTML = "Today";
			
			// made impossible so not to run
			for ( var x = 7; x < 6; x++) {
				var lightIcon = document.createElement('div');
				lightIcon.id = 'lightIcon';
				lightIcon.className = 'light';
				lightIcon.innerHTML = '<i class="fa fa-lightbulb-o" aria-hidden="true" style="display: inline-block;"></i>';
					
				var sceneName = document.createElement('div');
				sceneName.className = 'schName';
				sceneName.innerHTML = 'Evening '+x+' will trigger (dynamic)';
				
				var sceneTime = document.createElement('div');
				sceneTime.className = 'schTime';
				sceneTime.innerHTML = settings.auto["scene_"+x+"_on_time"];
				
				var timeSplit = settings.auto["scene_"+x+"_on_time"].split(":");
				d.setHours(timeSplit[0]);
				d.setMinutes(timeSplit[1]);
				d.setSeconds(timeSplit[2]);
				var att = document.createAttribute("data-datetime");
				att.value = d;
					
				var lightDiv = document.createElement('div');
				lightDiv.id = 'event';
				lightDiv.setAttributeNode(att); 
				lightDiv.appendChild(lightIcon);
				lightDiv.appendChild(sceneTime);
				lightDiv.appendChild(sceneName);
				//dayDiv.appendChild(lightDiv);
			}
			
		}
		if ( y == 1) {
			dayHeader.innerHTML = "Tomorrow";
			
			mornDay = mornDay+1
	
			if ( mornDay == 7 ) {
				   mornDay = 0;
			   }
			
			d.setDate(d.getDate() + 1);	
		}
		if ( y == 2) {
			mornDay = mornDay+2
			if ( mornDay == 8 ) {
				   mornDay = 1;
			   }
			if ( mornDay == 7 ) {
				   mornDay = 0;
			   }
			var weekday = new Array(7);
			weekday[0] = "Sunday";
			weekday[1] = "Monday";
			weekday[2] = "Tuesday";
			weekday[3] = "Wednesday";
			weekday[4] = "Thursday";
			weekday[5] = "Friday";
			weekday[6] = "Saturday";
			
	
			d.setDate(d.getDate() + 2);
			dayHeader.innerHTML = weekday[d.getDay()];
		}

		// add wake event based on global morning times			
		var lightIcon = document.createElement('div');
		lightIcon.id = 'schIcon';
		lightIcon.innerHTML = '<i class="fa fa-sun-o wake" aria-hidden="true" style="display: inline-block;"></i>'
			
		var mornName = document.createElement('div');
		mornName.className = 'schName';
		mornName.innerHTML = 'Wake up time';
			
		var mornTime = document.createElement('div');
		mornTime.className = 'schTime';
		var dayAtt = document.createAttribute("data-day-num"); 
		dayAtt.value = mornDay;
		mornTime.setAttributeNode(dayAtt);
		mornTime.innerHTML = settings.mornings[mornDay+"_morning"];
		
		var timeSplit = settings.mornings[mornDay+"_morning"].split(":");
	    d.setHours(timeSplit[0]);
	    d.setMinutes(timeSplit[1]);
	    d.setSeconds(timeSplit[2]);
	    var att = document.createAttribute("data-datetime");
		att.value = d;
		var att2 = document.createAttribute("data-popup-open");
		att2.value = "popup-4";
		var att3 = document.createAttribute("data-var");
		att3.value = dayHeader.innerHTML;
		var dayAtt2 = document.createAttribute("data-day-num"); 
		dayAtt2.value = mornDay;
					
		var lightDiv = document.createElement('div');
		lightDiv.id = 'event';
		lightDiv.className = 'edit';
		lightDiv.setAttributeNode(att);
		lightDiv.setAttributeNode(att2);
		lightDiv.setAttributeNode(att3);
		lightDiv.setAttributeNode(dayAtt2);
		lightDiv.appendChild(lightIcon);
		lightDiv.appendChild(mornTime);
		lightDiv.appendChild(mornName);
		dayDiv.appendChild(lightDiv);
		
		// add havc events
		var td = d.getDay();
	//	if ( td == -1 ) {
			//td = 6;
		//}
		for ( var z = 0; z < 5 ; z++) {
			if (settings.hvac["day_"+td+"_event_"+z+"_on_time"] != 'null' ) {
				if (settings.hvac["day_"+td+"_event_"+z+"_activity"] != 'wake' ) {
					var hvacIcon = document.createElement('div');
					hvacIcon.id = 'schIcon';
					if ( settings.hvac["day_"+td+"_event_"+z+"_activity"] == 'home' ) {
						hvacIcon.innerHTML = '<i class="fa fa-home home" aria-hidden="true" style="display: inline-block;"></i>';
					}
					else if ( settings.hvac["day_"+td+"_event_"+z+"_activity"] == 'sleep' ) {
						hvacIcon.innerHTML = '<i class="fa fa-bed sleep" aria-hidden="true" style="display: inline-block;"></i>';
					}
					else {
						hvacIcon.innerHTML = '<i class="fa fa-thermometer-half" aria-hidden="true" style="display: inline-block;"></i>';
					}
	
					
					var profileName = document.createElement('div');
					profileName.className = 'schName';
					profileName.innerHTML = settings.hvac["day_"+td+"_event_"+z+"_activity"]+' will trigger';
			
					var profileTime = document.createElement('div');
					profileTime.className = 'schTime';
					profileTime.innerHTML = settings.hvac["day_"+td+"_event_"+z+"_on_time"]+':00';
		
					var timeSplit = settings.hvac["day_"+td+"_event_"+z+"_on_time"].split(":");
					var nd = new Date(d);
					nd.setHours(timeSplit[0]);
					nd.setMinutes(timeSplit[1]);
					nd.setSeconds(0);
					var att = document.createAttribute("data-datetime");
					att.value = nd
			
					var	havcDiv = document.createElement('div');
					havcDiv.id = 'event';
					havcDiv.setAttributeNode(att); 
					havcDiv.appendChild(hvacIcon);
					havcDiv.appendChild(profileTime);
					havcDiv.appendChild(profileName);
					dayDiv.appendChild(havcDiv);
				}
			}
		}

		// get dvr shows 
		var shows = JSON.parse(settings.dvr[y+"_shows"]);
		for (var show in shows) {
			var dvrIcon = document.createElement('div');
			dvrIcon.id = 'schIcon';
			dvrIcon.className = 'tv';
			dvrIcon.innerHTML = '<i class="fa fa-television" aria-hidden="true" style="display: inline-block;"></i>'
			var showTime = document.createElement('div');
			showTime.className = "schTime";
			var timeSplit = shows[show].starttime.split(":");
			var nd = new Date(d);
		    nd.setHours(timeSplit[0])
		    nd.setMinutes(timeSplit[1])
		    nd.setSeconds(timeSplit[2])
		    var att = document.createAttribute("data-datetime");  
			att.value = nd
			showTime.innerHTML = shows[show].starttime;
			var showName = document.createElement('div');
			showName.className = "schName";
			showName.innerHTML = shows[show].title+"<br>"+shows[show].subtitle;
			
			var showDiv = document.createElement('div');
			showDiv.id = 'event';
			showDiv.setAttributeNode(att);
			showDiv.appendChild(dvrIcon);
			showDiv.appendChild(showTime);
			showDiv.appendChild(showName);	
			dayDiv.appendChild(showDiv);
			
		}
		
		var bc = document.createElement('div');
		bc.className = 'box_content';
		var sc = document.createElement('div');
		sc.id = 'schedule_'+y;
			
		document.getElementById('the_schedule_'+y).appendChild(dayHeader);
		document.getElementById('the_schedule_'+y).appendChild(bc);
		document.getElementById('the_schedule_'+y).appendChild(sc);
		document.getElementById('schedule_'+y).appendChild(dayDiv);
		
		// sort the day
		var day = $('#day_'+y);
		var days = day.children('#event').detach().get();	
		days.sort(function(a, b) {
		return new Date($(a).data("datetime")) - new Date($(b).data("datetime"));
		  });
		day.append(days);	
		//console.log('y == '+y+' md:' +mornDay + ' d:' +d);	
	}
	


	// show all ids that are based on reading the config file
	$("#config_content").show();
}

//get color function
function getColor(value){
	// value from 0 to 1
	var hue=((1-value)*120).toString(10);
	return ["hsl(",hue,",100%,50%)"].join("");
}

//button actions
function toggleButton(thing) {
	var previous = "";
	var ajax = new XMLHttpRequest();
	ajax.onreadystatechange = function() {
		if (ajax.readyState == 4) {
			if (ajax.responseText != previous) {
				$('#refresh').show("slow");
				document.getElementById('refresh').innerHTML = 'last updated at '
					+ getTime();
				previous = ajax.responseText;
				var settings = parseINIString(previous);
				if ( thing == "autorun" && (settings.settings["movie"] == 'on')) {
					alert("You can't configure AutoRun while Movie mode is active.");
				}else {
					var action = "";
					if ( settings.settings[thing] == 'on'){
						document.getElementById(thing).className = ('depth button_gold');
						action = 'off';
					}else {
						document.getElementById(thing).className = ('depth button_gold');
						action = 'on';
					}
					jQuery.ajax({
						type: "POST",
						url: 'home-auto.php',
						dataType: 'json',
						data: {functionname: action, arguments: thing},
						success: function (obj, textstatus) {
							if( ('error' in obj) ) {            
								console.log(obj.error);
							}
						}
					});
				}
			}
		}
	};
	ajax.open("POST", "public.ini", true); // Use POST to avoid
	// caching
	ajax.send();
}

function sendCommand(job) {
	if ( job == 'set_morning' ) {
		var ele_next = $("div.schedule_changer");
	//	 $("div.save_gm[data-day-num='"+dayNum+"']")[0].innerText.split(':');
		var day = ele_next.find(".save_gm").data("dayNum");
		var tim = ele_next.find(".ti_tx input").val();
		var mini = ele_next.find(".mi_tx input").val();
		var d = new Date();
		var args = Math.floor(d / 1000) + "," +day + "," + tim + ":" + mini;
	}
	else {
		var ele_next = $("div.timepicker_wrap");
		var temp = ele_next.find(".te_tx input").val();
		var tim = ele_next.find(".ti_tx input").val();
		var mini = ele_next.find(".mi_tx input").val();
		var d = new Date();
		var args = Math.floor(d / 1000) + "," +temp + "," + tim + ":" + mini;
		// display updating if it is pending a refresh from havcauto.py
	}
	

	console.log(args);
	jQuery.ajax({
		type: "POST",
		url: 'home-auto.php',
		dataType: 'json',
		data: {functionname: job, arguments: args},
		success: function (obj, textstatus) {
			if( ('error' in obj) ) {            
				console.log(obj.error);
			}
		}
	});
	$('[data-popup-close]').click()
}



function hold_hvac() {

	var d = new Date();
	var ti = d.getHours();
	var interval = 15 * 60 * 1000;    // 15 minutes in miliseconds
	// var mi = d.getMinutes();
	var mi = new Date(Math.ceil(d.getTime() / interval) * interval).getMinutes();

	var ele_next = $("div.timepicker_wrap");

	ele_next.find(".te_tx input").val(parseFloat(document.getElementById('current_inside_degree').innerHTML));
	if (ti < 10) {
		ele_next.find(".ti_tx input").val("0" + ti);
	} else {
		ele_next.find(".ti_tx input").val(ti);
	}
	if (mi < 10) {
		ele_next.find(".mi_tx input").val("0" + mi);
	} else {
		ele_next.find(".mi_tx input").val(mi);
	}

	// increase hour if minutes are zero.
	if ( mi == 0 ) {
		change_time('next', 'set_hvac_hold');
	}	

}


function change_time(direction, job) {
	if ( job == 'set_morning' ) {
		var ele_next = $("div.schedule_changer");
	}
	else {
		var ele_next = $("div.timepicker_wrap");
	}
	var cur_cli = "time";
	var cur_time = Number(ele_next.find("." + cur_cli + " .ti_tx input").val());
	var ele_st = 0;
	var ele_en = 23;
	var step_size = 1;
	if (direction === 'next') {
		if (cur_time + step_size > ele_en) {
			var min_value = ele_st;
			if (min_value < 10) {
				min_value = '0' + min_value;
			} else {
				min_value = String(min_value);
			}
			ele_next.find("." + cur_cli + " .ti_tx input").val(min_value);
		} else {
			cur_time = cur_time + step_size;
			if (cur_time < 10) {
				cur_time = "0" + cur_time;
			}
			ele_next.find("." + cur_cli + " .ti_tx input").val(cur_time);
		}
	} else if (direction === 'prev') {
		var minValue = ele_st;
		if (cur_time - step_size < minValue) {
			var max_value = ele_en;
			if (max_value < 10) {
				max_value = '0' + max_value;
			} else {
				max_value = String(max_value);
			}
			ele_next.find("." + cur_cli + " .ti_tx input").val(max_value);
		} else {
			cur_time = cur_time - step_size;
			if (cur_time < 10) {
				cur_time = "0" + cur_time;
			}
			ele_next.find("." + cur_cli + " .ti_tx input").val(cur_time);
		}
	}
}

//change temp
function change_temp(direction, job) {
	if ( job == 'set_morning' ) {
		var ele_next = $("div.schedule_changer");
	}
	else {
		var ele_next = $("div.timepicker_wrap");
	}
	var cur_cli = "temp";
	var cur_temp = Number(ele_next.find("." + cur_cli + " .te_tx input").val());
	var ele_st = 60;
	var ele_en = 80;
	var step_size = 1;
	if ( direction === 'next') {
		if (cur_temp + step_size > ele_en) {
			ele_next.find("." + cur_cli + " .te_tx input")
			.val(ele_st);
		} else {
			cur_temp = cur_temp + step_size;
			if (cur_temp < 10) {
				ele_next.find(
						"." + cur_cli + " .te_tx input")
						.val("0" + cur_temp);
			} else {
				ele_next.find(
						"." + cur_cli + " .te_tx input")
						.val(cur_temp);
			}
		}
	} else if ( direction === 'prev') {
		if (cur_temp - step_size <= ele_st) {
			ele_next.find("." + cur_cli + " .te_tx input")
			.val(ele_en + 1 - step_size);
		} else {
			cur_temp = cur_temp - step_size;
			if (cur_temp < 10) {
				ele_next.find(
						"." + cur_cli + " .te_tx input")
						.val("0" + cur_temp);
			} else {
				ele_next.find(
						"." + cur_cli + " .te_tx input")
						.val(cur_temp);
			}
		}
	}
}

function change_mins(direction, job) {
	if ( job == 'set_morning' ) {
		var ele_next = $("div.schedule_changer");
		var step_size = 1;
	}
	else {
		var ele_next = $("div.timepicker_wrap");
		var step_size = 15;
	}
	var cur_cli = "mins";
	var cur_mins = Number(ele_next.find(
			"." + cur_cli + " .mi_tx input").val());
	var ele_st = 0;
	var ele_en = 59;
	
	var overflow_minutes = true;
	if (direction === 'next') {
		if (cur_mins + step_size > ele_en) {
			ele_next.find("." + cur_cli + " .mi_tx input")
			.val("00");
			if (overflow_minutes) {
				change_time('next', job);
			}
		} else {
			cur_mins = cur_mins + step_size;
			if (cur_mins < 10) {
				ele_next.find(
						"." + cur_cli + " .mi_tx input")
						.val("0" + cur_mins);
			} else {
				ele_next.find(
						"." + cur_cli + " .mi_tx input")
						.val(cur_mins);
			}
		}
	} else if (direction === 'prev') {
		if (cur_mins - step_size <= -1) {
			ele_next.find("." + cur_cli + " .mi_tx input")
			.val(ele_en + 1 - step_size);
			if (overflow_minutes) {
				change_time('prev', job);
			}
		} else {
			cur_mins = cur_mins - step_size;
			if (cur_mins < 10) {
				ele_next.find(
						"." + cur_cli + " .mi_tx input")
						.val("0" + cur_mins);
			} else {
				ele_next.find(
						"." + cur_cli + " .mi_tx input")
						.val(cur_mins);
			}
		}
	}
}

function createMorningEdit(day, dayNum){
	
	var myNode = $(".schedule_changer");
    $(".hold_words_gm").remove();
    $(".save_gm").remove();

	// find data-day-num for dayNum and get innerHTML
    var time = $("div.schTime[data-day-num='"+dayNum+"']")[0].innerText.split(':');
    //console.log(time)
    
    var d = new Date();
	var ti = time[0];
	var mi = time[1];

	var ele_next = $("div.schedule_changer");
	ele_next.find(".ti_tx input").val(ti);
	ele_next.find(".mi_tx input").val(mi);
	  
	var  hwDiv = document.createElement('div');
	hwDiv.className = 'hold_words hold_words_gm';
	hwDiv.innerHTML = day+"'s Wake Up Time ("+dayNum+")";
	
	var sdiv = document.createElement('div');
	sdiv.className = 'save save_gm'
	var satt = document.createAttribute("onClick");  
	satt.value = "sendCommand('set_morning');"
	sdiv.setAttributeNode(satt);
	var satt2 = document.createAttribute("data-day-num");  
	satt2.value = dayNum
	sdiv.setAttributeNode(satt2);
		
	var idiv = document.createElement('i');
	idiv.className = 'fa fa-check-circle action-prev'
	var iatt = document.createAttribute("aria-hidden");  
	iatt.value = "true"
	
	idiv.setAttributeNode(iatt);

	myNode.prepend(hwDiv);	
	myNode.append(sdiv);
	sdiv.append(idiv);
}

$(function() {
	// ----- OPEN
	$("body").on('click', '[data-popup-open]', function(e)  {
		var targeted_popup_class = jQuery(this).attr('data-popup-open');
		var optionalVar = jQuery(this).attr('data-var');
		if (optionalVar != null){
			var dayNum = jQuery(this).attr('data-day-num');
		    createMorningEdit(optionalVar, dayNum);
		}
		$('[data-popup="' + targeted_popup_class + '"]').fadeIn(350);

		e.preventDefault(optionalVar);
	});

	// ----- CLOSE
	$('[data-popup-close]').on('click', function(e)  {
		var targeted_popup_class = jQuery(this).attr('data-popup-close');
		$('[data-popup="' + targeted_popup_class + '"]').fadeOut(350);

		e.preventDefault();
	});
});



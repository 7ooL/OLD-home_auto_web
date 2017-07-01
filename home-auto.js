"use strict"; // see strict mode



jQuery(document).ready(function() {
	/* Show the HTML page only after the js and css are completely loaded */
	$('#clock').show();
	displayDate()
	date_time('clock'); // refresh every second
	grabConfigFile(); // refresh every 10
	$('#config_content').hide();
	$('#hvac_info').hide();
	createGaugeTemp(1,1,1,1);
	creategaugeHumid(1,1);
	createFilterGauge(1, 1);
	
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
// hours = 12;
// minutes = 36;
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
// function{
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
    document.getElementById('people_home').innerHTML = ""; //clear out names
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
    //'nt_'+settings.weather['icon']
    
    document.getElementById('current_weather_icon').innerHTML = '<img src="/html/home-auto/img/weather_icons/white/png/64x64/'+w_icon+'.png"/>';
    document.getElementById('current_weather_word').innerHTML = settings.weather['weather'];
    document.getElementById('current_weather_link').innerHTML = ' <a target="_blank" href="'+settings.weather['forecast_url']+'"><img src="/html/home-auto/img/more.png" width="15" height="15" border="0"></a>';
    document.getElementById('current_weather_degree').innerHTML = settings.weather['ot'];
    
    
	// configure current scene, hide if there is none
	if (settings.auto['currentscene'] != 'null') {
        document.getElementById('lights_indicator').className = ('led-green');
        document.getElementById('lights_led_text').innerHTML = 'Lights: '+ settings.auto['currentscene'];	
	} else {
        document.getElementById('lights_indicator').className = ('led-off-big');
        document.getElementById('lights_led_text').innerHTML = 'Lights: Manual';	
	}
	
	if (settings.settings['autorun'] == 'off') {
		if ( settings.settings['movie'] == 'on' ) {
	        document.getElementById('autorun_indicator').className = ('led-yellow');
	        document.getElementById('autorun_led_text').innerHTML = 'AutoRun is paused';
		}else {
			document.getElementById('autorun_indicator').className = ('led-red');
			document.getElementById('autorun_led_text').innerHTML = 'AutoRun is turned OFF';	
		}
	}else {
        document.getElementById('autorun_indicator').className = ('led-green');
        document.getElementById('autorun_led_text').innerHTML = 'AutoRun is running';		
	}

	if (settings.hvac['status'] == "error") {
		console.log("home-auto-hvac offline")
		document.getElementById('hvac_indicator').className = ('led-red');
		document.getElementById('hvac_led_text').innerHTML = 'HVAC: system unreachable';
		document.getElementById('humid_indicator').className = ('led-red');
		document.getElementById('humid_led_text').innerHTML = 'HVAC: system unreachable';	
	}else {
    	// heat mode if active
		if (settings.hvac_current['heat_mode'] == 'hpheat') {
			document.getElementById('hvac_indicator').className = ('led-red');
			document.getElementById('hvac_led_text').innerHTML = 'Heatpump Heating';	
		}else if (settings.hvac_current['heat_mode'] == 'hpelectheat') {
			document.getElementById('hvac_indicator').className = ('led-red');
			document.getElementById('hvac_led_text').innerHTML = 'Heatpump Heating + Electric';	
		}else if (settings.hvac_current['heat_mode'] == 'off') {
			document.getElementById('hvac_indicator').className = ('led-off-big');
			document.getElementById('hvac_led_text').innerHTML = 'Heatpump Off';	
		}else if (settings.hvac_current['heat_mode'] == 'cool') {
			document.getElementById('hvac_indicator').className = ('led-blue');
			document.getElementById('hvac_led_text').innerHTML = 'Heatpump Cooling';	
		}else {
			document.getElementById('hvac_indicator').className = ('led-yellow');
			document.getElementById('hvac_led_text').innerHTML = 'Heatpump '+settings.hvac_current['heat_mode'];
			console.log("heat_mode set to:"+settings.hvac_current['heat_mode']);
		}
		// humidity status
		if (settings.hvac_current['humid'] == 'on') {
			document.getElementById('humid_indicator').className = ('led-green');
			document.getElementById('humid_led_text').innerHTML = 'Hudmidifier Running';	
		}else {
			document.getElementById('humid_indicator').className = ('led-off-big');
			document.getElementById('humid_led_text').innerHTML = 'Hudmidifier Off';	
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
		// current profile running
		if (settings.hvac_current['currentactivity'] != 'null') {
			switch (settings.hvac_current['currentactivity']) {
			case "home":
				document.getElementById('hvac_profile_gauge').className = ('home');
				break;
			case "sleep":
				document.getElementById('hvac_profile_gauge').className = ('sleep');
				break;
			case "away":
				document.getElementById('hvac_profile_gauge').className = ('away');
				break;
			case "wake":
				document.getElementById('hvac_profile_gauge').className = ('wake');
				break;
			case "vacation":
				document.getElementById('hvac_profile_gauge').className = ('vacation');
				break;
			case "manual":
				document.getElementById('hvac_profile_gauge').className = ('manual');
				break;
			default:
				$("#hvac_profile_gauge").hide();
			}
			document.getElementById('hvac_profile_gauge').innerHTML = settings.hvac_current['currentactivity'];
		} else {
			$("#hvac_profile_gauge").hide();	
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
		// draw the guages with new information
	    // hvac dashboard
		var tgauge = $("#temp-gauge").data("kendoRadialGauge");
		tgauge.options.scale.ranges[0].from = parseInt(settings.hvac_current['htsp'])-10 
		tgauge.options.scale.ranges[0].to = settings.hvac_current['htsp'];
		tgauge.options.scale.ranges[2].from = settings.hvac_current['htsp'] 
		tgauge.options.scale.ranges[2].to = settings.hvac_current['clsp'];
		tgauge.options.scale.ranges[1].from = settings.hvac_current['clsp']
		tgauge.options.scale.ranges[1].to = parseInt(settings.hvac_current['clsp'])+10;
		tgauge.options.pointer[0].value = settings.hvac_current['rt'];
		tgauge.options.pointer[1].value = settings.weather['ot'];
		tgauge.redraw();
		var hgauge = $("#humid-gauge").data("kendoRadialGauge");
		hgauge.options.pointer[0].value = settings.hvac_current['rh'];
		hgauge.options.pointer[1].value = settings.weather['oh'];
		hgauge.redraw();
		var filtergauge = $("#filter-gauge").data("kendoChart");
		filtergauge.options.series[1].data[0] =  settings.hvac_current['filtrlvl'];
		filtergauge.options.series[1].color = getColor(settings.hvac_current['filtrlvl']/100);
		filtergauge.options.series[0].data[0] =  settings.hvac_current['humlvl'];
		filtergauge.options.series[0].color = getColor(settings.hvac_current['humlvl']/100);
		filtergauge.refresh();
		$('#hvac_info').show();
		
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
		

   
    // populate todays schedule rows 1-7 are lights, rows 8-11 are HVAC, 11-20
	// are TV
    var icon=0, time=1, dialog=2, x=0, row, color, tcinner, dcinner;
    
	// build todays schedule
	if (document.contains(document.getElementById("schedule_table"))) {
        document.getElementById("schedule_table").remove();
    }
    var schedule = document.getElementById("schedule")
    var tbl  = document.createElement('table');
    tbl.id = "schedule_table";
    schedule.appendChild(tbl);

    var table = document.getElementById("schedule_table").createCaption();
    table.innerHTML = "<b>Upcoming Events</b>";
    
    
   // $("#schedule").hide();
    var tbl = document.getElementById("schedule_table")
    
    if (settings.settings["morning"] == 'on' && settings.settings["autorun"] == 'on') {
        color="gold";
        tcinner = settings.auto["morning_1_on_time"];
        dcinner = "Lights morning 1 will activate, taking "+Math.round((settings.auto["morn_1_trans_time"]/60)/10)+" minutes to fade in.";
        myCreateTableFunction(x,icon,time,dialog, color, tcinner, dcinner)
        x = x +1; 
    } 
    
    if (settings.settings["morning"] == 'on' && settings.settings["autorun"] == 'on' ) {
        color = "gold"
        tcinner = settings.auto["daytime_1_on_time"];
        dcinner= "Lights daytime 1 will activate, taking "+Math.round((settings.auto["daytime_1_trans_time"]/60)/10)+" minutes to fade in."; 
        myCreateTableFunction(x,icon,time,dialog, color, tcinner, dcinner)
        x = x +1;
    } 
    // see if lights are coming on and if so add a row for them
    for ( var y = 1; y < 6 ; y++) {
    	if (settings.settings["evening"] == 'on' && settings.settings["autorun"] == 'on' ) {
            if (settings.auto["scene_"+y+"_on_time"] != 'null' ) {
                color ="gold";
                tcinner = settings.auto["scene_"+y+"_on_time"]
                dcinner = "Lights evening "+y+" will activate, taking "+Math.round((settings.auto["scene_"+y+"_trans_time"]/60)/10)+" minutes to fade in."; 
                myCreateTableFunction(x,icon,time,dialog, color, tcinner, dcinner)
                x = x +1;
            } 
        }
    }
    
   
    // fill in hvac data for the day
    for ( var y = 1; y < 5 ; y++) {
        if (settings.hvac["event_"+y+"_on_time"] != 'null' ) {
            color = "red";
            tcinner = settings.hvac["event_"+y+"_on_time"]+":00"
            dcinner = "HVAC "+settings.hvac["event_"+y+"_activity"]+" profile will activate."; 
            myCreateTableFunction(x,icon,time,dialog, color, tcinner, dcinner)
            x = x +1;
            } 
    }
       
    // fill in tv data for today
    var shows = JSON.parse(settings.extra['upcoming_shows']);
    for (var show in shows) {
    	 color = "blue";
         tcinner = shows[show].starttime;
         dcinner= "DVR '"+shows[show].title+"' - '"+shows[show].subtitle+"' will start to record.";
         myCreateTableFunction(x,icon,time,dialog, color, tcinner, dcinner)
         x = x +1;
    }
    
    sortTable("schedule_table",time);
    embelishRows("schedule_table",time);
    
    
    
    // read log file and add to entry
    
    
    
    
 
    // show todays schedule, after it has been generated
    $("#schedule").show();
	// show all ids that are based on reading the config file
    $("#config_content").show();
}

// get color function
function getColor(value){
    // value from 0 to 1
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

// button actions
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

$(document).ready(function(){
    $(".hide_show").click(function(){
        $(".past_event").toggle();
     });
});

// disable grey out past rows and highlight latest
function embelishRows(name, col) {
	 var table = document.getElementById(name).tBodies[0];
	 var row, cellTime;
	 var currentTime = getTime();
     for(var i=0, len=table.rows.length; i<len; i++){
    	 cellTime = table.rows[i].cells[col].innerHTML;
    	 if (new Date('1970/01/01 ' + cellTime ) < new Date('1970/01/01 ' + currentTime)) {
    		 table.rows[i].style.color = '#C0C0C0';
    	     if (i == (table.rows.length-1)) {
    	 	    table.rows[i].cells[0].className = "circle circle_black";
    	 	    table.rows[i].className = "past_event";
      	 		}
    			 if (i >= 1) {
   	 		        table.rows[i-1].cells[0].className = "circle circle_black";
   	 		        table.rows[i-1].className = "past_event";
     	 		}

    	 }else {
    	     if (i != 0) {
    	    	table.rows[(i-1)].style.color = '#ff0000 ';
    		 }
    	 	 if (i > 1) {
  	 		    table.rows[i-2].cells[0].className = "circle circle_black";
  	 		    table.rows[i-2].className = "past_event";
    	 	 }
    	 	for (var y=0; y<(i-1); y++) {
    	 	  	table.rows[y].cells[0].className = "circle circle_black";
    	 	  	table.rows[y].className = "past_event";
  	 		}
    	 	
    		    	 break;
    	 }
     }
}

     


// sort table 'name' by col 'col'
function sortTable(name,col){
    var tbl = document.getElementById(name).tBodies[0];
    var store = [];
    for(var i=0, len=tbl.rows.length; i<len; i++){
        var row = tbl.rows[i];
        var sortnr = row.cells[col].innerText;
        // var sortnr = parseFloat(row.cells[col].textContent ||
		// row.cells[col].innerText);
        // if(!isNaN(sortnr)) store.push([sortnr, row]);
        store.push([sortnr, row]);
    }
    store.sort(function(x,y){
        // return x[0] - y[0];
    	 return new Date('1970/01/01 ' + x[0]) - new Date('1970/01/01 ' + y[0]);
    });
    for(var i=0, len=store.length; i<len; i++){
        tbl.appendChild(store[i][1]);
    }
    store = null;
}

function myCreateTableFunction(x,icon,time,dialog,color,tcinner,dcinner) {
	// build todays schedule
// if (document.contains(document.getElementById("schedule_table"))) {
        // document.getElementById("schedule_table").remove();
    // }
    // var schedule = document.getElementById("schedule")
   // var tbl = document.createElement('table');
 // tbl.id = "schedule_table";
    $("#schedule").hide();
    var tbl = document.getElementById("schedule_table")
    var row = tbl.insertRow(0);
    var iconCell = row.insertCell(icon);
    var timeCell = row.insertCell(time);
    var dialogCell = row.insertCell(dialog);
	iconCell.className = "circle circle_"+color;
    timeCell.innerHTML = tcinner;
    dialogCell.innerHTML = dcinner;
}


function createGaugeTemp(rt,htsp,clsp,ot) {
	
    $("#temp-gauge").kendoRadialGauge({
    	theme: "black",
    	// renderAs: "canvas",
    	pointer: [{
            value: rt, // current temp
            color: "#ea7001",
            cap: { size: 0.15 }
         
        },{
            value: ot, // current temp
            color: "#cc0000",
            cap: { size: 0.05 }
         
        }],

        scale: {
        	startAngle: -60,
            endAngle: 240,

            min: -10,
            max: 110,

            majorTicks: {
                width: 1,
                size: 14
            },
            majorUnit: 10,

            minorTicks: {
                size: 5
            },

            minorUnit: 2,
    
            ranges: [
                {
                    from: parseInt(htsp)-10, // heat setpoint
                    to: htsp,
                    color: "#cc0000"
                }, {
                    from: clsp, // cool setpoint
                    to: parseInt(clsp)+10,
                    color: "#0000cc"
                }, {
                    from: htsp, // activate range
                    to: clsp,
                    color: "#00cc00"
                }
            ],
            labels: {
                font: "11px Arial,Helvetica,sans-serif",
                // position: "outside"
            }
               		
       }
    });
}

function creategaugeHumid(rh,oh) {
	$("#humid-gauge").kendoRadialGauge({
        theme: "black",
        // renderAs: "canvas",

        pointer: [{
            value: rh,
            color: "#ea7001",
            cap: { size: 0.15 }
        },{
            value: oh,
            color: "#cc0000"
        }],

        scale: {
            startAngle: -45,
            endAngle: 120,

            min: 20,
            max: 60,

            majorUnit: 5,
            majorTicks: {
                width: 1,
                size: 7
            },

            minorUnit: 1,
            minorTicks: {
                size: 5
            },

            ranges: [{ // full range from 32-53
                from: 45,
                to: 50,
                color: "#cc0000" // top band
            },{
                from: 35,
                to: 45,
                color: "#00cc00" // middle band
            },{
                from: 30,
                to: 35,
                color: "#cc0000" // bottom band
            }], 

            labels: {
                font: "11px Arial,Helvetica,sans-serif"
            }
        }
    });
		
}

function createFilterGauge(filtrlvl, humlvl) {
	$("#filter-gauge").kendoChart({
	
        title: {
            text: "Filters",
            visible: false
        },
          legend: {
            visible: false
        },
        chartArea: {
            width: 80,
            height: 40,
            background: "transparent",
  
                },
        seriesDefaults: {
            type: "bar",
            	   labels: {
                       visible: false,
                       background: "transparent"
                   }
        },
        series: [{
            name: "humidity Filter",
            data: [humlvl]
        }, {
            name: "air Filter",
            data: [filtrlvl]
        }],
        valueAxis: {
            max: 100,
            visible: true,
            line: {
                visible: false
            },
            minorGridLines: {
                visible: false
            },
            labels: {
                rotation: "auto",
                	visible: false
            }
        },
        categoryAxis: {
            categories: ["Used"],
            visible: false,
            majorGridLines: {
                visible: false
            }
        },
        tooltip: {
            visible: false,
            template: "#= series.name #: #= value #"
        },
        transitions: true
    });
	
	
	
}


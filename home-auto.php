
<html>
<head>
<title>Home-Auto</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" type="text/css" href="home-auto.css">
<link rel="stylesheet" type="text/css" href="fonts/font-awesome.min.css">
<link rel="shortcut icon" href="home-auto.ico">


<script type="text/javascript" src="jquery-3.2.1.js"></script>
<script type="text/javascript" src="jquery-ui.min.js"></script>
<script type="text/javascript" src="home-auto.js"></script>

 <style>

  .ui-tabs-vertical .ui-tabs-nav { padding: .2em .1em .2em .2em; float: left;}
  .ui-tabs-vertical .ui-tabs-nav li { clear: left; width: 100%;}
  .ui-tabs-vertical .ui-tabs-nav li a { display:block; }
 
  </style>

</head>
<body>

	<div class="main">
		<div class="left">


			<div id="door" class="icon">
				<strong>Front Door</strong>
				<button id="lock" onclick="toggleButton('lock');">
					<div id='lock_symbol'></div>
				</button>
			</div>
			<div id="button_content" class="icon">
				<strong>Controls</strong>
				<div id="buttons">
					<button id="autorun" onclick="toggleButton('autorun');">
						<div id="buttonIcon_autorun" class="buttonIcon"></div>
						<div class="button_label">AutoRun</div>
						<div id="disabled_autorun" class="disabled">Paused</div>
					</button>
				</div>
				<div id="buttons">
					<button id="morning" onclick="toggleButton('morning');">
						<div id="buttonIcon_morning" class="buttonIcon"></div>
						<div class="button_label">Morning</div>
						<div id="disabled_morning" class="disabled">Paused</div>
					</button>
				</div>
				<div id="buttons">
					<button id="evening" onclick="toggleButton('evening');">
						<div id="buttonIcon_evening" class="buttonIcon"></div>
						<div class="button_label">Evening</div>
						<div id="disabled_evening" class="disabled">Paused</div>
					</button>
				</div>
				<div id="buttons">
					<button id="movie" onclick="toggleButton('movie');">
						<div id="buttonIcon_movie" class="buttonIcon"></div>
						<div class="button_label">Movie</div>
					</button>
				</div>
				<div id="buttons">
					<button id="vacation" onclick="toggleButton('vacation');">
						<div id="buttonIcon_vacation" class="buttonIcon"></div>
						<div class="button_label">Vacation</div>
					</button>
				</div>


			</div>

		</div>
		<div class="middle">

			<div id="config_content">
				<div class="marquee"></div>
				<div id="updating" style="display: inline-block;">
					Pending Changes <i class="fa fa-refresh fa-spin fa-fw"></i>
				</div>

				<div id="group">
					<div id="profile" class="icon">
						<strong>Profile</strong>
						<div class="box_content top_size">
							<div id="hvac_profile_mode" data-popup-open="popup-2"></div>
							<div id="nextHVAC" class="nextEvent"></div>
						</div>
					</div>

					<div id="light_scene" class="icon">
						<strong>Light Scene</strong>
						<div class="box_content top_size">
							<div id="lights_text" data-popup-open="popup-3"></div>
							<div id="nextLight" class="nextEvent"></div>
						</div>
					</div>
				</div>

				<div id="group">
					<div id="heatpump" class="icon">
						<strong>Heatpump</strong>
						<div class="box_content">
							<div id="hvac_icon"></div>
							<div id="hvac_text"></div>
							<div id="hvac_mode"></div>
							<div id="hvac_filter"></div>
							<div id="hvac_hold_mode">
								<div id="hold_indicator" class="led-blue"></div>
								<div id="led-hold-text"></div>
							</div>
						</div>
					</div>
					<div id="inside" class="icon">
						<strong>Inside</strong>
						<div class="box_content">
							<div id="current_inside_htsp"></div>
							<div id="current_inside_degree" data-popup-open="popup-1"
								onclick="hold_hvac()"></div>
							<div id="current_inside_clsp"></div>
						</div>
					</div>


					<div id="humidifer" class="icon">
						<strong>Hudmifier</strong>
						<div class="box_content">
							<div id="humid_icon"></div>
							<div id="humid_text"></div>
							<div id="current_inside_humid"></div>
							<div id="humid_filter"></div>
						</div>
					</div>
				</div>

			
			<div id="schedules"></div>




				<div class="popup" data-popup="popup-1">
					<div class="popup-inner">
						<div class='timepicker_wrap'>
							<div class='hold_words'>Set and Hold Until:</div>
							<div id="hvac_box">
								<div class='temp'>
									Temp
									<div class='next action-next'
										onClick="change_temp('next', 'set_hvac_hold');">
										<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
									</div>
									<div class='te_tx'>
										<input type='text' class='timepicki-input' readonly>
									</div>
									<div class='prev action-prev'
										onClick="change_temp('prev', 'set_hvac_hold');">
										<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
									</div>
								</div>
								<div id="havc_time_set">
									<div class='time'>
										Hour
										<div class='next action-next'
											onClick="change_time('next', 'set_hvac_hold');">
											<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
										</div>
										<div class='ti_tx'>
											<input type='text' class='timepicki-input' readonly>
										</div>
										<div class='prev action-prev'
											onClick="change_time('prev', 'set_hvac_hold');">
											<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
										</div>
									</div>
									<div class='mins'>
										Minute
										<div class='next action-next'
											onClick="change_mins('next', 'set_hvac_hold');">
											<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
										</div>
										<div class='mi_tx'>
											<input type='text' class='timepicki-input' readonly>
										</div>
										<div class='prev action-prev'
											onClick="change_mins('prev', 'set_hvac_hold');">
											<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
										</div>
									</div>
								</div>
							</div>
							<div class="save" onClick="sendCommand('set_hvac_hold');">
								<i class="fa fa-check-circle action-prev" aria-hidden="true"></i>
							</div>
						</div>
						<a class="popup-close" data-popup-close="popup-1" href="#">x</a>
					</div>
				</div>


				<div class="popup" data-popup="popup-2">
					<div class="popup-inner">
						<div id="profile_chooser"></div>
						<a class="popup-close" data-popup-close="popup-2" href="#">x</a>
					</div>
				</div>

				<div class="popup" data-popup="popup-3">
					<div class="popup-inner">
						<div id="light_chooser"></div>
						<a class="popup-close" data-popup-close="popup-3" href="#">x</a>
					</div>
				</div>

				<div class="popup" data-popup="popup-4">
					<div class="popup-inner">
						<div class="schedule_changer">
							<div id="morn_time_set">
								<div class='time'>
									Hour
									<div class='next action-next'
										onClick="change_time('next', 'set_morning');">
										<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
									</div>
									<div class='ti_tx'>
										<input type='text' class='timepicki-input' readonly>
									</div>
									<div class='prev action-prev'
										onClick="change_time('prev', 'set_morning');">
										<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
									</div>
								</div>
								<div class='mins'>
									Minute
									<div class='next action-next'
										onClick="change_mins('next', 'set_morning');">
										<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
									</div>
									<div class='mi_tx'>
										<input type='text' class='timepicki-input' readonly>
									</div>
									<div class='prev action-prev'
										onClick="change_mins('prev', 'set_morning');">
										<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
									</div>
								</div>
								<p>
									<small>This is the time you want to wake up. It will trigger
										the bedroom/mainfloor lights and the HVAC wake profile 30
										minutes before.</small>
								</p>
								<a class="popup-close" data-popup-close="popup-4" href="#">x</a>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>

		<div class="right">

			<div id="today" class="icon">
				<strong>Weather</strong>
				<div id="month"></div>
				<div id="digit"></div>
				<div id="day"></div>
				<div id="clock"></div>
				<div id="current_weather_icon"></div>
				<div id="current_weather_word"></div>
				<div id="current_weather_link"></div>
				<div id="current_weather_degree"></div>
				<div id="current_weather_humid"></div>
				<div id="people_home_box">
					<div class="people_box">
						<hr>
						Home Now <span id="people_home"></span>
					</div>
				</div>
				<div id="refresh"></div>
			</div>

		</div>
	</div>

</body>
</html>








<html>
<head>
<title>Home-Auto</title>
<link rel="stylesheet" type="text/css" href="home-auto.css">
<link rel="stylesheet" type="text/css" href="fonts/font-awesome.min.css">
<link rel="shortcut icon" href="home-auto.ico">

<script type="text/javascript" src="jquery-3.2.1.js"></script>
<script type="text/javascript" src="home-auto.js"></script>
</head>
<body>
	<div id="door" class="icon">
		<strong>Front Door</strong>
		<div id="buttons">
			<button id="lock" onclick="toggleButton('lock');">
				<div id='lock_symbol'></div>
				<div id="button_label_lock" class="button_label"></div>
			</button>
		</div>
	</div>

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

	<div id="button_content" class="icon">
		<strong>Controls</strong>
		<div id="buttons">
			<button id="autorun" onclick="toggleButton('autorun');">
				&#10004&#xfe0e;
				<div class="button_label">AutoRun</div>
				<div id="disabled_autorun" class="disabled">Paused</div>
			</button>
			<button id="morning" onclick="toggleButton('morning');">
				&#10004&#xfe0e;
				<div class="button_label">Morning</div>
				<div id="disabled_morning" class="disabled">Paused</div>
			</button>
			<button id="evening" onclick="toggleButton('evening');">
				&#10004&#xfe0e;
				<div class="button_label">Evening</div>
				<div id="disabled_evening" class="disabled">Paused</div>
			</button>
			<button id="movie" onclick="toggleButton('movie');">
				&#10004&#xfe0e;
				<div class="button_label">Movie</div>
			</button>
			<button id="vacation" onclick="toggleButton('vacation');">
				&#10004&#xfe0e;
				<div class="button_label">Vacation</div>
			</button>
		</div>
	</div>


	<div id="config_content">
		<div class="rubber" style="display: none;"></div>

		<div id="group">
			<div id="profile" class="icon">
				<strong>Profile</strong>
				<div class="box_content">
					<div id="hvac_profile_mode" data-popup-open="popup-2"></div>
					<div id="nextHVAC" class="nextEvent"></div>
				</div>
			</div>

			<div id="light_scene" class="icon">
				<strong>Light Scene</strong>
				<div class="box_content">
					<div id="lights_text" data-popup-open="popup-3"></div>
					<div id="nextLight" class="nextEvent"></div>
				</div>
			</div>
		</div>

		<div id="group">
			<div id="heatpump" class="icon">
				<strong>Heatpump
					<div id="hvac_updating">
						<i class="fa fa-refresh fa-spin fa-fw"></i>
					</div>
				</strong>
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
					<div id="hvac_display" style="display: block;">
						<div id="current_inside_htsp"></div>
						<div id="current_inside_degree" data-popup-open="popup-1"
							onclick="hold_hvac()"></div>
						<div id="current_inside_clsp"></div>
					</div>
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


		<div id="group">
			<div id="the_schedule_0" class="icon">
			</div>
			<div id="the_schedule_1" class="icon">
			</div>
			<div id="the_schedule_2" class="icon">
			</div>
		</div>


		<div class="popup" data-popup="popup-1">
			<div class="popup-inner">
				<div class='timepicker_wrap'>
					<div class='hold_words'>Set and Hold Until:</div>
					<div id="hvac_box">
						<div class='temp'>
							Temp
							<div class='next action-next' onClick="change_temp('next');">
								<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
							</div>
							<div class='te_tx'>
								<input type='text' class='timepicki-input' readonly>
							</div>
							<div class='prev action-prev' onClick="change_temp('prev');">
								<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
							</div>
						</div>
						<div id="havc_time_set">
							<div class='time'>
								Hour
								<div class='next action-next' onClick="change_time('next');">
									<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
								</div>
								<div class='ti_tx'>
									<input type='text' class='timepicki-input' readonly>
								</div>
								<div class='prev action-prev' onClick="change_time('prev');">
									<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
								</div>
							</div>
							<div class='mins'>
								Minute
								<div class='next action-next' onClick="change_mins('next');">
									<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
								</div>
								<div class='mi_tx'>
									<input type='text' class='timepicki-input' readonly>
								</div>
								<div class='prev action-prev' onClick="change_mins('prev');">
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
				<div id="schedule_changer">
					<div class='hold_words'>Wake up time:</div>
						<div id="morn_time_set">
							<div class='time'>
								Hour
								<div class='next action-next' onClick="change_time('next');">
									<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
								</div>
								<div class='ti_tx'>
									<input type='text' class='timepicki-input' readonly>
								</div>
								<div class='prev action-prev' onClick="change_time('prev');">
									<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
								</div>
							</div>
							<div class='mins'>
								Minute
								<div class='next action-next' onClick="change_mins('next');">
									<i class="fa fa-arrow-circle-up" aria-hidden="true"></i>
								</div>
								<div class='mi_tx'>
									<input type='text' class='timepicki-input' readonly>
								</div>
								<div class='prev action-prev' onClick="change_mins('prev');">
									<i class="fa fa-arrow-circle-down" aria-hidden="true"></i>
								</div>
							</div>
						</div>
				
						<small>This is the time you want to wake up. It will trigger the
							bedroom/mainfloor lights and the HVAC wake profile 30 minutes
							before.</small>
					</p>
					</li>
					<div class="save" onClick="sendCommand('set_morning');">
						<i class="fa fa-check-circle action-prev" aria-hidden="true"></i>
					</div>

				</div>
				<a class="popup-close" data-popup-close="popup-4" href="#">x</a>
			</div>
		</div>

	</div>

</body>
</html>


<?php
$aResult = array ();

if (! isset ( $_POST ['functionname'] )) {
	$aResult ['error'] = 'No function name! ';
}

if (! isset ( $_POST ['arguments'] )) {
	$aResult ['error'] = 'No function arguments! ';
}

$fileName = 'public.ini';

if (! isset ( $aResult ['error'] )) {
	
	switch ($_POST ['functionname']) {
		case 'set_hvac_hold' :
			$myfile = fopen ( "hvac/hvac_hold.txt", "w" ) or die ( "ON: Unable to open file! hvac_hold.txt" );
			$txt = $_POST ['arguments'];
			fwrite ( $myfile, $txt );
			fclose ( $myfile );
			break;
		
		case 'on' :
			switch ($_POST ['arguments']) {
				case 'movie' :
					$myfile = fopen ( "movie/movie.txt", "w" ) or die ( "ON: Unable to open file! movie.txt" );
					break;
				case 'vacation' :
					$myfile = fopen ( "vacation/vacation.txt", "w" ) or die ( "ON: Unable to open file! vacation.txt" );
					break;
				case 'lock' :
					$myfile = fopen ( "lock/lock.txt", "w" ) or die ( "ON: Unable to open file! vacation.txt" );
					break;
				default :
					try {
						if (! file_exists ( $fileName )) {
							throw new Exception ( 'File not found.' );
						}
						$contents = file_get_contents ( $fileName );
						$pattern = $_POST ['arguments'] . " = off";
						$replace = $_POST ['arguments'] . " = on";
						$result = preg_replace ( "/" . $pattern . "/", $replace, $contents );
						$fh = fopen ( $fileName, "w" );
						if (! $fh) {
							throw new Exception ( 'File open failed.' );
						}
						fwrite ( $fh, $result );
						fclose ( $fh );
						$aResult ['alert'] = 'It should have worked default on';
					} catch ( Exception $e ) {
						$aResult ['error'] = 'File read error: ' . $e . ' ' . $_POST ['functionname'] . "/" . $_POST ['arguments'] . " pattern:" . $pattern . " replace:" . $replace;
					}
					break;
			}
			break;
		
		case 'off' :
			switch ($_POST ['arguments']) {
				case 'movie' :
					$myfile = fopen ( "movie/movie.txt", "w" ) or die ( "OFF: Unable to open file! movie.txt" );
					break;
				case 'vacation' :
					$myfile = fopen ( "vacation/vacation.txt", "w" ) or die ( "OFF: Unable to open file! vacation.txt" );
					break;
				case 'lock' :
					$myfile = fopen ( "lock/lock.txt", "w" ) or die ( "OFF: Unable to open file! vacation.txt" );
					break;
				default :
					try {
						if (! file_exists ( $fileName )) {
							throw new Exception ( 'File not found.' );
						}
						$contents = file_get_contents ( $fileName );
						$pattern = $_POST ['arguments'] . " = on";
						$replace = $_POST ['arguments'] . " = off";
						$result = preg_replace ( "/" . $pattern . "/", $replace, $contents );
						$fh = fopen ( $fileName, "w" );
						if (! $fh) {
							throw new Exception ( 'File open failed.' );
						}
						fwrite ( $fh, $result );
						fclose ( $fh );
						$aResult ['alert'] = 'It should have worked default off';
					} catch ( Exception $e ) {
						$aResult ['error'] = 'File read error: ' . $e . ' ' . $_POST ['functionname'] . "/" . $_POST ['arguments'] . " pattern:" . $pattern . " replace:" . $replace;
					}
					break;
			}
			break;
		
		default :
			$aResult ['error'] = 'No function found matching: ';
			break;
	}
}

?>




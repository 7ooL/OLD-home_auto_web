<html>
<head>
<title>Home-Auto</title>
<link rel="stylesheet" type="text/css" href="home-auto.css">
<link rel="shortcut icon" href="home-auto.ico">
<script type="text/javascript" src="jquery-3.1.1.min.js"></script>
<script type="text/javascript" src="kendo.all.min.js"></script>
<script type="text/javascript" src="home-auto.js"></script>
</head>
<body>

	<div id="config_content">


		<div id="top_content">

			<div class="rubber" style="display: none;"></div>
			<div class="datetime">
				<time class="icon">
					<em id="day"></em> <strong id="month"></strong> <span id="digit"></span>
					<div id="clock"></div>
				</time>
			</div>
			<div class="status">
				<div class="icon status_box">
					<strong>Current Status</strong> <span id="current_status">
						<div id="autorun_indicator">
							<p id="autorun_led_text"></p>
						</div>
						<div id="lights_indicator">
							<p id="lights_led_text"></p>
						</div>
						<div id="hvac_indicator">
							<p id="hvac_led_text"></p>
						</div>
						<div id="humid_indicator">
							<p id="humid_led_text"></p>
						</div>
					</span>
				</div>
			</div>
			<div class="weather">
				<div class="icon weather_box">
					<strong>Weather</strong> <span id="current_weather">
						<div id="current_weather_icon"></div>
						<div id="current_weather_degree"></div>
						<div id="current_weather_word"></div>
						<div id="current_weather_link"></div>
					</span>

				</div>
			</div>

		</div>
		<div id="center_content">
			<div id="hvac_info">
				<div id="example" class="k-content">
					<div id="gauge-container">
						<div id="humid-gauge"></div>
						<div id="temp-gauge"></div>
						<div id="filter-gauge"></div>
						<div id="hvac_mode" class="k-gauge"></div>
						<div id="hvac_profile_gauge"></div>
						<div id="hvac_pump_gauge"></div>
						<div id="hvac_hold_gauge">
							<div id="hold_indicator" class="led-blue"></div>
							<div id="led-hold-text"></div>
						</div>
					</div>
				</div>
			</div>
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
		<div id="bottom_content">
			<div id="schedule" class="hide_show"></div>
			<div id="log">
<?php
error_reporting ( E_ALL );
ini_set ( "display_errors", 1 );
// echo getcwd() . "\n";
// include("file_with_errors.php");
// include("file_with_errors.php");
function main_loop($file, $file_fd) {
	$inotify = inotify_init ();
	if ($inotify === false) {
		fprintf ( STDERR, "Failed to obtain an inotify instance\n" );
		return 1;
	}
	$watch = inotify_add_watch ( $inotify, $file, IN_MODIFY );
	if ($watch === false) {
		fprintf ( STDERR, "Failed to watch file '%s'", $file );
		return 1;
	}
	while ( ($events = inotify_read ( $inotify )) !== false ) {
		echo "Event received !\n";
		foreach ( $events as $event ) {
			if (! ($event ['mask'] & IN_MODIFY))
				continue;
			echo stream_get_contents ( $file_fd );
			break;
		}
	}
	// May not happen
	inotify_rm_watch ( $inotify, $watch );
	fclose ( $inotify );
	fclose ( $file_fd );
	return 0;
}

$file = "home-auto.log";
if (! file_exists ( $file ) || ($fd = fopen ( $file, "r" )) === false) {
	fprintf ( STDERR, "File '%s' does not exists or is not readable\n", $file );
	// exit(1);
}

// fseek($fd, 0, SEEK_END);

// exit(main_loop($file, $fd));
// (main_loop($file, $fd);

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
		case 'on' :
			
			switch ($_POST ['arguments']) {
				case 'movie' :
					error_reporting ( E_ERROR | E_WARNING | E_PARSE | E_NOTICE );
					$myfile = fopen ( "movie/movie.txt", "w" ) or die ( "ON: Unable to open file! movie.txt" );
					break;
				case 'vacation' :
					$myfile = fopen ( "vacation/vacation.txt", "w" ) or die ( "ON: Unable to open file! vacation.txt" );
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
	// echo ($aResult);
}

// echo json_encode ( $aResult );

?>

			</div>
		</div>
			<div id="people_home_box">
				<div class="people_box">
					<span id="people_home"></span>
				</div>
			</div>
		<div id="refresh"></div>

	</div>

</body>
</html>


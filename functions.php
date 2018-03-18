<?php
$aResult = array ();

if (! isset ( $_POST ['functionname'] )) {
	$aResult ['error'] = 'No function name! ';
}

if (! isset ( $_POST ['arguments'] )) {
	$aResult ['error'] = 'No function arguments! ';
}

$fileName = 'public.ini';
$txt = $_POST ['arguments'];

if (! isset ( $aResult ['error'] )) {
	
	switch ($_POST ['functionname']) {
		case 'set_hvac_hold' :
			$myfile = fopen ( "hvac/hvac_hold.txt", "w" ) or die ( "ON: Unable to open file! hvac_hold.txt" );
			break;
		case 'set_morning' :
			$myfile = fopen ( "morn/set_morn.txt", "w" ) or die ( "ON: Unable to open file! hvac_hold.txt" );
			break;
		case 'on' :
			switch ($_POST ['arguments']) {
				case 'movie' :
					$myfile = fopen ( "movie/movie.txt", "w" ) or die ( "ON: Unable to open file! movie.txt" );
					$aResult ['alert'] = 'Movie mode successfully triggered ON';
					break;
				case 'vacation' :
					$myfile = fopen ( "vacation/vacation.txt", "w" ) or die ( "ON: Unable to open file! vacation.txt" );
					$aResult ['alert'] = 'Vacation mode successfully triggered ON';
					break;
				case 'lock' :
					$myfile = fopen ( "lock/lock.txt", "w" ) or die ( "ON: Unable to open file! lock.txt" );
					$aResult ['alert'] = 'Door Lock successfully triggered ON';
					break;
				case 'bed' :
					$myfile = fopen ( "bed/bed.txt", "w" ) or die ( "ON: Unable to open file! bed.txt" );
					$aResult ['alert'] = 'Bed mode successfully triggered ON';
					break;
				case 'clean' :
					$myfile = fopen ( "clean/clean.txt", "w" ) or die ( "ON: Unable to open file! clean.txt" );
					$aResult ['alert'] = 'Clean mode successfully triggered ON';
					break;
				default :
					$myfile = fopen ( "scenes/scenes.txt", "w" ) or die ( "ON: Unable to open file! scenes.txt" );
					$aResult ['alert'] = 'It should have worked default on';
					break;
			}
			break;
		
		case 'off' :
			switch ($_POST ['arguments']) {
				case 'movie' :
					$myfile = fopen ( "movie/movie.txt", "w" ) or die ( "OFF: Unable to open file! movie.txt" );
					$aResult ['alert'] = 'Movie mode successfully triggered OFF';
					break;
				case 'vacation' :
					$myfile = fopen ( "vacation/vacation.txt", "w" ) or die ( "OFF: Unable to open file! vacation.txt" );
					$aResult ['alert'] = 'Vacation mode successfully triggered OFF';
					break;
				case 'lock' :
					$myfile = fopen ( "lock/lock.txt", "w" ) or die ( "OFF: Unable to open file! vacation.txt" );
					$aResult ['alert'] = 'Door file successfully triggered OFF';
					break;
				case 'clean' :
					$myfile = fopen ( "clean/clean.txt", "w" ) or die ( "ON: Unable to open file! clean.txt" );
					$aResult ['alert'] = 'Clean mode successfully triggered OFF';
					break;
				default :
				    $myfile = fopen ( "scenes/scenes.txt", "w" ) or die ( "ON: Unable to open file! scenes.txt" );
				    $aResult ['alert'] = 'It should have worked default on';
					break;
			}
			break;
		
		default :
			$aResult ['error'] = 'No function found matching: ';
			break;
	}
	fwrite ( $myfile, $txt );
	fclose ( $myfile );
}

?>
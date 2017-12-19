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
		case 'set_morning' :
			$myfile = fopen ( "morn/set_morn.txt", "w" ) or die ( "ON: Unable to open file! hvac_hold.txt" );
			$txt = $_POST ['arguments'];
			fwrite ( $myfile, $txt );
			fclose ( $myfile );
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
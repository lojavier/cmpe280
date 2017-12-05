<!DOCTYPE html>
<html lang="en-US">
<meta charset="UTF-8">

<?php
	
	echo "HELLO WORLD!\n\n";
	// create curl resource 
	$ch = curl_init(); 

	// set url 
	curl_setopt($ch, CURLOPT_URL, "https://api.uber.com/v1.2/estimates/price?start_latitude=37.3367761&start_longitude=-121.8785044&end_latitude=37.3183318&end_longitude=-121.95104909999998&server_token=RUOqYOd-IgBcjFQ4J8mHc7ixW3vD9nRX3-f_Llrn"); 

	//return the transfer as a string 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 

	// $output contains the output string 
	$output = curl_exec($ch); 

	// echo $output;
	echo "$output\n";
	print $output;

	// close curl resource to free up system resources 
	curl_close($ch);
	
?>


</html>
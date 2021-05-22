<?php
	$inData = getRequestInfo();
	//actulal contacts
	$Fname 		= $inData["Fname"];
	$Lname 		= $inData["Lname"];
	$country	= $inData["country"];
	$postalCode = $inData["postalCode"];
	$phoneNumber= $inData["phoneNumber"];
	$Email		= $inData["Email"];
	//who its bound to
	$userId = $inData["userId"];

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("INSERT into Colors (UserId,FName,LName,country,PostalCode,phoneNumber,Email) VALUES(?,?,?,?,?,?,?)");
		$stmt->bind_param("ssssss", $userId, $Fname, $Lname, $country, $postalCode, $phoneNumber,$Email);
		$stmt->execute();
		$stmt->close();
		$conn->close();
		returnWithError("");
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
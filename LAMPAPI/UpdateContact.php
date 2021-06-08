<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$Login = "TheBeast";
	$Password = "WeLoveCOP4331";

	$conn = new mysqli("localhost", $Login, $Password, "FIRSTCONTACTS"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("UPDATE Contacts SET ".$inData["columnName"]." = "."'".$inData["newString"]."' WHERE ID = ".$inData["contactId"]);
		$stmt->execute();
		$result = $stmt->get_result();

		
        $stmt->close();
		$conn->close();
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
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
	
?>
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
	$stmt =$conn->prepare("SELECT * FROM Users WHERE Login=? AND Password=?");
	$stmt->bind_param("ss", $inData["login"], $inData["password"]);
	$stmt->execute();
	$stmt->store_result();
	$stmt->num_rows();
	
	if($stmt->num_rows() <= 0){

		$stmt = $conn->prepare("INSERT INTO Users (Login,Password,FirstName, LastName) VALUES (?,?,?,?)");
		$stmt->bind_param("ssss", $inData["login"], $inData["password"], $inData["FirstName"], $inData["LastName"]);
		$stmt->execute();
		$result = $stmt->get_result();

        $stmt->close();
		$conn->close();
	}else{
	$conn->close();
	}
	}
	$conn->close();
	
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
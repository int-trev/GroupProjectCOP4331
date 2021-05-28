<?php

	$inData = getRequestInfo();
	
	$id = 0;
	$Login = "TheBeast";
	$Password = "A3B@th?yg";

	$conn = new mysqli("localhost", $Login, $Password, "FIRSTCONTACTS"); 	
	if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
	else
	{
		$stmt = $conn->prepare("INSERT INTO Users (Login,Password,FirstName, LastName) VALUES (?,?,?,?)");
		$stmt->bind_param("ssss", $inData["login"], $inData["password"], $inData["FirstName"], $inData["LastName"]);
		$stmt->execute();
		$result = $stmt->get_result();


        if ($conn->query($result) === TRUE) {
			sendResultInfoAsJson($result);
            echo "New record created successfully";
        } else {
            echo "Error: " . $result . "<br>" . $conn->error;
        }
		
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
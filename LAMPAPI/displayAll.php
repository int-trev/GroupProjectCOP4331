<?php

	$inData = getRequestInfo();
	
	$searchResults = "";
	$searchCount = 0;

	$conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "FIRSTCONTACTS");
	if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 
	else
	{
		$stmt = $conn->prepare("select FName , LName , ID, postalCode, Email, phoneNumber, country from Contacts where UserID=?");
		$stmt->bind_param("i", $inData["userId"]);
		$stmt->execute();
		
		$result = $stmt->get_result();
							
		while($row = $result->fetch_assoc())
		{
			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$json= '{"FName" : "' . $row["FName"] . '", "LName" : "' . $row[LName] . '", "ID" : ' . $row[ID] . ', "postalCode" : "' . $row[postalCode] . '", "Email" : "' . $row[Email] . '", "phoneNumber" : "' . $row[phoneNumber] . '", "country" : "' . $row[country] . '"}';
			$searchResults .= $json;//'"' . $row["FName"] .' ' . $row[LName] . ' ' . $row[ID] . ' ' . $row[postalCode] . ' ' . $row[Email] . ' ' . $row[phoneNumber] . '"';
		}
		
		if( $searchCount == 0 )
		{
			returnWithError( "No Records Found" );
		}
		else
		{
			returnWithInfo( $searchResults );
		}
		
		$stmt->close();
		$conn->close();
	}

	function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}
	
	function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}
	
	function returnWithInfo( $searchResults )
	{
		$retValue = '{"results":[' . $searchResults . '],"error":""}';
		sendResultInfoAsJson( $retValue );
	}
		
	function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}
?>
<?php
    $inData = getRequestInfo();

    //Look for contact by ID
    $ID = $inData["ID"];

    //Update contact with new information
    $firstName = $inData["firstName"];
    $lastName = $inData["lastName"];
    $email = $inData["email"];
    $phone = $inData["phone"];

    $conn = new mysqli("localhost", "TheBeast", "WeLoveCOP4331", "COP4331");

    if ($conn->connect_error) 
	{
		returnWithError( $conn->connect_error );
	} 

    else
    {
        $stmt = $conn->prepare("UPDATE Contacts SET FirstName=?,LastName=?,Email=?,Phone=? WHERE ID=?");
        $stmt->bind_param("sssss", $firstName, $lastName, $email, $phone, $ID);
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
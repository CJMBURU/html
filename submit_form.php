<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "";
$database = "ambiquick_db";

$conn = new mysqli($servername, $username, $password, $database);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Handle incident report form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit_incident"])) {
    // Sanitize input data
    $incident_type = mysqli_real_escape_string($conn, $_POST["incident-type"]);
    $incident_location = mysqli_real_escape_string($conn, $_POST["incident-location"]);
    $contact_information = mysqli_real_escape_string($conn, $_POST["contact-information"]);
    $incident_description = mysqli_real_escape_string($conn, $_POST["incident-description"]);

    // Insert data into database
    $sql = "INSERT INTO incident_reports (incident_type, incident_location, contact_information, incident_description)
            VALUES ('$incident_type', '$incident_location', '$contact_information', '$incident_description')";

    if ($conn->query($sql) === TRUE) {
        echo "Incident report submitted successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Handle communication message form submission
if ($_SERVER["REQUEST_METHOD"] == "POST" && isset($_POST["submit_message"])) {
    // Sanitize input data
    $message = mysqli_real_escape_string($conn, $_POST["message"]);

    // Insert data into database
    $sql = "INSERT INTO communication_messages (message) VALUES ('$message')";

    if ($conn->query($sql) === TRUE) {
        echo "Message sent successfully.";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }
}

// Close database connection
$conn->close();
?>



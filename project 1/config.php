<?php
// config.php - Database Connection Configuration

// Temporarily enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "root"; // Default XAMPP username
$password = "";     // Default XAMPP password (empty)
$dbname = "movie_booking"; // <--- CHANGED THIS LINE to match your database name!

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    // Output a clean JSON error if connection fails
    header('Content-Type: application/json'); // Ensure header is sent before any output
    echo json_encode(['status' => 'error', 'message' => 'Database connection failed: ' . $conn->connect_error]);
    die(); // Stop script execution
}

// Set header for JSON response (ensures JSON is always returned if connection is successful)
header('Content-Type: application/json');
?>

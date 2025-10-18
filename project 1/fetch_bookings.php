<?php
// fetch_bookings.php - Fetches all booking data from MySQL database

include 'config.php'; // Include your database connection file

$response = ['status' => 'error', 'message' => 'No bookings found.', 'bookings' => []];

$sql = "SELECT id, movie_name, location, time, seats_list, seats_count, seats_price, food_items, food_total, grand_total, cardholder_name, card_number_masked, booking_date FROM bookings ORDER BY booking_date DESC";
$result = $conn->query($sql);

if ($result) {
    if ($result->num_rows > 0) {
        $bookings = [];
        while ($row = $result->fetch_assoc()) {
            // Decode JSON strings back to arrays/objects for frontend use
            $item = $row;

            $item['seats_list'] = json_decode(stripslashes($item['seats_list']), true);
            $item['food_items'] = json_decode(stripslashes($item['food_items']), true);

            $bookings[] = $item;
        }
        $response = ['status' => 'success', 'message' => 'Bookings fetched successfully.', 'bookings' => $bookings];
    } else {
        $response['message'] = 'No bookings found in the database.';
    }
} else {
    $response['message'] = 'Database query failed: ' . $conn->error;
}

$conn->close();
echo json_encode($response);
?>
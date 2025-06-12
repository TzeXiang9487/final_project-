<?php
// save_booking.php - Saves booking data to MySQL database

include 'config.php'; // Include your database connection file

$response = ['status' => 'error', 'message' => 'Invalid request.'];

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the raw POST data
    $json_data = file_get_contents('php://input');
    $data = json_decode($json_data, true);

    if (json_last_error() === JSON_ERROR_NONE && !empty($data)) {
        // Extract data with null coalescing to prevent errors if a key is missing
        $movieName = $conn->real_escape_string($data['movie']['movie'] ?? 'N/A');
        $location = $conn->real_escape_string($data['movie']['location'] ?? 'N/A');
        $time = $conn->real_escape_string($data['movie']['time'] ?? 'N/A');
        $seatsList = $conn->real_escape_string(json_encode($data['seats']['seats'] ?? []) ?? '[]'); // Store as JSON string
        $seatsCount = (int)($data['seats']['count'] ?? 0);
        $seatsPrice = (float)($data['seats']['price'] ?? 0.00);
        $foodItems = $conn->real_escape_string(json_encode($data['food']['items'] ?? []) ?? '[]'); // Store as JSON string
        $foodTotal = (float)($data['food']['total'] ?? 0.00);
        $grandTotal = (float)($data['total'] ?? 0.00);

        // Payment details (VERY INSECURE - FOR DEMO ONLY)
        $cardholderName = $conn->real_escape_string($data['paymentDetails']['cardName'] ?? 'N/A');
        $cardNumber = $data['paymentDetails']['cardNumber'] ?? '';
        // Mask the card number for storage (first 12 digits with X)
        $cardNumberMasked = substr($cardNumber, 0, 4) . 'XXXXXXXX' . substr($cardNumber, -4);
        $bookingDate = date('Y-m-d H:i:s'); // Current timestamp

        // Prepare and bind SQL statement to prevent SQL injection
        $stmt = $conn->prepare("INSERT INTO bookings (movie_name, location, time, seats_list, seats_count, seats_price, food_items, food_total, grand_total, cardholder_name, card_number_masked, booking_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->bind_param("sssisisddsss", $movieName, $location, $time, $seatsList, $seatsCount, $seatsPrice, $foodItems, $foodTotal, $grandTotal, $cardholderName, $cardNumberMasked, $bookingDate);

        if ($stmt->execute()) {
            $response = ['status' => 'success', 'message' => 'Booking confirmed!', 'orderId' => $conn->insert_id];
        } else {
            $response = ['status' => 'error', 'message' => 'Failed to save booking: ' . $stmt->error];
        }

        $stmt->close();
    } else {
        $response = ['status' => 'error', 'message' => 'No valid data received.'];
    }
}

$conn->close();
echo json_encode($response);
?>
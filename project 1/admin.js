// admin.js
document.addEventListener('DOMContentLoaded', () => {
    const bookingsTableBody = document.querySelector('#bookings-table tbody');
    const loadingMessage = document.getElementById('loading-message');
    const errorMessage = document.getElementById('error-message');
    const noBookingsMessage = document.getElementById('no-bookings-message');

    // Function to fetch bookings from the backend
    async function fetchBookings() {
        loadingMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        noBookingsMessage.style.display = 'none';
        bookingsTableBody.innerHTML = ''; // Clear existing data

        try {
            const response = await fetch('fetch_bookings.php'); // Endpoint to fetch data
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            loadingMessage.style.display = 'none';

            if (data.status === 'success' && data.bookings.length > 0) {
                data.bookings.forEach(booking => {
                    const row = bookingsTableBody.insertRow();
                    row.insertCell().textContent = booking.id;
                    row.insertCell().textContent = booking.movie_name;
                    row.insertCell().textContent = booking.location;
                    row.insertCell().textContent = booking.time;
                    
                    // Format seats list
                    const seats = Array.isArray(booking.seats_list) ? booking.seats_list.join(', ') : 'N/A';
                    row.insertCell().textContent = `${seats} (${booking.seats_count} seats)`;
                    
                    // Format food items
                    let foodDisplay = 'No food items';
                    if (Array.isArray(booking.food_items) && booking.food_items.length > 0) {
                        foodDisplay = booking.food_items.map(item => item.name).join(', ');
                    }
                    row.insertCell().textContent = foodDisplay;
                    
                    row.insertCell().textContent = parseFloat(booking.grand_total).toFixed(2);
                    row.insertCell().textContent = booking.cardholder_name;
                    row.insertCell().textContent = booking.card_number_masked;
                    row.insertCell().textContent = booking.booking_date;
                });
            } else {
                noBookingsMessage.style.display = 'block';
            }
        } catch (error) {
            console.error('Error fetching bookings:', error);
            loadingMessage.style.display = 'none';
            errorMessage.textContent = `Failed to load bookings: ${error.message}`;
            errorMessage.style.display = 'block';
        }
    }

    // Fetch bookings when the page loads
    fetchBookings();
});

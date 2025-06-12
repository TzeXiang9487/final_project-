document.addEventListener('DOMContentLoaded', () => {
    const SEAT_PRICE = 15.00; // Price per seat

    // DOM Elements
    const seatLayout = document.querySelector('.seat-layout');
    const bookingDetails = document.getElementById('booking-details');
    const seatsListSpan = document.getElementById('seats-list');
    const totalPriceSpan = document.getElementById('total-price');
    const confirmSeatsBtn = document.getElementById('confirm-seats-btn');

    // Get movie selection from localStorage
    const movieSelection = JSON.parse(localStorage.getItem('movieSelection'));

    if (movieSelection) {
        bookingDetails.innerHTML = `
            <strong>${movieSelection.movie}</strong> at ${movieSelection.location} - ${movieSelection.time}
        `;
    }

    /**
     * Updates the summary text and total price based on selected seats.
     */
    function updateSummary() {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const numSeats = selectedSeats.length;

        if (numSeats > 0) {
            const seatNames = [...selectedSeats].map(seat => seat.dataset.seat).join(', ');
            seatsListSpan.textContent = seatNames;
            totalPriceSpan.textContent = `RM ${(numSeats * SEAT_PRICE).toFixed(2)}`;
            confirmSeatsBtn.disabled = false;
        } else {
            seatsListSpan.textContent = 'None';
            totalPriceSpan.textContent = 'RM 0.00';
            confirmSeatsBtn.disabled = true;
        }
    }

    // Event listener for seat clicks
    seatLayout.addEventListener('click', (e) => {
        const seat = e.target.closest('.seat');
        if (seat && !seat.classList.contains('taken')) {
            seat.classList.toggle('selected');
            updateSummary();
        }
    });

    // Event listener for the confirm button
    confirmSeatsBtn.addEventListener('click', () => {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        const seatData = {
            seats: [...selectedSeats].map(seat => seat.dataset.seat),
            count: selectedSeats.length,
            price: selectedSeats.length * SEAT_PRICE
        };
        
        // Save seat data to localStorage
        localStorage.setItem('seatSelection', JSON.stringify(seatData));
        
        // Navigate to the food page
        window.location.href = 'food.html';
    });
    
    // Initial call to set the summary
    updateSummary();
});

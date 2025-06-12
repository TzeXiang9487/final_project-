// checkout.js
document.addEventListener('DOMContentLoaded', () => {
    // Get all data from localStorage
    const movieSelection = JSON.parse(localStorage.getItem('movieSelection'));
    const seatSelection = JSON.parse(localStorage.getItem('seatSelection'));
    const foodSelection = JSON.parse(localStorage.getItem('foodSelection'));

    // DOM containers
    const movieSummaryDiv = document.getElementById('movie-summary');
    const seatsSummaryDiv = document.getElementById('seats-summary');
    const foodSummaryDiv = document.getElementById('food-summary');
    const grandTotalSpan = document.getElementById('grand-total');
    const confirmPaymentBtn = document.getElementById('confirm-payment-btn');

    // Payment details input fields
    const cardNumberInput = document.getElementById('card-number');
    const cardNameInput = document.getElementById('card-name');
    const expiryMonthInput = document.getElementById('expiry-month');
    const expiryYearInput = document.getElementById('expiry-year');
    const cvvInput = document.getElementById('cvv');

    // Modal elements
    const confirmationModal = document.getElementById('confirmation-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalOkBtn = document.getElementById('modal-ok-btn');
    const closeButton = document.querySelector('.close-button');

    let grandTotal = 0;

    // Function to display the custom modal
    function showModal(title, message, isSuccess = false) {
        modalTitle.textContent = title;
        modalMessage.textContent = message;
        confirmationModal.style.display = 'flex'; // Use flex for centering
        
        // Set title color based on success/error
        if (isSuccess) {
            modalTitle.style.color = '#00ccff'; // Neon blue for success
        } else {
            modalTitle.style.color = '#ff4d4d'; // Red for error
        }
    }

    // Function to hide the custom modal
    function hideModal() {
        confirmationModal.style.display = 'none';
    }

    // Event listeners for modal buttons
    modalOkBtn.addEventListener('click', () => {
        hideModal();
        // Only redirect if it was a successful booking confirmation from the backend
        if (modalTitle.style.color === 'rgb(0, 204, 255)') { // Check for neon blue color for success
            localStorage.clear(); // Reset booking data after successful confirmation
            window.location.href = "index.html";
        }
    });

    closeButton.addEventListener('click', hideModal);

    // Close modal if clicked outside of it
    window.addEventListener('click', (event) => {
        if (event.target === confirmationModal) {
            hideModal();
            // If modal closed by clicking outside and it was a success, then redirect
            if (modalTitle.style.color === 'rgb(0, 204, 255)') {
                localStorage.clear();
                window.location.href = "index.html";
            }
        }
    });

    // 1. Populate Movie Details
    if (movieSelection) {
        movieSummaryDiv.innerHTML = `
            <div class="order-item">Movie: <span>${movieSelection.movie}</span></div>
            <div class="order-item">Location: <span>${movieSelection.location}</span></div>
            <div class="order-item">Time: <span>${movieSelection.time}</span></div>
        `;
    }

    // 2. Populate Seat Details
    if (seatSelection) {
        const seatPrice = parseFloat(seatSelection.price);
        seatsSummaryDiv.innerHTML = `
            <div class="order-item">Selected Seats: <span>${seatSelection.seats.join(', ')}</span></div>
            <div class="order-item">Seats Total: <span>RM ${seatPrice.toFixed(2)}</span></div>
        `;
        grandTotal += seatPrice;
    }

    // 3. Populate Food Details
    if (foodSelection && foodSelection.items.length > 0) {
        let foodItemsHtml = '';
        foodSelection.items.forEach(item => {
            foodItemsHtml += `<div class="order-item">${item.name} - RM ${parseFloat(item.price).toFixed(2)}</div>`;
        });
        const foodTotal = parseFloat(foodSelection.total);
        foodSummaryDiv.innerHTML = `
            <div>${foodItemsHtml}</div>
            <div class="order-item">Food Total: <span>RM ${foodTotal.toFixed(2)}</span></div>
        `;
        grandTotal += foodTotal;
    } else {
        foodSummaryDiv.innerHTML = '<div class="order-item">Selected Items: <span>-</span></div><div class="order-item">Food Total: <span>RM 0.00</span></div>';
    }

    // Display Grand Total
    grandTotalSpan.textContent = `RM ${grandTotal.toFixed(2)}`;

    // 5. Handle Final Payment Confirmation
    confirmPaymentBtn.addEventListener('click', () => {
        // Basic Client-Side Validation for payment details
        const cardNumber = cardNumberInput.value.trim();
        const cardName = cardNameInput.value.trim();
        const expiryMonth = expiryMonthInput.value.trim();
        const expiryYear = expiryYearInput.value.trim();
        const cvv = cvvInput.value.trim();

        if (!cardNumber || !cardName || !expiryMonth || !expiryYear || !cvv) {
            showModal('Validation Error', 'Please fill in all payment details.', false);
            return;
        }

        if (cardNumber.length < 16 || isNaN(cardNumber.replace(/\s/g, ''))) {
             showModal('Validation Error', 'Please enter a valid 16-digit card number.', false);
             return;
         }

        if (expiryMonth.length !== 2 || isNaN(expiryMonth) || parseInt(expiryMonth) < 1 || parseInt(expiryMonth) > 12) {
             showModal('Validation Error', 'Please enter a valid 2-digit expiry month (MM).', false);
             return;
         }

        // Simple year validation: assuming current year is 25 (2025) and valid for next ~10 years
        const currentYearLastTwoDigits = new Date().getFullYear() % 100;
        const inputExpiryYear = parseInt(expiryYear);
        if (expiryYear.length !== 2 || isNaN(expiryYear) || inputExpiryYear < currentYearLastTwoDigits || inputExpiryYear > (currentYearLastTwoDigits + 10)) {
             showModal('Validation Error', 'Please enter a valid 2-digit expiry year (YY).', false);
             return;
        }

        if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
             showModal('Validation Error', 'Please enter a valid 3 or 4-digit CVV.', false);
             return;
        }


        // Prepare data to send to backend
        const orderData = {
            movie: movieSelection,
            seats: seatSelection,
            food: foodSelection,
            total: grandTotal,
            paymentDetails: {
                cardNumber: cardNumber.replace(/\s/g, ''), // Send unmasked for PHP to mask and store
                cardName: cardName,
                expiryMonth: expiryMonth,
                expiryYear: expiryYear,
                cvv: cvv // Again, for demo only. NEVER send raw CVV in production.
            }
        };

        // Use fetch to send the data to your save_booking.php script
        fetch('save_booking.php', { // <--- This is the crucial fetch call
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        })
        .then(response => {
            if (!response.ok) {
                // If HTTP status is not 2xx, throw an error
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Backend Response:', data);
            if(data.status === 'success') {
                showModal('Booking Confirmed!', '✅ Your booking has been confirmed! Enjoy your movie 🎉', true);
            } else {
                showModal('Booking Failed', data.message || 'There was an error processing your order. Please try again.', false);
            }
        })
        .catch((error) => {
            console.error('Error during checkout submission:', error);
            showModal('Error', `An error occurred: ${error.message}. Please check the console for details.`, false);
        });
    });
});

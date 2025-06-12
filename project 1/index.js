document.addEventListener('DOMContentLoaded', () => {
    // DOM elements
    const movieGrid = document.getElementById('movie-grid');
    const locationList = document.getElementById('location-list');
    const timeList = document.getElementById('time-list');
    const bookNowBtn = document.getElementById('book-now-btn');
    const scheduleBox = document.querySelector('.schedule-box'); // Get the schedule box element
    const adminButton = document.getElementById('adminButton'); // Get the Admin button element

    // Selections state
    let selected = {
        movie: null,
        location: null,
        time: null
    };

    // --- Event Listeners ---

    // 1. Movie Selection
    movieGrid.addEventListener('click', (e) => {
        const movieCard = e.target.closest('.movie-card');
        if (movieCard) {
            // Remove selection from others
            movieGrid.querySelectorAll('.movie-card').forEach(card => card.classList.remove('selected'));
            // Add selection to the clicked one
            movieCard.classList.add('selected');
            selected.movie = movieCard.dataset.movie;

            // Reset location and time selections when a new movie is chosen
            selected.location = null;
            selected.time = null;
            locationList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            timeList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));

            // Add the 'active' class to the schedule box to trigger the animation
            scheduleBox.classList.add('active');
            
            checkSelections();
        }
    });

    // 2. Location Selection
    locationList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (listItem) {
            locationList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            listItem.classList.add('selected');
            selected.location = listItem.textContent;
            checkSelections();
        }
    });

    // 3. Time Selection
    timeList.addEventListener('click', (e) => {
        const listItem = e.target.closest('li');
        if (listItem) {
            timeList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            listItem.classList.add('selected');
            selected.time = listItem.textContent;
            checkSelections();
        }
    });

    // 4. Book Now Button Click
    bookNowBtn.addEventListener('click', () => {
        // Save selected data to localStorage
        localStorage.setItem('movieSelection', JSON.stringify(selected));
        // Navigate to the seat selection page
        window.location.href = 'seats.html';
    });

    // 5. Click outside schedule box to close it
    document.addEventListener('click', (e) => {
        // Check if the click was outside the schedule box and not on a movie card
        const isClickInsideScheduleBox = scheduleBox.contains(e.target);
        const isClickOnMovieCard = e.target.closest('.movie-card');

        if (scheduleBox.classList.contains('active') && !isClickInsideScheduleBox && !isClickOnMovieCard) {
            scheduleBox.classList.remove('active');
            // Reset selections if the schedule box disappears by clicking outside
            selected.movie = null; // Clear movie selection too
            selected.location = null;
            selected.time = null;
            // Deselect all movie cards
            movieGrid.querySelectorAll('.movie-card').forEach(card => card.classList.remove('selected'));
            // Deselect all location and time list items
            locationList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            timeList.querySelectorAll('li').forEach(li => li.classList.remove('selected'));
            checkSelections(); // This will also disable the book now button
        }
    });

    // New: Event listener for the Admin button
    if (adminButton) { // Ensure the button exists before adding listener
        adminButton.addEventListener('click', () => {
            window.location.href = "admin.html"; // Redirect to the admin dashboard
        });
    }

    // --- Helper Function ---

    /**
     * Checks if a movie, location, and time have all been selected.
     * If so, it enables the "Select Seats" button.
     */
    function checkSelections() {
        if (selected.movie && selected.location && selected.time) {
            bookNowBtn.disabled = false;
            console.log('All items selected:', selected);
        } else {
            bookNowBtn.disabled = true;
        }
    }
});

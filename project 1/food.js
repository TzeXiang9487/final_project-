document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const foodMenu = document.getElementById('food-menu');
    const foodTotalSpan = document.getElementById('food-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    
    let selectedFood = [];
    let foodTotal = 0.0;

    /**
     * Updates the total price of selected food items.
     */
    function updateFoodTotal() {
        foodTotal = selectedFood.reduce((total, item) => total + parseFloat(item.price), 0);
        foodTotalSpan.textContent = `RM ${foodTotal.toFixed(2)}`;
    }

    // Event listener for food item clicks
    foodMenu.addEventListener('click', (e) => {
        const foodItem = e.target.closest('.food-item');

        if (foodItem) {
            foodItem.classList.toggle('selected');
            const name = foodItem.dataset.name;
            const price = foodItem.dataset.price;

            // Check if item is already selected
            const selectedIndex = selectedFood.findIndex(item => item.name === name);

            if (selectedIndex > -1) {
                // If it is, remove it
                selectedFood.splice(selectedIndex, 1);
            } else {
                // If it's not, add it
                selectedFood.push({ name, price });
            }
            
            updateFoodTotal();
        }
    });

    // Event listener for checkout button
    checkoutBtn.addEventListener('click', () => {
        const foodData = {
            items: selectedFood,
            total: foodTotal
        };

        // Save food data to localStorage
        localStorage.setItem('foodSelection', JSON.stringify(foodData));

        // Navigate to the checkout page
        window.location.href = 'checkout.html';
    });
});

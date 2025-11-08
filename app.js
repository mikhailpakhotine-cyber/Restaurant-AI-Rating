// Restaurant Tracker App
class RestaurantTracker {
    constructor() {
        this.restaurants = [];
        this.userData = this.loadUserData();
        this.currentTab = 'all';
        this.filters = {
            search: '',
            cuisine: '',
            price: '',
            distance: '',
            sort: 'name'
        };
        this.init();
    }

    // Initialize the app
    async init() {
        await this.loadRestaurants();
        this.setupEventListeners();
        this.populateFilters();
        this.renderRestaurants();
        this.updateStats();
    }

    // Load restaurants from JSON file
    async loadRestaurants() {
        try {
            const response = await fetch('restaurants.json');
            const data = await response.json();
            this.restaurants = data.restaurants;
        } catch (error) {
            console.error('Error loading restaurants:', error);
            this.showError('Failed to load restaurants. Please refresh the page.');
        }
    }

    // Load user data from local storage
    loadUserData() {
        const data = localStorage.getItem('restaurantTrackerData');
        return data ? JSON.parse(data) : {};
    }

    // Save user data to local storage
    saveUserData() {
        localStorage.setItem('restaurantTrackerData', JSON.stringify(this.userData));
        this.updateStats();
    }

    // Get user data for a specific restaurant
    getUserData(restaurantId) {
        return this.userData[restaurantId] || {
            visited: false,
            toVisit: false,
            rating: 0,
            comment: ''
        };
    }

    // Update user data for a restaurant
    updateUserData(restaurantId, data) {
        this.userData[restaurantId] = {
            ...this.getUserData(restaurantId),
            ...data
        };
        this.saveUserData();
    }

    // Setup event listeners
    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Filters
        document.getElementById('search').addEventListener('input', (e) => {
            this.filters.search = e.target.value.toLowerCase();
            this.renderRestaurants();
        });

        document.getElementById('cuisine-filter').addEventListener('change', (e) => {
            this.filters.cuisine = e.target.value;
            this.renderRestaurants();
        });

        document.getElementById('price-filter').addEventListener('change', (e) => {
            this.filters.price = e.target.value;
            this.renderRestaurants();
        });

        document.getElementById('distance-filter').addEventListener('change', (e) => {
            this.filters.distance = e.target.value;
            this.renderRestaurants();
        });

        document.getElementById('sort').addEventListener('change', (e) => {
            this.filters.sort = e.target.value;
            this.renderRestaurants();
        });

        document.getElementById('reset-filters').addEventListener('click', () => {
            this.resetFilters();
        });

        // Clear data button
        document.getElementById('clear-data').addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
                this.clearAllData();
            }
        });

        // Modal close
        const modal = document.getElementById('modal');
        const closeBtn = document.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    // Populate filter dropdowns
    populateFilters() {
        const cuisines = new Set(this.restaurants.map(r => r.cuisine));
        const cuisineFilter = document.getElementById('cuisine-filter');

        cuisines.forEach(cuisine => {
            const option = document.createElement('option');
            option.value = cuisine;
            option.textContent = cuisine;
            cuisineFilter.appendChild(option);
        });
    }

    // Switch between tabs
    switchTab(tab) {
        this.currentTab = tab;

        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update tab panes
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        document.getElementById(`${tab}-pane`).classList.add('active');

        this.renderRestaurants();
    }

    // Reset all filters
    resetFilters() {
        this.filters = {
            search: '',
            cuisine: '',
            price: '',
            distance: '',
            sort: 'name'
        };

        document.getElementById('search').value = '';
        document.getElementById('cuisine-filter').value = '';
        document.getElementById('price-filter').value = '';
        document.getElementById('distance-filter').value = '';
        document.getElementById('sort').value = 'name';

        this.renderRestaurants();
    }

    // Filter restaurants based on current filters
    filterRestaurants(restaurants) {
        return restaurants.filter(restaurant => {
            // Search filter
            if (this.filters.search) {
                const searchTerm = this.filters.search;
                const searchable = `${restaurant.name} ${restaurant.cuisine} ${restaurant.address}`.toLowerCase();
                if (!searchable.includes(searchTerm)) return false;
            }

            // Cuisine filter
            if (this.filters.cuisine && restaurant.cuisine !== this.filters.cuisine) {
                return false;
            }

            // Price filter
            if (this.filters.price && restaurant.priceRange !== this.filters.price) {
                return false;
            }

            // Distance filter
            if (this.filters.distance) {
                const maxDistance = parseFloat(this.filters.distance);
                if (restaurant.distance > maxDistance) return false;
            }

            return true;
        });
    }

    // Sort restaurants
    sortRestaurants(restaurants) {
        const sorted = [...restaurants];

        switch (this.filters.sort) {
            case 'name':
                sorted.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'distance':
                sorted.sort((a, b) => a.distance - b.distance);
                break;
            case 'rating':
                sorted.sort((a, b) => {
                    const ratingA = this.getUserData(a.id).rating || 0;
                    const ratingB = this.getUserData(b.id).rating || 0;
                    return ratingB - ratingA;
                });
                break;
            case 'price':
                sorted.sort((a, b) => a.priceRange.length - b.priceRange.length);
                break;
        }

        return sorted;
    }

    // Get restaurants for current tab
    getRestaurantsForTab() {
        let restaurants = [...this.restaurants];

        switch (this.currentTab) {
            case 'visited':
                restaurants = restaurants.filter(r =>
                    this.getUserData(r.id).visited
                );
                break;
            case 'to-visit':
                restaurants = restaurants.filter(r =>
                    this.getUserData(r.id).toVisit && !this.getUserData(r.id).visited
                );
                break;
            case 'recommendations':
                restaurants = this.getRecommendations();
                break;
        }

        return restaurants;
    }

    // Render restaurants
    renderRestaurants() {
        let restaurants = this.getRestaurantsForTab();
        restaurants = this.filterRestaurants(restaurants);
        restaurants = this.sortRestaurants(restaurants);

        const containerId = this.currentTab === 'all' ? 'restaurant-list' :
                           this.currentTab === 'visited' ? 'visited-list' :
                           this.currentTab === 'to-visit' ? 'to-visit-list' :
                           'recommendations-list';

        const container = document.getElementById(containerId);
        const noResults = document.getElementById('no-results');

        if (restaurants.length === 0) {
            container.innerHTML = '';
            noResults.style.display = 'block';
            return;
        }

        noResults.style.display = 'none';
        container.innerHTML = restaurants.map(restaurant =>
            this.createRestaurantCard(restaurant)
        ).join('');

        // Add click event listeners
        container.querySelectorAll('.restaurant-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    const id = parseInt(card.dataset.id);
                    this.showRestaurantModal(id);
                }
            });
        });

        // Add action button listeners
        this.setupActionButtons(container);
    }

    // Create restaurant card HTML
    createRestaurantCard(restaurant) {
        const userData = this.getUserData(restaurant.id);
        const statusClass = userData.visited ? 'visited' :
                           userData.toVisit ? 'to-visit' : '';

        let statusBadges = '';
        if (userData.visited) {
            statusBadges += '<span class="status-badge visited">Visited</span>';
        }
        if (userData.toVisit && !userData.visited) {
            statusBadges += '<span class="status-badge to-visit">To Visit</span>';
        }

        let ratingHTML = '';
        if (userData.rating > 0) {
            ratingHTML = `
                <div class="user-rating">
                    <div class="stars">
                        ${this.renderStars(userData.rating)}
                    </div>
                    <span class="rating-text">${userData.rating}/5</span>
                </div>
            `;
        }

        let commentHTML = '';
        if (userData.comment) {
            commentHTML = `
                <div class="user-comment">"${userData.comment}"</div>
            `;
        }

        let recommendationHTML = '';
        if (this.currentTab === 'recommendations') {
            const reason = this.getRecommendationReason(restaurant);
            recommendationHTML = `
                <div class="recommendation-reason">
                    <strong>Why we recommend this:</strong> ${reason}
                </div>
            `;
        }

        return `
            <div class="restaurant-card ${statusClass}" data-id="${restaurant.id}">
                <div class="restaurant-header">
                    <div>
                        <div class="restaurant-name">${restaurant.name}</div>
                        <div class="restaurant-cuisine">${restaurant.cuisine}</div>
                    </div>
                    <div class="restaurant-distance">${restaurant.distance} mi</div>
                </div>

                <div class="restaurant-info">
                    <div class="restaurant-address">${restaurant.address}</div>
                    <span class="restaurant-price">${restaurant.priceRange}</span>
                </div>

                <div class="categories">
                    ${restaurant.category.map(cat =>
                        `<span class="category-tag">${cat}</span>`
                    ).join('')}
                </div>

                ${statusBadges ? `<div class="restaurant-status">${statusBadges}</div>` : ''}
                ${ratingHTML}
                ${commentHTML}
                ${recommendationHTML}

                <div class="restaurant-actions">
                    <button class="action-btn mark-visited ${userData.visited ? 'active' : ''}"
                            data-id="${restaurant.id}">
                        ${userData.visited ? '✓ Visited' : 'Mark Visited'}
                    </button>
                    <button class="action-btn mark-to-visit ${userData.toVisit && !userData.visited ? 'active' : ''}"
                            data-id="${restaurant.id}">
                        ${userData.toVisit ? '✓ To Visit' : 'Want to Visit'}
                    </button>
                </div>
            </div>
        `;
    }

    // Render star rating
    renderStars(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<span class="star ${i <= rating ? 'filled' : ''}">★</span>`;
        }
        return stars;
    }

    // Setup action button event listeners
    setupActionButtons(container) {
        container.querySelectorAll('.mark-visited').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const userData = this.getUserData(id);
                this.updateUserData(id, {
                    visited: !userData.visited,
                    toVisit: false
                });
                this.renderRestaurants();
            });
        });

        container.querySelectorAll('.mark-to-visit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const userData = this.getUserData(id);
                if (!userData.visited) {
                    this.updateUserData(id, {
                        toVisit: !userData.toVisit
                    });
                    this.renderRestaurants();
                }
            });
        });
    }

    // Show restaurant detail modal
    showRestaurantModal(id) {
        const restaurant = this.restaurants.find(r => r.id === id);
        if (!restaurant) return;

        const userData = this.getUserData(id);
        const modal = document.getElementById('modal');
        const modalBody = document.getElementById('modal-body');

        modalBody.innerHTML = `
            <div class="modal-header">
                <h2 class="modal-title">${restaurant.name}</h2>
                <p class="modal-subtitle">${restaurant.cuisine} • ${restaurant.priceRange} • ${restaurant.distance} mi</p>
            </div>

            <div class="modal-section">
                <p><strong>Address:</strong> ${restaurant.address}</p>
                <div class="categories" style="margin-top: 10px;">
                    ${restaurant.category.map(cat =>
                        `<span class="category-tag">${cat}</span>`
                    ).join('')}
                </div>
            </div>

            <div class="modal-section">
                <h3>Your Rating</h3>
                <div class="rating-input" id="rating-input">
                    ${this.createRatingInput(userData.rating)}
                </div>
            </div>

            <div class="modal-section">
                <h3>Your Comments</h3>
                <textarea class="comment-input" id="comment-input"
                          placeholder="Share your thoughts about this restaurant...">${userData.comment || ''}</textarea>
            </div>

            <div class="modal-section">
                <h3>Status</h3>
                <div class="modal-actions">
                    <button class="btn-primary ${userData.visited ? 'active' : ''}" id="modal-visited">
                        ${userData.visited ? '✓ Visited' : 'Mark as Visited'}
                    </button>
                    <button class="btn-primary ${userData.toVisit && !userData.visited ? 'active' : ''}"
                            id="modal-to-visit">
                        ${userData.toVisit ? '✓ Want to Visit' : 'Add to Want to Visit'}
                    </button>
                </div>
            </div>

            <div class="modal-actions">
                <button class="btn-primary" id="save-changes">Save Changes</button>
            </div>
        `;

        modal.style.display = 'block';

        // Setup modal event listeners
        this.setupModalListeners(id, restaurant);
    }

    // Create rating input HTML
    createRatingInput(currentRating) {
        let html = '';
        for (let i = 1; i <= 5; i++) {
            html += `<span class="star ${i <= currentRating ? 'filled' : ''}"
                          data-rating="${i}">★</span>`;
        }
        return html;
    }

    // Setup modal event listeners
    setupModalListeners(id, restaurant) {
        let selectedRating = this.getUserData(id).rating || 0;

        // Rating stars
        const ratingInput = document.getElementById('rating-input');
        ratingInput.querySelectorAll('.star').forEach(star => {
            star.addEventListener('click', (e) => {
                selectedRating = parseInt(e.target.dataset.rating);
                ratingInput.querySelectorAll('.star').forEach((s, index) => {
                    s.classList.toggle('filled', index < selectedRating);
                });
            });
        });

        // Status buttons
        const visitedBtn = document.getElementById('modal-visited');
        const toVisitBtn = document.getElementById('modal-to-visit');
        let isVisited = this.getUserData(id).visited;
        let isToVisit = this.getUserData(id).toVisit;

        visitedBtn.addEventListener('click', () => {
            isVisited = !isVisited;
            if (isVisited) isToVisit = false;
            visitedBtn.classList.toggle('active', isVisited);
            toVisitBtn.classList.toggle('active', isToVisit);
            visitedBtn.textContent = isVisited ? '✓ Visited' : 'Mark as Visited';
        });

        toVisitBtn.addEventListener('click', () => {
            if (!isVisited) {
                isToVisit = !isToVisit;
                toVisitBtn.classList.toggle('active', isToVisit);
                toVisitBtn.textContent = isToVisit ? '✓ Want to Visit' : 'Add to Want to Visit';
            }
        });

        // Save changes
        document.getElementById('save-changes').addEventListener('click', () => {
            const comment = document.getElementById('comment-input').value.trim();

            this.updateUserData(id, {
                rating: selectedRating,
                comment: comment,
                visited: isVisited,
                toVisit: isToVisit
            });

            document.getElementById('modal').style.display = 'none';
            this.renderRestaurants();
        });
    }

    // Get restaurant recommendations
    getRecommendations() {
        // Get visited restaurants with ratings
        const visitedWithRatings = this.restaurants.filter(r => {
            const userData = this.getUserData(r.id);
            return userData.visited && userData.rating >= 4;
        });

        // If no highly rated restaurants, return empty
        if (visitedWithRatings.length === 0) {
            return [];
        }

        // Get unvisited restaurants
        const unvisited = this.restaurants.filter(r =>
            !this.getUserData(r.id).visited
        );

        // Score each unvisited restaurant
        const scored = unvisited.map(restaurant => {
            let score = 0;
            let reasons = [];

            visitedWithRatings.forEach(liked => {
                const userData = this.getUserData(liked.id);

                // Same cuisine bonus
                if (restaurant.cuisine === liked.cuisine) {
                    score += userData.rating * 3;
                    reasons.push(`Similar to ${liked.name} (${liked.cuisine})`);
                }

                // Same price range bonus
                if (restaurant.priceRange === liked.priceRange) {
                    score += userData.rating * 2;
                }

                // Shared categories bonus
                const sharedCategories = restaurant.category.filter(cat =>
                    liked.category.includes(cat)
                );
                score += sharedCategories.length * userData.rating;
            });

            // Distance bonus (closer is better)
            score += (3 - restaurant.distance) * 0.5;

            return {
                ...restaurant,
                recommendationScore: score,
                recommendationReasons: reasons
            };
        });

        // Sort by score and return top 10
        return scored
            .filter(r => r.recommendationScore > 0)
            .sort((a, b) => b.recommendationScore - a.recommendationScore)
            .slice(0, 10);
    }

    // Get recommendation reason
    getRecommendationReason(restaurant) {
        if (restaurant.recommendationReasons && restaurant.recommendationReasons.length > 0) {
            return restaurant.recommendationReasons[0];
        }
        return 'Based on your preferences';
    }

    // Update statistics
    updateStats() {
        const totalRestaurants = this.restaurants.length;
        const visited = this.restaurants.filter(r =>
            this.getUserData(r.id).visited
        ).length;
        const toVisit = this.restaurants.filter(r =>
            this.getUserData(r.id).toVisit && !this.getUserData(r.id).visited
        ).length;

        // Calculate average rating
        const ratings = this.restaurants
            .map(r => this.getUserData(r.id).rating)
            .filter(rating => rating > 0);
        const avgRating = ratings.length > 0
            ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
            : '-';

        document.getElementById('total-restaurants').textContent = totalRestaurants;
        document.getElementById('visited-count').textContent = visited;
        document.getElementById('to-visit-count').textContent = toVisit;
        document.getElementById('avg-rating').textContent = avgRating;
    }

    // Clear all user data
    clearAllData() {
        this.userData = {};
        localStorage.removeItem('restaurantTrackerData');
        this.renderRestaurants();
        this.updateStats();
    }

    // Show error message
    showError(message) {
        alert(message);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new RestaurantTracker();
});

# UCF Restaurant Tracker

A web application that helps UCF students and community members track, rate, and discover restaurants near campus using intelligent recommendations based on their dining preferences.

## Features

- **100+ Restaurants**: Comprehensive database of restaurants within 3 miles of UCF main campus
- **Personal Tracking**: Mark restaurants as visited or "to visit"
- **Rating System**: Rate restaurants on a 5-star scale with personal comments
- **Smart Recommendations**: AI-powered recommendations based on your ratings and preferences
- **Advanced Filtering**: Search and filter by cuisine, price range, distance, and more
- **Local Storage**: All your data is stored locally in your browser - no account required
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Appetizing Design**: Warm, food-inspired color palette designed to stimulate appetite

## Live Demo

Visit the live application: [https://mikhailpakhotine-cyber.github.io/Restaurant-AI-Rating/](https://mikhailpakhotine-cyber.github.io/Restaurant-AI-Rating/)

## How It Works

### Tracking Restaurants
1. Browse through 100 restaurants categorized by cuisine, price, and distance
2. Click on any restaurant card to view detailed information
3. Mark restaurants as "Visited" or "Want to Visit"

### Rating & Reviewing
1. Open a restaurant's detail modal
2. Click on the stars to rate (1-5 stars)
3. Add personal comments about your experience
4. Save your changes - they're stored locally in your browser

### Getting Recommendations
1. Rate at least a few restaurants you've visited (4+ stars recommended)
2. Click the "Recommendations" tab
3. See personalized suggestions based on:
   - Cuisines you've enjoyed
   - Price ranges you prefer
   - Similar restaurants to your favorites
   - Proximity to campus

### Filtering & Sorting
- **Search**: Find restaurants by name, cuisine, or address
- **Cuisine Filter**: View only specific types of food
- **Price Range**: Filter by budget ($, $$, $$$)
- **Distance**: Show only restaurants within a certain radius
- **Sort Options**: By name, distance, your rating, or price

## Technology Stack

- **HTML5**: Semantic markup for accessibility
- **CSS3**: Modern responsive design with CSS Grid and Flexbox
- **Vanilla JavaScript**: No frameworks - fast and lightweight
- **Local Storage API**: Client-side data persistence
- **GitHub Pages**: Static site hosting

## Restaurant Data

The application includes 100 real restaurants near UCF campus, featuring:
- Cuisine types: American, Mexican, Chinese, Japanese, Italian, Pizza, and more
- Price ranges: $ (budget-friendly) to $$$ (upscale dining)
- Distance: 0.5 to 3 miles from campus
- Categories: Fast Food, Casual Dining, Fine Dining, Cafes, etc.

## Recommendation Algorithm

The recommendation system uses a scoring algorithm that considers:
1. **Cuisine Matching**: Higher scores for cuisines you've rated highly
2. **Price Preference**: Recommends restaurants in your preferred price range
3. **Category Overlap**: Suggests restaurants with similar attributes
4. **Distance Factor**: Slightly favors closer restaurants
5. **Rating Weight**: Higher-rated restaurants have more influence

## Privacy

All data is stored locally in your browser using the Local Storage API. No personal information is collected, transmitted, or stored on any server. Your ratings, comments, and tracking data never leave your device.

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support

## Deployment

This application is optimized for GitHub Pages deployment:

1. The `.nojekyll` file prevents Jekyll processing
2. All assets are referenced with relative paths
3. No server-side processing required
4. Fast loading with minimal dependencies

## Local Development

To run locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/mikhailpakhotine-cyber/Restaurant-AI-Rating.git
   cd Restaurant-AI-Rating
   ```

2. Serve the files using any static file server:
   ```bash
   # Using Python 3
   python -m http.server 8000

   # Using Node.js
   npx serve

   # Or simply open index.html in your browser
   ```

3. Open `http://localhost:8000` in your browser

## Data Management

### Clearing Data
Click the "Clear All Data" button in the footer to reset all your ratings, comments, and tracking data.

### Exporting Data
Your data is stored in Local Storage under the key `restaurantTrackerData`. You can access it via browser Developer Tools > Application > Local Storage.

## Future Enhancements

Potential features for future versions:
- Export ratings to CSV/JSON
- Import data from backup
- Dark mode toggle
- Share restaurant lists with friends
- Add custom restaurants
- Photo uploads
- Map integration
- Filter by dietary restrictions

## Credits

- Restaurant data compiled from public sources
- Color scheme: Warm Tomato Red (#E74C3C), Fresh Orange (#FF8C42), and Fresh Green (#27AE60)
- Appetizing color palette designed to enhance the dining discovery experience

## License

This project is open source and available for educational purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

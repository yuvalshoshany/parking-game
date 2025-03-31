# Parking Game

A browser-based parking game where you need to park your car in designated spots while avoiding obstacles and other vehicles.

## How to Play

1. Open `index.html` in a modern web browser
2. Use the arrow keys to control your car:
   - Up Arrow: Accelerate
   - Down Arrow: Brake/Reverse
   - Left Arrow: Turn left
   - Right Arrow: Turn right

## Game Rules

- Park your car (yellow) in the designated parking spot (marked with yellow lines)
- Avoid colliding with other cars and obstacles (traffic cones)
- Complete the parking maneuver within the time limit
- The car must be completely within the parking spot and at the correct angle to complete the level
- Each level introduces new challenges with more cars and obstacles

## Features

- Multiple levels with increasing difficulty
- Realistic car physics with acceleration and turning
- Time limit for each level
- Visual feedback for success and failure
- Settings menu (coming soon)

## Technical Details

The game is built using vanilla JavaScript and HTML5 Canvas, with no external dependencies. It features:

- Object-oriented design with separate classes for Game, Level, and Car
- Collision detection system
- Simple physics simulation
- Responsive controls
- Clean and modern UI

## Development

To modify or enhance the game:

1. Edit the JavaScript files in the `js` directory:
   - `game.js`: Main game loop and initialization
   - `car.js`: Car physics and rendering
   - `level.js`: Level design and obstacle management
   - `utils.js`: Utility functions

2. Modify the CSS in `styles.css` to change the game's appearance

3. Update `index.html` to add new UI elements or change the layout

## License

MIT License - Feel free to use, modify, and distribute this code. 
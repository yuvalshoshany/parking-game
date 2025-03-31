class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.canvas.width = 800;
        this.canvas.height = 600;
        
        // Game state
        this.currentLevel = 1;
        this.level = new Level(this.currentLevel);
        this.keys = {};
        
        // Bind event listeners
        this.bindEvents();
        
        // Start game loop
        this.lastTime = 0;
        requestAnimationFrame(this.gameLoop.bind(this));
    }
    
    bindEvents() {
        // Keyboard events
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
        
        // Settings button
        document.querySelector('.settings-btn').addEventListener('click', () => {
            // TODO: Implement settings menu
            console.log('Settings clicked');
        });
    }
    
    handleInput() {
        const car = this.level.playerCar;
        
        if (this.keys['ArrowUp']) {
            car.accelerate();
        }
        if (this.keys['ArrowDown']) {
            car.brake();
        }
        if (this.keys['ArrowLeft']) {
            car.turn(-1);
        }
        if (this.keys['ArrowRight']) {
            car.turn(1);
        }
    }
    
    update(deltaTime) {
        // Handle player input
        this.handleInput();
        
        // Update level
        this.level.update(deltaTime);
        
        // Check level completion
        if (this.level.completed) {
            this.currentLevel++;
            this.level = new Level(this.currentLevel);
        }
        
        // Update UI
        document.getElementById('time').textContent = 
            Utils.formatTime(this.level.timeRemaining);
        document.getElementById('level').textContent = 
            this.currentLevel.toString();
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#333333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw road texture
        this.drawRoadTexture();
        
        // Draw level
        this.level.draw(this.ctx);
        
        // Draw game over or level complete message
        if (this.level.failed) {
            this.drawMessage('Game Over! Press R to restart', '#FF0000');
        } else if (this.level.completed) {
            this.drawMessage('Level Complete!', '#00FF00');
        }
    }
    
    drawRoadTexture() {
        this.ctx.fillStyle = '#444444';
        const tileSize = 20;
        
        for (let x = 0; x < this.canvas.width; x += tileSize) {
            for (let y = 0; y < this.canvas.height; y += tileSize) {
                if ((x + y) % (tileSize * 2) === 0) {
                    this.ctx.fillRect(x, y, tileSize, tileSize);
                }
            }
        }
    }
    
    drawMessage(text, color) {
        this.ctx.save();
        this.ctx.fillStyle = color;
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, this.canvas.width/2, this.canvas.height/2);
        this.ctx.restore();
    }
    
    gameLoop(timestamp) {
        // Calculate delta time
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // Update and draw
        this.update(deltaTime);
        this.draw();
        
        // Request next frame
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game();
}); 
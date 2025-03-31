class Level {
    constructor(number) {
        this.number = number;
        this.cars = [];
        this.obstacles = [];
        this.parkingSpot = null;
        this.playerCar = null;
        this.timeLimit = 180; // 3 minutes
        this.timeRemaining = this.timeLimit;
        this.completed = false;
        this.failed = false;
        
        this.setupLevel();
    }

    setupLevel() {
        // Calculate random position for parking spot
        // Keep some margin from edges
        const margin = 100;
        const x = margin + Math.random() * (800 - margin * 2 - 130); // 130 is new parking spot width
        const y = margin + Math.random() * (600 - margin * 2 - 78); // 78 is new parking spot height
        
        // Random angle in 90-degree increments
        const angles = [0, 90, 180, 270];
        const randomAngle = angles[Math.floor(Math.random() * angles.length)];

        // Create parking spot with random position and angle (bigger spot)
        this.parkingSpot = {
            x: x,
            y: y,
            width: 130,  // 91 * 1.4 (40% bigger than car)
            height: 78,  // 52 * 1.5 (50% bigger than car)
            angle: randomAngle
        };

        // Create player car with correct dimensions (30% bigger)
        const playerX = (x < 400) ? 700 : 100;
        const playerY = (y < 300) ? 500 : 100;
        this.playerCar = new Car(playerX, playerY, 91, 52, '#FFD700'); // 70 * 1.3, 40 * 1.3

        // Add obstacle cars based on level
        if (this.number >= 2) {
            const obstacleX = 300 + Math.random() * 200;
            const obstacleY = 200 + Math.random() * 200;
            this.cars.push(new Car(obstacleX, obstacleY, 91, 52, '#4169E1'));
        }
        if (this.number >= 3) {
            const obstacleX = 200 + Math.random() * 300;
            const obstacleY = 100 + Math.random() * 400;
            this.cars.push(new Car(obstacleX, obstacleY, 91, 52, '#DC143C'));
        }

        // Add traffic cones based on level
        if (this.number >= 4) {
            for (let i = 0; i < this.number; i++) {
                const coneX = margin + Math.random() * (800 - margin * 2);
                const coneY = margin + Math.random() * (600 - margin * 2);
                this.obstacles.push({
                    x: coneX,
                    y: coneY,
                    radius: 10
                });
            }
        }
    }

    update(deltaTime) {
        if (this.completed || this.failed) return;

        // Update time
        this.timeRemaining -= deltaTime;
        if (this.timeRemaining <= 0) {
            this.failed = true;
            return;
        }

        // Update player car
        this.playerCar.update();

        // Check collision with other cars
        for (const car of this.cars) {
            if (this.checkCarCollision(this.playerCar, car)) {
                this.failed = true;
                return;
            }
        }

        // Check collision with obstacles
        for (const obstacle of this.obstacles) {
            if (this.checkObstacleCollision(this.playerCar, obstacle)) {
                this.failed = true;
                return;
            }
        }

        // Check if car is parked correctly
        if (this.checkParking()) {
            this.completed = true;
        }
    }

    draw(ctx) {
        // Draw parking spot
        ctx.save();
        ctx.strokeStyle = '#FFD700';
        ctx.fillStyle = '#FFD700';
        ctx.lineWidth = 3;

        // Draw the parking spot
        ctx.translate(this.parkingSpot.x + this.parkingSpot.width/2, 
                     this.parkingSpot.y + this.parkingSpot.height/2);
        ctx.rotate(Utils.degreesToRadians(this.parkingSpot.angle));
        ctx.translate(-(this.parkingSpot.x + this.parkingSpot.width/2), 
                     -(this.parkingSpot.y + this.parkingSpot.height/2));
        
        ctx.strokeRect(
            this.parkingSpot.x,
            this.parkingSpot.y,
            this.parkingSpot.width,
            this.parkingSpot.height
        );

        // Draw direction arrow
        const arrowSize = 20;
        const centerX = this.parkingSpot.x + this.parkingSpot.width/2;
        const centerY = this.parkingSpot.y + this.parkingSpot.height/2;
        
        ctx.beginPath();
        ctx.moveTo(centerX - arrowSize, centerY);
        ctx.lineTo(centerX + arrowSize, centerY);
        ctx.lineTo(centerX + arrowSize - 10, centerY - 10);
        ctx.moveTo(centerX + arrowSize, centerY);
        ctx.lineTo(centerX + arrowSize - 10, centerY + 10);
        ctx.stroke();

        ctx.restore();

        // Draw obstacle cars
        for (const car of this.cars) {
            car.draw(ctx);
        }

        // Draw traffic cones
        ctx.fillStyle = '#FF4500';
        for (const obstacle of this.obstacles) {
            ctx.beginPath();
            ctx.arc(obstacle.x, obstacle.y, obstacle.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Draw player car
        this.playerCar.draw(ctx);

        // Draw completion message
        if (this.completed) {
            ctx.save();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            ctx.fillRect(0, 0, 800, 600);
            
            ctx.fillStyle = '#00FF00';
            ctx.font = '48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Level Complete!', 400, 300);
            ctx.font = '24px Arial';
            ctx.fillText('Press SPACE for next level', 400, 350);
            ctx.restore();
        }
    }

    getMinMaxPoints(corners) {
        return {
            minX: Math.min(...corners.map(c => c.x)),
            maxX: Math.max(...corners.map(c => c.x)),
            minY: Math.min(...corners.map(c => c.y)),
            maxY: Math.max(...corners.map(c => c.y))
        };
    }

    checkCarCollision(car1, car2) {
        const corners1 = car1.getCorners();
        const corners2 = car2.getCorners();
        
        const bounds1 = this.getMinMaxPoints(corners1);
        const bounds2 = this.getMinMaxPoints(corners2);
        
        return !(bounds1.maxX < bounds2.minX || 
                bounds2.maxX < bounds1.minX || 
                bounds1.maxY < bounds2.minY || 
                bounds2.maxY < bounds1.minY);
    }

    checkObstacleCollision(car, obstacle) {
        const carCorners = car.getCorners();
        for (const corner of carCorners) {
            const distance = Utils.distanceBetweenPoints(
                corner.x,
                corner.y,
                obstacle.x,
                obstacle.y
            );
            if (distance < obstacle.radius) {
                return true;
            }
        }
        return false;
    }

    checkParking() {
        // Get car corners
        const carCorners = this.playerCar.getCorners();
        const carBounds = this.getMinMaxPoints(carCorners);
        
        // Transform car position relative to parking spot's rotation
        const carCenter = {
            x: this.playerCar.x + this.playerCar.width/2,
            y: this.playerCar.y + this.playerCar.height/2
        };
        
        const spotCenter = {
            x: this.parkingSpot.x + this.parkingSpot.width/2,
            y: this.parkingSpot.y + this.parkingSpot.height/2
        };
        
        // Add some margin for easier parking (5 pixels on each side)
        const margin = 5;
        // Check if car is within parking spot
        const carInSpot = (
            carBounds.minX >= this.parkingSpot.x - margin &&
            carBounds.maxX <= this.parkingSpot.x + this.parkingSpot.width + margin &&
            carBounds.minY >= this.parkingSpot.y - margin &&
            carBounds.maxY <= this.parkingSpot.y + this.parkingSpot.height + margin
        );

        // Normalize angles to 0-360 range
        let carAngle = ((this.playerCar.angle % 360) + 360) % 360;
        let spotAngle = ((this.parkingSpot.angle % 360) + 360) % 360;
        
        // Check if car is at correct angle (within 15 degrees)
        const angleDiff = Math.abs(carAngle - spotAngle);
        const angleOk = angleDiff < 15 || angleDiff > 345;
        
        // Car must be almost stopped, in the spot, and at roughly the correct angle
        const isParked = carInSpot && angleOk && Math.abs(this.playerCar.speed) < 0.2; // More lenient speed check
        
        // Only set completed if not already completed
        if (isParked && !this.completed) {
            this.completed = true;
            // Add a small delay before allowing next level
            setTimeout(() => {
                const handleNextLevel = (e) => {
                    if (e.code === 'Space') {
                        window.removeEventListener('keydown', handleNextLevel);
                        this.number++;
                        this.setupLevel();
                        this.completed = false;
                    }
                };
                window.addEventListener('keydown', handleNextLevel);
            }, 500);
        }
        
        return isParked;
    }
} 
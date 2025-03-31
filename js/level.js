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
        // Create parking spot with adjusted size for horizontal car
        this.parkingSpot = {
            x: 600,
            y: 300,
            width: 80,  // Now wider than tall
            height: 50, // Now shorter than wide
            angle: 0
        };

        // Create player car with correct dimensions (wider than tall)
        this.playerCar = new Car(100, 300, 70, 40, '#FFD700');

        // Add obstacle cars based on level
        if (this.number >= 2) {
            this.cars.push(new Car(300, 200, 70, 40, '#4169E1'));
        }
        if (this.number >= 3) {
            this.cars.push(new Car(300, 400, 70, 40, '#DC143C'));
        }

        // Add traffic cones based on level
        if (this.number >= 4) {
            for (let i = 0; i < this.number; i++) {
                this.obstacles.push({
                    x: 400 + i * 30,
                    y: 250 + i * 30,
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
        ctx.lineWidth = 3;
        ctx.strokeRect(
            this.parkingSpot.x,
            this.parkingSpot.y,
            this.parkingSpot.width,
            this.parkingSpot.height
        );
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
    }

    checkCarCollision(car1, car2) {
        // Simple bounding box collision for now
        const corners1 = car1.getCorners();
        const corners2 = car2.getCorners();
        
        // Find min/max points for both cars
        const bounds1 = this.getMinMaxPoints(corners1);
        const bounds2 = this.getMinMaxPoints(corners2);
        
        return !(bounds1.maxX < bounds2.minX || 
                bounds2.maxX < bounds1.minX || 
                bounds1.maxY < bounds2.minY || 
                bounds2.maxY < bounds1.minY);
    }

    getMinMaxPoints(corners) {
        return {
            minX: Math.min(...corners.map(c => c.x)),
            maxX: Math.max(...corners.map(c => c.x)),
            minY: Math.min(...corners.map(c => c.y)),
            maxY: Math.max(...corners.map(c => c.y))
        };
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
        
        // Check if car is within parking spot
        const carInSpot = (
            carBounds.minX >= this.parkingSpot.x &&
            carBounds.maxX <= this.parkingSpot.x + this.parkingSpot.width &&
            carBounds.minY >= this.parkingSpot.y &&
            carBounds.maxY <= this.parkingSpot.y + this.parkingSpot.height
        );

        // Normalize angles to 0-360 range
        let carAngle = ((this.playerCar.angle % 360) + 360) % 360;
        let spotAngle = ((this.parkingSpot.angle % 360) + 360) % 360;
        
        // Check if car is at correct angle (within 5 degrees)
        const angleDiff = Math.abs(carAngle - spotAngle);
        const angleOk = angleDiff < 5 || angleDiff > 355;
        
        return carInSpot && angleOk && Math.abs(this.playerCar.speed) < 0.1;
    }
} 
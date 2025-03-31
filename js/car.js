class Car {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.angle = 0;
        this.speed = 0;
        this.acceleration = 0.15;
        this.maxSpeed = 4;
        this.turnSpeed = 2.5;
        this.friction = 0.95;
        this.colliding = false;
        
        // Load the appropriate SVG image based on color
        this.image = new Image();
        if (color === '#FFD700') {
            this.image.src = 'assets/car-yellow.svg';
        } else if (color === '#4169E1') {
            this.image.src = 'assets/car-blue.svg';
        } else if (color === '#DC143C') {
            this.image.src = 'assets/car-red.svg';
        }
    }

    update() {
        // Update position based on speed and angle
        if (this.speed !== 0) {
            const rad = Utils.degreesToRadians(this.angle);
            this.x += Math.cos(rad) * this.speed;
            this.y += Math.sin(rad) * this.speed;
        }
        
        // Apply friction
        this.speed *= this.friction;
        
        // Stop completely if speed is very low
        if (Math.abs(this.speed) < 0.1) {
            this.speed = 0;
        }
    }

    getCorners() {
        const corners = [
            { x: -this.width/2, y: -this.height/2 },
            { x: this.width/2, y: -this.height/2 },
            { x: this.width/2, y: this.height/2 },
            { x: -this.width/2, y: this.height/2 }
        ];

        return corners.map(corner => {
            return Utils.rotatePoint(
                corner.x + this.x + this.width/2,
                corner.y + this.y + this.height/2,
                this.x + this.width/2,
                this.y + this.height/2,
                this.angle
            );
        });
    }

    draw(ctx) {
        ctx.save();
        
        // Translate to car's center
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        
        // Rotate
        ctx.rotate(Utils.degreesToRadians(this.angle));
        
        // Draw the car image centered
        ctx.drawImage(
            this.image,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height
        );
        
        ctx.restore();
    }

    accelerate() {
        this.speed = Math.min(this.speed + this.acceleration, this.maxSpeed);
    }

    brake() {
        this.speed = Math.max(this.speed - this.acceleration, -this.maxSpeed/2);
    }

    turn(direction) {
        if (Math.abs(this.speed) > 0.1) {
            this.angle += direction * this.turnSpeed * (this.speed/this.maxSpeed);
        }
    }
} 
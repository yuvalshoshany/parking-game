const Utils = {
    degreesToRadians: (degrees) => {
        return degrees * Math.PI / 180;
    },
    
    radiansToDegrees: (radians) => {
        return radians * 180 / Math.PI;
    },
    
    distanceBetweenPoints: (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },
    
    formatTime: (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    },
    
    checkCollision: (rect1, rect2) => {
        return !(rect1.x + rect1.width < rect2.x || 
                rect2.x + rect2.width < rect1.x || 
                rect1.y + rect1.height < rect2.y || 
                rect2.y + rect2.height < rect1.y);
    },
    
    rotatePoint: (x, y, cx, cy, angle) => {
        const radians = Utils.degreesToRadians(angle);
        const cos = Math.cos(radians);
        const sin = Math.sin(radians);
        const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx;
        const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
        return { x: nx, y: ny };
    }
}; 
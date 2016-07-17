/**
 * @Auther Pengyu Wang
 */

function Particle(id, mass, color, posX, posY, speedX, speedY) {
    this.id = id;
    this.color = color;
    this.mass = mass;
    this.posX = posX;
    this.posY = posY;
    this.speedX = speedX;
    this.speedY = speedY;
    this.radius = getRadiusByMass(mass);
    
    this.update = function(forceX, forceY, height, width, gravity) {
        var accelerationX = forceX / mass;
        var accelerationY = forceY / mass + gravity;
        this.speedX += accelerationX;
        this.speedY += accelerationY;
        this.posX += this.speedX;
        this.posY += this.speedY;
        
        // Bounce around
        if (this.posX >= width - this.radius) this.speedX = -Math.abs(this.speedX); 
        if (this.posX <= this.radius) this.speedX = Math.abs(this.speedX); 
        if (this.posY >= height - this.radius) {
            this.speedY = -Math.abs(this.speedY); 
            
            // Boundary condition, avoid keep sinking
            if (Math.abs(this.speedY) <= 1) {
                this.posY = height - this.radius;
            }
        }
        if (this.posY <= this.radius) this.speedY = Math.abs(this.speedY);
    }
    
    this.wakeUp = function() {
        this.speedX = Math.random() * 40;
        this.speedY = Math.random() * 40;
    }
}

function getRadiusByMass(mass) {
    return Math.round(Math.sqrt(mass * 10 / Math.PI));
}

function drawParticle(context, particle) {

    context.beginPath();
    context.arc(particle.posX, particle.posY, particle.radius, 0, 2 * Math.PI, false);
    context.fillStyle = particle.color;
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = '#003300';
    context.stroke();
}

var WIDTH = 1000;
var HEIGHT = 600;
var GRAVITY = 1;
var forceX = 0;
var forceY = 0;
var context = document.getElementById("canvas").getContext("2d");
var particleList = [];
var colorList = ['black', 'green', 'yellow', 'red', 'purple', 'pink', 'blue', 'orange'];
var counter = 0;

context.globalAlpha = 0.5;

document.onmousedown = function(mouse) {
    var color = colorList[Math.round(Math.random() * colorList.length)];
    var x = Math.round(Math.random() * WIDTH);
    var y = 100;
    particleList.push(new Particle(counter, 100, color, x, y, 0, 0));
    counter ++;
}

document.onkeydown = function(event) {
    // Press right
    if (event.keyCode == 39) forceX = 20;
    
    // Press left
    if (event.keyCode == 37) forceX = -20;
    
    // Press up
    if (event.keyCode == 38) forceY = -50;
    
    // Press down
    if (event.keyCode == 40) forceY = 50;
    
    // Press enter
    if (event.keyCode == 13) wakeUpFolks();
}

document.onkeyup = function(event) {
    if (event.keyCode == 39) forceX = 0;
    if (event.keyCode == 37) forceX = 0;
    if (event.keyCode == 38) forceY = 0;
    if (event.keyCode == 40) forceY = 0;
}

function update() {
    context.clearRect(0, 0, WIDTH, HEIGHT);
    for (var i = 0; i < particleList.length; i ++) {
        particleList[i].update(forceX, forceY, HEIGHT, WIDTH, GRAVITY);
        drawParticle(context, particleList[i]);
    }
}

function wakeUpFolks() {
    for (var i = 0; i < particleList.length; i ++) {
        particleList[i].wakeUp();
    }
}

setInterval(update, 1000 / 60);
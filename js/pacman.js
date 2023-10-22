const map = [
    [' ', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-'],
    [' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-'],
    [' ', '-', 'p', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', 'p', '-'],
    [' ', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '.', '-'],
    [' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', '-', '.', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '.', '-', ' '],
    [' ', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', '-', '-', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '-', '-', ' '],
    [' ', ' ', ' ', ' ', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', ' ', ' ', ' ', ' '],
    [' ', '-', '-', '-', '-', '.', '-', '.', '-', '-', ' ', '-', '-', '.', '-', '.', '-', '-', '-', '-', ' '],
    ['e', ' ', ' ', ' ', ' ', '.', '.', '.', '-', 'g', 'g', 'g', '-', '.', '.', '.', ' ', ' ', ' ', ' ', 'e'],
    [' ', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', ' '],
    [' ', ' ', ' ', ' ', '-', '.', '-', '.', '.', '.', '.', '.', '.', '.', '-', '.', '-', ' ', ' ', ' ', ' '],
    [' ', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', ' '],
    [' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', '-', '.', '-', '-', '.', '-', '-', '-', '.', '-', '.', '-', '-', '-', '.', '-', '-', '.', '-', ' '],
    [' ', '-', 'p', '.', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', '.', 'p', '-', ' '],
    [' ', '-', '-', '.', '-', '.', '-', '.', '-', '-', '-', '-', '-', '.', '-', '.', '-', '.', '-', '-', ' '],
    [' ', '-', '.', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '-', '.', '.', '.', '.', '-', ' '],
    [' ', '-', '.', '-', '-', '-', '-', '-', '-', '.', '-', '.', '-', '-', '-', '-', '-', '-', '.', '-', ' '],
    [' ', '-', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '-', ' '],
    [' ', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', '-', ' '],
] // this looks the all of map

// make the game board as a canvas
const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 70;
canvas.style.position = 'fixed';
canvas.style.top = '70px';
canvas.style.left = '0';
const context = canvas.getContext("2d");
document.getElementById("pacman").remove();
document.body.appendChild(canvas);
const scoreTag = document.createElement("h1"),
    scoreElement = document.createElement("b"),
    bloodContainer = document.createElement("div");
scoreTag.style.color = '#9e9e3d';
scoreTag.style.position = 'fixed';
scoreTag.style.bottom = '10px';
scoreTag.style.right = '50px';
scoreTag.innerText = 'press n to start a new game';
document.body.append(scoreTag);

// class of the walls
class Wall {
    static width = 40;
    static height = 40;
    constructor(position = { x: 0, y: 0 }, color = 'blue') {
        this.position = position;
        this.width = 40;
        this.height = 40;
        this.color = color;
    }
    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}

// the Circel class used for the points and powerups
class Circel {
    constructor(position = { x: 0, y: 0 }, redius = 3) {
        this.redius = redius;
        let padding = Wall.width / 2;
        this.position = { x: position.x + padding, y: position.y + padding };
    }
    draw() {
        context.fillStyle = '#fff';
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.redius, 0, Math.PI * 2);
        context.fill();
    }
}

// the blow class is a magical calss! beccuse this class role is making the Hero! 
class Pacman {
    redius = 12;
    mouse = 0.75;
    openRate = 0.05;
    move = { x: 0, y: 0 };
    rotate = Math.PI * 2;
    constructor(position = { x: 0, y: 0 }) {
        let padding = Wall.width / 2;
        this.position = { x: position.x + padding, y: position.y + padding };
    }
    draw() {
        context.fillStyle = 'yellow';
        context.save();
        context.translate(this.position.x, this.position.y);
        context.rotate(this.rotate);
        context.translate(-this.position.x, -this.position.y);
        context.beginPath();
        context.moveTo(this.position.x, this.position.y);
        context.lineTo(this.position.x, this.position.y);
        context.arc(this.position.x, this.position.y, this.redius, this.mouse, Math.PI * 2 - this.mouse, false);
        context.closePath();
        context.fill();
        context.restore()
    }
    crashDtetction(player, wall) {
        const padding = Wall.width / 2 - this.redius * 2;
        return (
            player.position.y - player.redius + player.move.y <= wall.position.y + wall.height - padding &&
            player.position.x + player.redius + player.move.x >= wall.position.x + padding &&
            player.position.y + player.redius + player.move.y >= wall.position.y + padding &&
            player.position.x - player.redius + player.move.x <= wall.position.x + wall.width - padding
        )
    }
    update() {
        if (this.move.x > 0) this.rotate = Math.PI * 2;
        else if (this.move.x < 0) this.rotate = Math.PI;
        else if (this.move.y < 0) this.rotate = Math.PI * 1.5;
        else if (this.move.y > 0) this.rotate = Math.PI / 2;
        this.draw();
        this.position.x += this.move.x;
        this.position.y += this.move.y;
        if (this.mouse < 0 || this.mouse > 0.75) this.openRate = -this.openRate;
        this.mouse -= this.openRate;
    }
}

class Ghost {
    static speed = 2;
    static width = 25;
    static height = 25;
    scared = false;
    dead = false;
    move = { x: 0, y: 0 };
    preClosed = [];
    direction = '';
    constructor(move = { x: 0, y: 0 }, color = 'blue', position = { x: 0, y: 0 }) {
        this.color = color;
        this.width = 28;
        this.height = 28;
        this.position = position;
        this.move = move;
    }
    crashDtetction(ghost, wall) {
        const padding = (Wall.width - ghost.width) / 2 - 1;
        return (
            ghost.position.y + ghost.move.y - padding <= wall.position.y + wall.height &&
            ghost.position.x + ghost.move.x + ghost.width + padding >= wall.position.x &&
            ghost.position.y + ghost.move.y + ghost.height + padding >= wall.position.y &&
            ghost.position.x + ghost.move.x - padding <= wall.position.x + wall.width
        )
    }
    draw() {
        this.img = new Image;
        this.img.src = `view/${this.scared ? 'scared' : this.color}.png`;
        context.drawImage(this.img, this.position.x, this.position.y, this.width, this.height);
    }
    update() {
        this.draw();
        this.position.x += this.move.x;
        this.position.y += this.move.y;
    }
}
// the array of all map objects
let walls,
    points,
    powerUps,
    ghosts,
    exits,
    player,
    keys,
    lastKey,
    score,
    start = false,
    ghostnum,
    ghostMoves = [{ x: 5, y: 0 }, { y: -5, x: 0 }, { x: -5, y: 0 }];

const makeMap = () => {
    walls = [];
    points = [];
    powerUps = [];
    player = new Pacman({ x: Wall.width * 2, y: Wall.height });
    keys = {
        up: false,
        down: false,
        right: false,
        left: false,
    };
    lastKey = '';
    score = 0;
    ghosts = [];
    exits = [];
    blood = 3;
    ghostnum = 0;
    // made the map objects
    let ghostColors = ['blue', 'pink', 'red', 'orange'];
    map.forEach((row, rowIndex) => {
        row.map((item, index) => {
            switch (item) {
                case "-":
                    walls.push(new Wall({ x: index * Wall.width, y: rowIndex * Wall.height }));
                    break;
                case ".":
                    points.push(new Circel({ x: index * Wall.width, y: rowIndex * Wall.height }));
                    break;
                case "p":
                    powerUps.push(new Circel({ x: index * Wall.width, y: rowIndex * Wall.height }, 6));
                    break;
                case "e":
                    exits.push(new Wall({ x: index * Wall.width, y: rowIndex * Wall.height }, 'black'));
                    break;
                case "g":
                    let colorIndex = Math.floor(Math.random() * ghostColors.length);
                    ghosts.push(new Ghost(ghostMoves[ghostnum], ghostColors[colorIndex], { x: index * Wall.width + (Wall.width - Ghost.width) / 2 - 1, y: rowIndex * Wall.height + (Wall.height - Ghost.height) / 2 - 1 }));
                    ghostColors.splice(colorIndex, 1);
                    ghostnum++;
                    break;
            }
        })
    })
}
// the animate function used for draw and update game objects
const animate = () => {
    bloodContainer.innerHTML = Array(blood).fill(`<img src='view/pacman-right.png'/>`).join("");
    scoreElement.innerText = score;
    if (keys.up && lastKey == 'ArrowUp') {
        for (let i = 0; i < walls.length; i++)
            if (!player.crashDtetction({ ...player, move: { x: 0, y: -5 } }, walls[i])) {
                player.move.y = -5;
            }
            else {
                player.move.y = 0;
                break;
            }
    } else if (keys.down && lastKey == 'ArrowDown') {
        for (let i = 0; i < walls.length; i++)
            if (!player.crashDtetction({ ...player, move: { x: 0, y: 5 } }, walls[i])) {
                player.move.y = 5;
            }
            else {
                player.move.y = 0;
                break;
            }
    } else if (keys.right && lastKey == 'ArrowRight') {
        for (let i = 0; i < walls.length; i++)
            if (!player.crashDtetction({ ...player, move: { x: 5, y: 0 } }, walls[i])) {
                player.move.x = 5;
            }
            else {
                player.move.x = 0;
                break;
            }
    } else if (keys.left && lastKey == 'ArrowLeft') {
        for (let i = 0; i < walls.length; i++)
            if (!player.crashDtetction({ ...player, move: { x: -5, y: 0 } }, walls[i])) {
                player.move.x = -5;
            }
            else {
                player.move.x = 0;
                break;
            }
    }
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    walls.forEach(wall => {
        wall.draw();
        if (player.crashDtetction(player, wall))
            player.move = { x: 0, y: 0 }
    })
    exits.forEach((exit, index) => {
        exit.draw();
        if (player.crashDtetction(player, exit)) {
            let parallelExit = exits.filter((e, i) => e.position.y == exit.position.y && i != index);
            if (parallelExit.length) {
                parallelExit = parallelExit[0];
                return player.position.x = parallelExit.position.x + ((parallelExit.position.x != 0 ? -(Wall.width / 2) : Wall.width + (Wall.width / 2)));
            }
            player.move = { x: 0, y: 0 };
        }
        ghosts.forEach(ghost => {
            if (ghost.crashDtetction(ghost, exit)) {
                let parallelExit = exits.filter((e, i) => e.position.y == exit.position.y && i != index);
                if (parallelExit.length) {
                    parallelExit = parallelExit[0];
                    return ghost.position.x = parallelExit.position.x + ((parallelExit.position.x != 0 ? -(Wall.width / 2) : Wall.width + (Wall.width / 2)));
                }
                ghost.move = { x: 0, y: 0 };
            }
        })

    })
    for (let i = points.length - 1; i >= 0; i--) {
        let point = points[i];
        if (Math.hypot(point.position.x - player.position.x, point.position.y - player.position.y) < player.redius + point.redius) {
            points.splice(i, 1);
            score++;
        }
        point.draw();
    }
    for (let i = powerUps.length - 1; i >= 0; i--) {
        let powerUp = powerUps[i];
        if (Math.hypot(powerUp.position.x - player.position.x, powerUp.position.y - player.position.y) < player.redius + powerUp.redius) {
            powerUps.splice(i, 1);
            ghosts.forEach(ghost => {
                if (ghost.timeout) clearTimeout(ghost.timeout);
                ghost.scared = true;
                let timeout = setTimeout(() => {
                    ghost.scared = false;
                }, 5000);
                ghost.timeout = timeout;
            });
        }
        powerUp.draw();
    }
    if (!points.length || blood <= 0) {
        scoreTag.innerText = (blood) ? 'You won :) Press n to restart' : "You lose :( Press n to restart";
        start = false;
        return cancelAnimationFrame(animate);
    } else {
        requestAnimationFrame(animate);
    }
    player.update();
    for (let i = ghosts.length - 1; i >= 0; i--) {
        let ghost = ghosts[i];
        ghost.update();
        if (!ghost.dead) {
            if (player.crashDtetction(player, ghost)) {
                if (ghost.scared) {
                    ghost.dead = true;
                    ghost.scared = false;
                    ghost.color = 'eaten';
                    ghost.move = { x: 0, y: 10 };
                } else {
                    player.move = { x: 0, y: 0 };
                    player.position = { x: Wall.width * 2 + Wall.width / 2, y: Wall.height + Wall.width / 2 };
                    blood--;
                };
            }
            let closes = [];
            for (let i = 0; i < walls.length; i++) {
                let wall = walls[i];
                if (ghost.crashDtetction({ ...ghost, move: { x: 0, y: -Ghost.speed } }, wall) && !closes.includes("up")) {
                    closes.push("up");
                }
                if (ghost.crashDtetction({ ...ghost, move: { x: 0, y: Ghost.speed } }, wall) && !closes.includes("down")) {
                    closes.push("down");
                }
                if (ghost.crashDtetction({ ...ghost, move: { x: Ghost.speed, y: 0 } }, wall) && !closes.includes("right")) {
                    closes.push("right");
                }
                if (ghost.crashDtetction({ ...ghost, move: { x: -Ghost.speed, y: 0 } }, wall) && !closes.includes("left")) {
                    closes.push("left");
                }
            }
            if (closes.length > ghost.preClosed.length)
                ghost.preClosed = closes;
            if (JSON.stringify(ghost.preClosed) != JSON.stringify(closes)) {
                if (ghost.move.x > 0) closes.push('right');
                else if (ghost.move.x < 0) closes.push('left');
                else if (ghost.move.y < 0) closes.push('up');
                else if (ghost.move.y > 0) closes.push('down');
                console.log(ghost.preClosed, ghost.move.x, closes);
                let pathways = ghost.preClosed.filter(way => !closes.includes(way));
                let direction = pathways[Math.floor(Math.random() * pathways.length)];
                if (direction)
                    ghost.direction = direction;
                switch (ghost.direction) {
                    case "up":
                        ghost.move = { x: 0, y: -Ghost.speed };
                        break;
                    case "down":
                        ghost.move = { x: 0, y: Ghost.speed };
                        break;
                    case "right":
                        ghost.move = { x: Ghost.speed, y: 0 };
                        break;
                    case "left":
                        ghost.move = { x: -Ghost.speed, y: 0 };
                        break;
                }
                ghost.preClosed = [];
            }
        }
    }
}


onkeydown = (evn) => {
    lastKey = evn.key;
    switch (lastKey) {
        case "ArrowUp":
            keys.up = true;
            break;
        case "ArrowDown":
            keys.down = true;
            break;
        case "ArrowRight":
            keys.right = true;
            break;
        case "ArrowLeft":
            keys.left = true;
            break;
        case "n":
            if (!start) {
                start = true;
                let loop = 1;
                scoreTag.innerText = loop;
                let interval = setInterval(() => {
                    loop++;
                    if (loop == 5) {
                        clearInterval(interval);
                        scoreTag.innerText = 'Score: ';
                        scoreTag.appendChild(scoreElement);
                        makeMap();
                        return animate();
                    }
                    scoreTag.innerText = loop;
                }, 1000)
            }
            break;
    }
}

onkeyup = (evn) => {
    lastKey = evn.key;
    switch (lastKey) {
        case "ArrowUp":
            keys.up = false;
            break;
        case "ArrowDown":
            keys.down = false;
            break;
        case "ArrowRight":
            keys.right = false;
            break;
        case "ArrowLeft":
            keys.left = false;
            break;
    }
}
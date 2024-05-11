class Camera {
    constructor() {
        this.type = "Camera";
        this.eye = new Vector3([0, 0.2, -12]);
        this.at = new Vector3([0, 0, 0]);
        this.up = new Vector3([0, 1, 0]);
        this.move = 0.8;
    }
    // FROM 3.6B video: 

    // Move the camera forward
    // d = at - eyes
    // d = normalize 
    // eye = eye + d 
    // at = at + d
    moveForward() {
        let d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        d.mul(this.move);
        this.eye.add(d);
        this.at.add(d);

        // Debug
        // console.log("FORWARDS");
    }

    getForward() {
        let d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        return d; 

        // Debug
        // console.log("FORWARDS");
    }

    // Move the camera backward

    // reverse now so it's backwards 
    moveBackwards() {
        let d = new Vector3();
        d.set(this.eye);
        d.sub(this.at);
        d.normalize();
        d.mul(this.move);
        this.at.add(d);
        this.eye.add(d);
        
    }

    // Move the camera left
    // d. normalize 
    // d = at - eye 
    // left = d cross up 
    moveLeft() {
        let d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        d.normalize();
        d.mul(this.move);
        let s = Vector3.cross(this.up, d);
        this.at.add(s);
        this.eye.add(s);
        
    }

    // Move the camera right
    // reverse because right
    moveRight() {
        let d = new Vector3();
        d.set(this.eye);
        d.sub(this.at);
        d.normalize();
        d.mul(this.move);
        let s = Vector3.cross(this.up, d);
        this.at.add(s);
        this.eye.add(s);
       
    }
    // 3.6c Videos 
    // Turn the camera left
    // TO DO: VERY WEIRD 
    // Edit: Got it 

    //  r = root(d[x]^2 + d[y]^2)
    //  theta = arctan(y,x)
    // theta = theta + 5 degrees 
    // (convert radians)
    // newX = r * cos(theta)
    // newY = r * sin(theta)
    // d = (newX, newY)

    // atan not working
    // "Math.atan2() is passed separate x and y arguments, 
    // while Math.atan() is passed the ratio of those two arguments. 
    // Math.atan2(y, x) differs from Math.atan(y / x) in the following cases"

    panLeft() {
        let d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        let radius = Math.sqrt(d.elements[0] * d.elements[0] + d.elements[2] * d.elements[2]);
        let theta = Math.atan2(d.elements[2], d.elements[0]);
       
        // convert to radians 
        theta -= (2 * Math.PI / 180);
        d.elements[0] = radius * Math.cos(theta);
        d.elements[2] = radius * Math.sin(theta);
        this.at.set(d);
        this.at.add(this.eye);
        
    }

    // Turn the camera right; the 
    panRight() {
        let d = new Vector3();
        d.set(this.at);
        d.sub(this.eye);
        let radius = Math.sqrt(d.elements[0] * d.elements[0] + d.elements[2] * d.elements[2]);
        let theta = Math.atan2(d.elements[2], d.elements[0]);

        // convert to radians 
        theta += (2 * Math.PI / 180);
        d.elements[0] = radius * Math.cos(theta);
        d.elements[2] = radius * Math.sin(theta);
        this.at.set(d);
        this.at.add(this.eye);
        
    }

    // Turn camera up
    turnUp() {
        this.at.elements[1] += 0.3;
        // console.log("LOOK UP");
    }

    // Turn camera down
    turnDown() {
        this.at.elements[1] -= 0.3;
    }
}

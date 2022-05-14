/*
TODO:
    - Add auxillary array to the animation
*/

import { swap } from "./Utils";

/**
 * @class   Animation
 * @see     Default animation event
 */
export class AnimationEvent {
    constructor(type, params) {
        this.type = type;
        this.array = params?.array;
        this.auxArray = params?.auxArray;
    }
};

/**
 * @class   Animation
 * @see     Any operation that involves accessing the array counts as an access animation.
 */
export class AccessEvent extends AnimationEvent {
    constructor(params) {
        super('access', params);
        this.index = params.index;
    }
}

/**
 * @class   Animation
 * @see     Any operation that involves swapping two elements counts as a swap animation.
 */
export class SwapEvent extends AnimationEvent {
    constructor(params) {
        super('swap', params);
        this.a = params.a;
        this.b = params.b;
    }
};

/**
 * @class   Animation
 * @see     Any operation that involves assigning a value to an element in the array counts as a assign animation.
 */
export class AssignEvent extends AnimationEvent {
    constructor(params) {
        super('assign', params);
        this.from = params.from;
        this.to = params.to;
        this.fromIsValue = params?.fromIsValue || false;
        this.toIsValue = params?.toIsValue || false;
    }
};

/**
 * @class   Animation
 * @see     Any operation that involves comparing at least one element in the array counts as a compare animation.
 */
export class ComparisonEvent extends AnimationEvent {
    constructor(params) {
        super('comparison', params);
        this.a = params.a;
        this.b = params.b;
        this.aIsValue = params?.aIsValue || false;
        this.bIsValue = params?.bIsValue || false;
    }
};

export class AnimationController {
    constructor(speed, setState, colors) {
        this.setState = setState;
        this.colors = colors;
        this.array = [];

        this.animationSpeed = speed;
        this.animationTimer = null;
        this.animationIndex = 0;
        this.animationSteps = [];

        this.isRunning = false;
        this.isPaused = false;
    }

    setSpeed(speed) {
        this.animationSpeed = speed;
    }
    
    animate(animations) {
        this.reset();
        this.animationSteps = animations;
        this.start();
    }

    resume() {
        this.isPaused = false;
        this.setState({isRunning: true});
        this.start();
    }

    pause() {
        this.isPaused = true;
        clearInterval(this.animationTimer);
        this.setState({isRunning: false});
    }

    start() {
        this.setState({isRunning: true});
        this.animationTimer = setInterval(() => {
            this.step();
        }, this.animationSpeed);
    }
    
    stop() {
        clearInterval(this.animationTimer);
        this.setState({isRunning: false});
    }
    
    step() {
        if (this.animationIndex < this.animationSteps.length) {
            let animation = this.animationSteps[this.animationIndex];

            this.resetColors();
            switch (animation.type) {
                case 'init-array':
                    this.array = animation.array;
                    break;
                case 'access':
                    break;
                case 'swap':
                    this.colors[animation.a] = this.colors[animation.b] = '#ff0000';
                    swap(this.array, animation.a, animation.b);
                    break;
                case 'assign':
                    this.colors[animation.to] = '#ff0000';
                    if ( !animation.fromIsValue ) this.colors[animation.from] = '#ff0000';
                    this.array[animation.to] = animation.fromIsValue ? animation.from : this.array[animation.from];
                    break;
                case 'comparison':
                    break;
                default:
                    break;
            }

            this.setState({array: this.array, colors: this.colors});
            this.animationIndex++;
        } else {
            this.setState({array: this.array, colors: this.colors});
            this.resetColors();
            this.stop();
        }
    }
    
    resetColors() {
        for (let i = 0; i < this.array.length; i++) {
            this.colors[i] = "white";
        }
    }

    reset() {
        this.animationIndex = 0;
        this.animationSteps = [];
    }
    
    addStep(step) {
        this.animationSteps.push(step);
    }

    addSteps(steps) {
        this.animationSteps.push(...steps);
    }

    sweepAnimation() {
        // TODO: Implement
        // go for each element in ascending order
        for (let i = 0; i < this.colors.length; i++) {
            this.colors[i] = "green";
        }
    }
};
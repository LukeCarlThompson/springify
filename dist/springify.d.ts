interface SpringifyProps {
    input?: number;
    /**
     * effective range from 0 - 100
     */
    stiffness?: number;
    /**
     * effective range from 0 - 100
     */
    damping?: number;
    /**
     * effective range from 0 - 100
     */
    mass?: number;
    onFrame: (output: number, velocity: number) => void;
    onFinished?: () => void;
}
export declare class Springify {
    private _input;
    set input(value: number);
    get input(): number;
    output: number;
    private stiffness;
    private damping;
    private mass;
    velocity: number;
    private amplitude;
    private animating;
    private onFrame;
    private onFinished;
    private lastTime;
    private currentTime;
    private delta;
    private animationFrame;
    private interpolate;
    private animate;
    private animLoop;
    constructor({ input, stiffness, damping, mass, onFrame, onFinished, }: SpringifyProps);
}
export {};

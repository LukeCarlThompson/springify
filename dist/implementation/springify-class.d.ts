import { EventName, SpringifyInterface, SpringifyProps, Subscriber, Unsubscribe } from '../springify';
export declare class Springify implements SpringifyInterface {
    #private;
    stiffness: number;
    damping: number;
    mass: number;
    constructor({ input, stiffness, damping, mass }?: SpringifyProps);
    set input(value: number);
    get input(): number;
    get output(): number;
    readonly subscribe: (subscriber: Subscriber, eventName?: EventName) => Unsubscribe;
}

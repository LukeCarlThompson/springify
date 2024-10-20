export type SpringifyProps = {
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
};
export type SpringifyInterface = {
    input: number;
    readonly output: number;
    stiffness: number;
    damping: number;
    mass: number;
    readonly subscribe: Subscribe;
};
export type Subscriber = (subscriberProps: SubscriberProps) => void;
type Subscribe = (subscriber: Subscriber, eventName?: EventName) => Unsubscribe;
export type Unsubscribe = () => void;
export type EventName = 'frame' | 'end';
export type SubscriberProps = {
    readonly output: number;
    readonly velocity: number;
};
export {};

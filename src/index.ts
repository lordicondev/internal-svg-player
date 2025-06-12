import svg from './modules/svg.js';

export type AnimationDirection = 1 | -1;

export type AnimationSegment = [number, number];

export type AnimationEventName = 'drawnFrame' | 'enterFrame' | 'loopComplete' | 'complete' | 'segmentStart' | 'destroy' | 'config_ready' | 'data_ready' | 'DOMLoaded' | 'error' | 'data_failed' | 'loaded_images';

export type AnimationEventCallback<T = any> = (args: T) => void;

export interface CompleteEvent {
    direction: number;
    type: "complete";
}

export interface CompleteLoopEvent {
    currentLoop: number;
    direction: number;
    totalLoops: number;
    type: "loopComplete";
}

export interface DestroyEvent {
    type: "destroy";
}

export interface EnterFrameEvent {
    /** The current time in frames. */
    currentTime: number;
    direction: number;
    /** The total number of frames. */
    totalTime: number;
    type: "enterFrame";
}

export interface SegmentStartEvent {
    firstFrame: number;
    totalFrames: number;
    type: "segmentStart";
}

export interface AnimationEvents {
    DOMLoaded: undefined;
    complete: CompleteEvent;
    config_ready: undefined;
    data_failed: undefined;
    data_ready: undefined;
    destroy: DestroyEvent;
    drawnFrame: EnterFrameEvent;
    enterFrame: EnterFrameEvent;
    error: undefined;
    loaded_images: undefined;
    loopComplete: CompleteLoopEvent;
    segmentStart: SegmentStartEvent;
}

export type AnimationConfig = {
    container: HTMLElement,
    loop?: boolean,
    autoplay?: boolean,
    rendererSettings?: any;
    initialSegment?: AnimationSegment;
    name?: string;
}

export type AnimationConfigWithData = AnimationConfig & {
    animationData: any;
}

export type AnimationConfigWithPath = AnimationConfig & {
    path: string;
}

export type AnimationItem = {
    name: string;
    isLoaded: boolean;
    currentFrame: number;
    currentRawFrame: number;
    firstFrame: number;
    totalFrames: number;
    frameRate: number;
    frameMult: number;
    playSpeed: number;
    playDirection: number;
    playCount: number;
    isPaused: boolean;
    autoplay: boolean;
    loop: boolean | number;
    renderer: any;
    animationID: string;
    assetsPath: string;
    timeCompleted: number;
    segmentPos: number;
    isSubframeEnabled: boolean;
    segments: AnimationSegment | AnimationSegment[];
    play(name?: string): void;
    stop(name?: string): void;
    togglePause(name?: string): void;
    destroy(name?: string): void;
    pause(name?: string): void;
    goToAndStop(value: number | string, isFrame?: boolean, name?: string): void;
    goToAndPlay(value: number | string, isFrame?: boolean, name?: string): void;
    includeLayers(data: any): void;
    setSegment(init: number, end: number): void;
    resetSegments(forceFlag: boolean): void;
    hide(): void;
    show(): void;
    resize(): void;
    setSpeed(speed: number): void;
    setDirection(direction: AnimationDirection): void;
    setLoop(isLooping: boolean): void;
    playSegments(segments: AnimationSegment | AnimationSegment[], forceFlag?: boolean): void;
    setSubframe(useSubFrames: boolean): void;
    getDuration(inFrames?: boolean): number;
    triggerEvent<T extends AnimationEventName>(name: T, args: AnimationEvents[T]): void;
    addEventListener<T extends AnimationEventName>(name: T, callback: AnimationEventCallback<AnimationEvents[T]>): () => void;
    removeEventListener<T extends AnimationEventName>(name: T, callback?: AnimationEventCallback<AnimationEvents[T]>): void;
}

function loadAnimation(params: AnimationConfigWithData | AnimationConfigWithPath): AnimationItem {
    return svg.loadAnimation({
        renderer: 'svg',
        ...params,
    }) as any;
}

const lottie = {
    loadAnimation,
};

export default lottie;

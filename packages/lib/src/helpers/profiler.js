// A helper class to optionally run console.time/console.timeEnd
export class Profiler {
    constructor(options) {
        this.enabled = options.enabled || false;
    }
    time(label) {
        this.enabled && console.time(label);
    }
    timeEnd(label) {
        this.enabled && console.timeEnd(label);
    }
}
//# sourceMappingURL=profiler.js.map
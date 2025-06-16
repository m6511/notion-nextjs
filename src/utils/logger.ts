export class Logger {
	private verbose: boolean;

	constructor(verbose: boolean = true) {
		this.verbose = verbose;
	}

	log(...args: any[]): void {
		if (this.verbose) {
			console.log(...args);
		}
	}

	info(...args: any[]): void {
		if (this.verbose) {
			console.info(...args);
		}
	}

	warn(...args: any[]): void {
		if (this.verbose) {
			console.warn(...args);
		}
	}

	error(...args: any[]): void {
		// Always show errors regardless of verbose setting
		console.error(...args);
	}

	setVerbose(verbose: boolean): void {
		this.verbose = verbose;
	}
}
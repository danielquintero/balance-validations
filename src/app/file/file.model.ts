// see https://stackoverflow.com/questions/35789498/new-typescript-1-8-4-build-error-build-property-result-does-not-exist-on-t

export interface FileReaderEventTarget extends EventTarget {
	result: string;
}

export interface FileReaderProgressEvent extends Event {
	target: FileReaderEventTarget;

	getMessage(): string;
}

export interface ReadFile extends File {
	contents: string; // we read as text thus makes sense to be just string
}

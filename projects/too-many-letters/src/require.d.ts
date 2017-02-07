declare function require(path: string): string;
declare namespace require {
    type RequireContext = (path: string) => string;
    function context(path: string, subdirs: boolean, regex: RegExp): RequireContext;
}
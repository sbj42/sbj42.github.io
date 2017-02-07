export interface WordConfig {
}

export interface Word {
    text: string;
}

export interface WorderatorConfig {
    type: string;
}

export interface Worderator {
    generate(config: WordConfig): Word;
}

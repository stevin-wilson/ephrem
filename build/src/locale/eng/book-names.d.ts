export interface BookName {
    readonly name: string;
    readonly abbreviations?: string[];
    /**
     * `orthodox_only` is used to indicate name and abbreviation that are exclusive to Orthodox Bibles.
     * For example, 1 Samuel is called 1 Kings or Kingdoms in Orthodox Bibles
     */
    readonly orthodox_only: boolean;
}

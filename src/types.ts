export enum TranslateTo {
  JSON = "JSON",
}

/**
 *  Name and value are both required.
 *  https://design-tokens.github.io/community-group/format/#name-and-value
 */
export type InputToken = {
  [name: string]: {
    $value: string;
  };
  //   value: string;
  //   type: string;
  //   description: string;
};

export type InputTokenTree = {};

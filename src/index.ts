type Token = Record<string, unknown>;

type TokenTree = { [key: string]: Token | TokenTree };
type ParsedTokenTree = Record<string, unknown>;
function parseTokenTree(
  tokenTree: TokenTree,
  opts: {
    resolveAliases?: boolean;
    publishMetadata?: boolean;
  }
): ParsedTokenTree;

function parseTokenTree(
  //@ts-ignore
  tokenTree: TokenTree,
  //@ts-ignore

  opts: {
    resolveAliases?: boolean;
    publishMetadata?: boolean;
  }
): ParsedTokenTree {
  return {};
}

const givenTokenTree = {
  colors: {
    primary: {
      $type: "color",
      $value: "#002233",
    },
    secondary: {
      $type: "color",
      $value: "#11A766",
    },
  },
  "derived colors": {
    basis: {
      $type: "color",
      $value: "{colors.primary}",
    },
  },
};
const withResolvedAliases = parseTokenTree(givenTokenTree, {
  resolveAliases: true,
});

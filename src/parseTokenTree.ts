// eslint-disable-next-line @typescript-eslint/no-var-requires
const traverse = require("traverse")
import get from "lodash/get"
type Token = Record<string, unknown>

type TokenTree = { [key: string]: Token | TokenTree }
type ParsedTokenTree = Record<string, unknown>

export function parseTokenTree(
  //@ts-ignore
  tokenTree: TokenTree,
  //@ts-ignore

  opts: {
    resolveAliases?: boolean
    publishMetadata?: boolean
  }
): ParsedTokenTree {
  // create new JSON structure
  //   const leaves = traverse(tokenTree).reduce(function (acc, x) {
  //     if (this.isLeaf) acc.push(x)
  //     return acc
  //   }, [])

  // const resolveAliases = {}
  const traversed = traverse(tokenTree).map(function (x: any) {
    // if (this.circular) this.remove()
    //@ts-ignore
    if (this.key === "$value" && x[0] === "{" && x[x.length - 1] === "}") {
      console.log("alias found", x)
      const path = x.slice(1, -1)
      const resolvedValue = get(tokenTree, path)["$value"]
      //@ts-ignore

      this.update(resolvedValue)
    }
    console.log(x)
  })
  console.log("traversed", traversed)
  return traversed
}

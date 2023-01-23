import traverse from "traverse"

import get from "lodash/get"

type Extensible = {
  $extensions?: Record<string, unknown>
}
type Describable = {
  $description?: string
}
type AliasToken = {
  $value: string
  $type: string
} & Extensible &
  Describable

type Token = {
  $value: string | number | unknown[] | Record<string, unknown> | boolean | null

  $type: string
} & Extensible &
  Describable

type ResolvedToken = Token & {
  $kind: string
  $name: string
}
type TokenTree = {
  [key: string]: TokenTree | Token
} & Describable

class ParsedTokenTree {
  [key: string]: TokenTree | Token
}

export function parseTokenTree(
  tokenTree: TokenTree,
  opts: {
    resolveAliases?: boolean
    publishMetadata?: boolean
  }
): ParsedTokenTree {
  const { publishMetadata, resolveAliases } = opts

  const isAnUnresolvedAliasToken = (token: Token): token is AliasToken => {
    if (typeof token["$value"] === "string") {
      const value: string = token["$value"]
      return value[0] === "{" && value[value.length - 1] === "}"
    }
    return false
  }

  const isJSObject = (
    something: unknown
  ): something is Record<string, unknown> => {
    return (
      typeof something === "object" &&
      something !== null &&
      !Array.isArray(something)
    )
  }

  const isToken = (something: unknown): something is Token => {
    if (isJSObject(something)) {
      if (
        Object.hasOwn(something, "$type") &&
        Object.hasOwn(something, "$value")
      ) {
        const partialMapAttempt = something as Partial<Token>
        return (
          typeof partialMapAttempt.$type === "string" &&
          typeof partialMapAttempt.$value !== undefined
        )
      }
      return false
    }
    return false
  }

  const isResolvedToken = (something: unknown): something is ResolvedToken => {
    if (
      isJSObject(something) &&
      typeof something["$kind"] === "string" &&
      typeof something["$name"] === "string" &&
      isToken(something)
    ) {
      return true
    }
    return false
  }
  const traversed: ParsedTokenTree = traverse(tokenTree).map(function (
    x: unknown
  ) {
    if (publishMetadata === true) {
      // generate $kind and $name

      if (this.isRoot === false && this.isLeaf === false) {
        if (!isToken(x)) {
          const makeName: string = (
            typeof this.parent?.node.$name === "string"
              ? `${this.parent.node.$name}.${this.key}`
              : this.key
          ) as string
          if (isJSObject(x)) {
            this.update({
              ...x,
              $kind: "group",
              $name: makeName,
            })
          }
        } else if (isToken(x)) {
          if (resolveAliases === true && isAnUnresolvedAliasToken(x)) {
            const makeName =
              typeof this.parent?.node.$name === "string"
                ? `${this.parent.node.$name}.${this.key}`
                : this.key

            const path: string = x.$value.slice(1, -1)
            const resolvedObj = get(tokenTree, path)
            const resolvedType = resolvedObj.$type
            const resolvedValue = resolvedObj.$value

            this.update({
              ...x,
              $kind: "token",
              $name: makeName,
              $value: {
                $kind: "alias",
                $name: path,
                $type: resolvedType,
                $value: resolvedValue,
              },
            })
          } else {
            if (!isResolvedToken(x)) {
              const makeName: string = (
                typeof this.parent?.node.$name === "string"
                  ? `${this.parent.node.$name}.${this.key}`
                  : this.key
              ) as string

              this.update({
                ...x,
                $kind: "token",
                $name: makeName,
              })
            }
          }
        }
      }
    } else if (
      publishMetadata === false ||
      (publishMetadata == null && resolveAliases === true)
    ) {
      if (isToken(x) && isAnUnresolvedAliasToken(x)) {
        const path: string = x.$value.slice(1, -1)
        const resolvedUnknown: unknown = get(tokenTree, path)
        if (isToken(resolvedUnknown)) {
          const resolvedValue = resolvedUnknown.$value

          this.update({
            ...x,
            $value: resolvedValue,
          })
        }
      }
    }
  })

  return traversed
}

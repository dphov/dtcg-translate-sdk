import { parseTokenTree } from "../parseTokenTree"

describe("parseTokenTree: DTCG to Parsed DTCG", () => {
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
  }
  test.each`
    input | inputOptions | expected | testName
    ${givenTokenTree} | ${{ resolveAliases: true }} | ${{
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
      $value: "#002233",
    },
  },
}} | ${"test with resolved aliases tree"}
    ${givenTokenTree} | ${{
  resolveAliases: true,
  publishMetadata: true,
}} | ${{
  colors: {
    $kind: "group",
    $name: "colors",
    primary: {
      $kind: "token",
      $name: "colors.primary",
      $type: "color",
      $value: "#002233",
    },
    secondary: {
      $kind: "token",
      $name: "colors.secondary",
      $type: "color",
      $value: "#11A766",
    },
  },
  "derived colors": {
    $kind: "group",
    $name: "derived colors",
    basis: {
      $kind: "token",
      $name: "derived colors.basis",
      $type: "color",
      $value: {
        $kind: "alias",
        $name: "colors.primary",
        $type: "color",
        $value: "#002233",
      },
    },
  },
}} | ${"test with publish metadata and resolved aliases"}
  `("$testName", ({ input, inputOptions, expected }) => {
    const actual = parseTokenTree(input, inputOptions)
    expect(actual).toStrictEqual(expected)
  })
})

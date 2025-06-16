import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      "**/.eslintrc*", // Prevents issues from linting of config files
      "**/.prettierrc*", // Prevents issues from linting of prettier config files
      "src/generated/prisma/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"], // Specifies the files ESLint should target
    rules: {
      "no-unused-vars": "off", // Or "off" if you genuinely don't care about unused vars in dev
      "@typescript-eslint/no-unused-vars": "off", // Same for TypeScript
      "@typescript-eslint/no-explicit-any": "off", // Disable the no-explicit-any rule
      "no-console": "off", // Keep console.log as a warning
      "react/no-unescaped-entities": "off", // Disable this rule, it is often annoying and depends on use case
      "@next/next/no-img-element": "off", // Disable warning about using <img> instead of next/image
    },
  },
];

export default eslintConfig;

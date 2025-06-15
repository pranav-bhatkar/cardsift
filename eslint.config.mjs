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
      "no-unused-vars": "warn", // Or "off" if you genuinely don't care about unused vars in dev
      "@typescript-eslint/no-unused-vars": "warn", // Same for TypeScript
      "no-console": "warn", // Keep console.log as a warning
      "react/no-unescaped-entities": "off", // Disable this rule, it is often annoying and depends on use case
    },
  },
];

export default eslintConfig;

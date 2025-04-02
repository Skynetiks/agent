import { writeFileSync } from "fs";
import { envSchema } from "../utils/env";
import { z } from "zod";

function generateEnvExample(
  schema: typeof envSchema,
  filePath = ".env.example"
) {
  const entries = Object.entries(schema.shape);

  const requiredFields: string[] = [];
  const optionalFields: string[] = [];

  entries.forEach(([key, value]) => {
    const type = value._def.typeName;
    const description = value.description ? `# ${value.description}` : "";

    let exampleValue = "";
    let comment = `${description}`;

    switch (type) {
      case "ZodEnum":
        exampleValue = (value as z.ZodEnum<any>).options[0]; // First enum value
        comment += `\n# Enum: ${JSON.stringify(
          (value as z.ZodEnum<any>).options
        )}`;
        break;
      case "ZodString":
        exampleValue = "";
        comment += "\n# String";
        break;
    }
    const isOptional = value.isOptional();

    const line = `${comment}\n${key}=${exampleValue}\n`;

    if (isOptional) {
      optionalFields.push(line);
    } else {
      requiredFields.push(line);
    }
  });

  const content = `
# ====================================================================
# Required Fields
# ====================================================================

# To generate this file, run the following command:
# npx ts-node src/scripts/generateTestEnv.ts

# To use this file, rename it to .env and fill in the required fields or run the following command:
# cp .env.example .env

${requiredFields.join("\n")}
# ====================================================================
# Optional
# ====================================================================

${optionalFields.join("\n")}`;

  writeFileSync(filePath, content);
  console.log(`✅ ${filePath} generated successfully`);
}

// Usage
generateEnvExample(envSchema);

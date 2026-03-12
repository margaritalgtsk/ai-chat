export const memoryCapturePrompt = (userInput: string) => `
Extract user facts that should be remembered for future conversations.

Examples of facts to extract:
- user name
- city
- country
- job
- favorite things
- preferences
- personal traits

If no fact exists, return null.
If a fact is found, return JSON.

JSON format:

{
  "key": "short_snake_case_identifier",
  "value": "fact value"
}

User message:
"${userInput}"
`;

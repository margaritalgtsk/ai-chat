export type ToolResult = {
  success: boolean;
  result?: string;
};

export type AgentTool = {
  name: string;
  description: string;
  execute: (query?: string) => ToolResult;
};

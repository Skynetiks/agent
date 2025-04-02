import { getAgentByIdWithSenderIdentities } from "../queries/agent";

export const cache__getAgentDetails = async (agentId: string) => {
  // TODO: Cache the agent details
  return await getAgentByIdWithSenderIdentities(agentId);
};

import { getAgentByIdWithSenderIdentities } from "../queries/agent";
import { AgentWithSenderIdentityDto } from "../types/agent";
import { Logger } from "./logger";
import { redis } from "./redis";

const ONE_DAY_IN_SECONDS = 86400;

export const cache__getAgentDetails = async (agentId: string) => {
  try {
    await redis.connect();
    const cached_key = `agent:${agentId}`;
    const cachedValue = await redis.get(cached_key);
    if (cachedValue) {
      return JSON.parse(cachedValue) as AgentWithSenderIdentityDto[];
    }

    const agents = await getAgentByIdWithSenderIdentities(agentId);

    if (!agents.length) {
      return [];
    }

    await redis.set(cached_key, JSON.stringify(agents), ONE_DAY_IN_SECONDS);
    return agents;
  } catch (error) {
    Logger.error(
      `Error fetching agent details for agent ID ${agentId}, error: ${error}`
    );
    return [];
  } finally {
    await redis.disconnect();
    Logger.info(`Disconnected from Redis`);
  }
};

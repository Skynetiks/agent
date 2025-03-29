import {
  SQSClient,
  SendMessageCommand,
  SendMessageCommandInput,
} from "@aws-sdk/client-sqs";
import { SQSRegion } from "../types";
import { env } from "./env";
import { Logger } from "./logger";

interface SQSConfig {
  region: SQSRegion;
  queueUrl: string;
}

export class SQSService<T> {
  private client: SQSClient;
  private queueUrl: string;

  constructor(config: SQSConfig) {
    this.client = new SQSClient({
      region: config.region,
      credentials: {
        accessKeyId: env.AWS_KEY,
        secretAccessKey: env.AWS_SECRET,
      },
    });
    this.queueUrl = config.queueUrl;
  }

  async sendMessage(messageBody: T, delaySeconds = 0): Promise<string> {
    const params: SendMessageCommandInput = {
      QueueUrl: this.queueUrl,
      MessageBody: JSON.stringify(messageBody),
      DelaySeconds: delaySeconds,
    };

    try {
      const { MessageId } = await this.client.send(
        new SendMessageCommand(params)
      );
      return MessageId || "";
    } catch (error) {
      Logger.error(`Error sending message: ${error}`, { message: messageBody });
      throw error;
    }
  }

  async sendBatchMessages(messages: T[], batchSize = 10): Promise<void> {
    const batches: T[][] = [];
    for (let i = 0; i < messages.length; i += batchSize) {
      const batch = messages.slice(i, i + batchSize);
      batches.push(batch);
    }

    for (const batch of batches) {
      await Promise.all(batch.map((msg) => this.sendMessage(msg)));
    }
  }
}

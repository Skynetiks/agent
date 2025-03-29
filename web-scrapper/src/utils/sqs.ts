import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
  SendMessageCommandInput,
  SendMessageCommand,
} from "@aws-sdk/client-sqs";
import { env } from "./env";
import { Logger } from "./logger";

/**
 * Custom error class to denote non-retriable errors.
 * Throw this error in your process callback if you want the message to be deleted,
 * even though processing failed.
 */
export class NonRetriableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NonRetriableError";
  }
}

type Options = {
  //   concurrencyLimit?: number;
  pollingInterval?: number;
};

export class SQSConsumer<T> {
  private sqsClient: SQSClient;
  private queueUrl: string;
  private pollingInterval: number;
  private processCallback: (message: Message, body: T) => Promise<void>;
  //   private concurrencyLimit: number;

  constructor(
    queueUrl: string,
    processCallback: (message: Message, body: T) => Promise<void>,
    { pollingInterval = 5000 }: Options = {}
  ) {
    this.sqsClient = new SQSClient({
      region: env.SQS_REGION,
      credentials: {
        accessKeyId: env.AWS_KEY,
        secretAccessKey: env.AWS_SECRET,
      },
    });
    this.queueUrl = queueUrl;
    this.pollingInterval = pollingInterval;
    this.processCallback = processCallback;
    // this.concurrencyLimit = concurrencyLimit;
  }

  private async pollMessages() {
    while (true) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 10,
          WaitTimeSeconds: 10,
          VisibilityTimeout: 30,
        });

        Logger.info("Polling for messages...");
        const response = await this.sqsClient.send(command);
        if (response.Messages?.length === 0) {
          console.log("No messages found. Waiting for next poll...");
        }

        if (response.Messages) {
          for (const message of response.Messages) {
            await this.processMessage(message);
          }
        }
      } catch (error) {
        Logger.error(`Error receiving messages: ${error}`);
      }

      await new Promise((resolve) => setTimeout(resolve, this.pollingInterval));
    }
  }

  private async isDuplicateMessage(
    messageId: string,
    retryCount: string
  ): Promise<boolean> {
    const dedupeKey = `${messageId}-${retryCount}`;
    // TODO: Dedupe logic
    return false;
  }

  private async processMessage(message: Message) {
    try {
      const messageId = message.MessageId!;
      const retryCount = message.Attributes?.ApproximateReceiveCount || "0";
      if (await this.isDuplicateMessage(messageId, retryCount)) {
        Logger.info(`Skipping duplicate message: ${message.MessageId}`);
        return;
      }

      Logger.info(
        `Processing Message ${message.MessageId} for retry count ${retryCount}`
      );

      if (!message.Body) {
        throw new NonRetriableError("Message body is empty");
      }

      const body = JSON.parse(message.Body) as T;

      await this.processCallback(message, body);
      await this.deleteMessage(message.ReceiptHandle!);
      console.log(`Message processed successfully: ${message.MessageId}`);
    } catch (error) {
      if (error instanceof NonRetriableError) {
        Logger.error(
          `Non-retriable error processing message: ${message.MessageId}`,
          error
        );
        // Delete the message even if processing failed, since we don't want to retry it.
        await this.deleteMessage(message.ReceiptHandle!);
      } else {
        Logger.error(
          `Retriable error processing message: ${message.MessageId} Error: ${error}`
        );
      }
    }
  }

  private async deleteMessage(receiptHandle: string) {
    try {
      await this.sqsClient.send(
        new DeleteMessageCommand({
          QueueUrl: this.queueUrl,
          ReceiptHandle: receiptHandle,
        })
      );
      Logger.info(
        `Message deleted successfully: ${receiptHandle.substring(0, 15)}...`
      );
    } catch (error) {
      Logger.info(`Error deleting message: ${error}`);
    }
  }

  public start() {
    Logger.info("Starting SQS consumer...");
    this.pollMessages();
  }
}

interface SQSPublisherOptions {
  region: string;
  queueUrl: string;
}

export class SQSPublisher<T> {
  private client: SQSClient;
  private queueUrl: string;

  constructor(config: SQSPublisherOptions) {
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

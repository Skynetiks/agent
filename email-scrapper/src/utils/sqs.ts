import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  Message,
} from "@aws-sdk/client-sqs";
import { env } from "./env";
import pLimit from "p-limit";

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
  concurrencyLimit?: number;
  pollingInterval?: number;
};

export class SQSConsumer<T> {
  private sqsClient: SQSClient;
  private queueUrl: string;
  private pollingInterval: number;
  private processCallback: (message: Message, body: T) => Promise<void>;
  private concurrencyLimit: number;

  constructor(
    queueUrl: string,
    processCallback: (message: Message, body: T) => Promise<void>,
    { concurrencyLimit = 10, pollingInterval = 5000 }: Options = {}
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
    this.concurrencyLimit = concurrencyLimit;
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

        console.log("Polling for messages...");
        const response = await this.sqsClient.send(command);
        if (response.Messages?.length === 0) {
          console.log("No messages found. Waiting for next poll...");
        }

        if (response.Messages) {
          const limit = pLimit(this.concurrencyLimit);

          const tasks = response.Messages.map((message) =>
            limit(() =>
              this.processMessage(message).catch((err) => {
                console.error(`Error receiving messages:`, err);
              })
            )
          );

          await Promise.all(tasks);
        }
      } catch (error) {
        console.error("Error receiving messages:", error);
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
        console.log(`Skipping duplicate message: ${message.MessageId}`);
        return;
      }

      console.log(
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
        console.error(
          `Non-retriable error processing message: ${message.MessageId}`,
          error
        );
        // Delete the message even if processing failed, since we don't want to retry it.
        await this.deleteMessage(message.ReceiptHandle!);
      } else {
        console.error(
          `Retriable error processing message: ${message.MessageId}`,
          error
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
      console.log(
        `Message deleted successfully: ${receiptHandle.substring(0, 15)}...`
      );
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  }

  public start() {
    console.log("Starting SQS consumer...");
    this.pollMessages();
  }
}

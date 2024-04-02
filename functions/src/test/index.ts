import { Handler, SQSEvent } from 'aws-lambda';

const { NODE_ENV } = process.env;
export const handler: Handler = async (event: SQSEvent): Promise<void> => {
  let payload;
  try {
    payload = JSON.parse(event.Records[0].body) || null;
  } catch (e) {
    console.error(e);
    throw new Error('event cannot be parsed');
  }

  console.log('NODE_ENV', NODE_ENV);
  console.log('payload', payload);
};

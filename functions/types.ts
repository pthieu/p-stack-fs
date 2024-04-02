// XXX(Phong): types that are specific only to lambda, because it requires
// external packages
import { APIGatewayProxyEventMultiValueHeaders } from 'aws-lambda';

export interface ApiResponse {
  statusCode: number;
  body?: string;
  multiValueHeaders?: APIGatewayProxyEventMultiValueHeaders;
}

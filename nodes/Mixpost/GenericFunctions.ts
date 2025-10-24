import type { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import axios from 'axios';
import FormData from 'form-data';
import type {
	IDataObject,
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export async function mixpostApiRequest(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any> {
	const credentials = await this.getCredentials('mixpostApi');

	const baseUrl = credentials.baseUrl as string;
	const apiPath = (credentials.apiPath as string) || '/api/mixpost';
	const token = credentials.accessToken as string;

	const url = `${baseUrl}${apiPath}${endpoint}`;

	const options: AxiosRequestConfig = {
		method,
		url,
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		params: qs,
		data: body,
	};

	try {
		const response: AxiosResponse = await axios(options);
		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;

		if (axiosError.response) {
			const status = axiosError.response.status;
			const data: any = axiosError.response.data;

			let message = `Mixpost API Error (${status}): `;

			switch (status) {
				case 401:
					message += 'Invalid or expired access token. Please check your credentials.';
					break;
				case 422:
					message += 'Validation failed: ' + JSON.stringify(data.errors || data.message);
					break;
				case 429:
					message +=
						`Rate limit exceeded. ${data.retry_after ? `Retry after ${data.retry_after} seconds.` : ''}`;
					break;
				case 404:
					message += 'Resource not found. Verify the ID is correct.';
					break;
				default:
					message += data.message || axiosError.message;
			}

			throw new NodeApiError(this.getNode(), {
				message,
				description: data.errors ? JSON.stringify(data.errors, null, 2) : undefined,
			} as JsonObject);
		}

		throw new NodeApiError(this.getNode(), {
			message: `Network error: ${axiosError.message}`,
		} as JsonObject);
	}
}

export async function mixpostApiRequestAllItems(
	this: IExecuteFunctions | ILoadOptionsFunctions,
	method: string,
	endpoint: string,
	body: IDataObject = {},
	qs: IDataObject = {},
): Promise<any[]> {
	const returnData: any[] = [];
	let page = 1;
	let hasMore = true;

	while (hasMore) {
		const response = await mixpostApiRequest.call(this, method, endpoint, body, {
			...qs,
			page,
			per_page: 50,
		});

		if (response.data) {
			returnData.push(...response.data);
		}

		if (response.meta && response.meta.current_page >= response.meta.last_page) {
			hasMore = false;
		} else {
			page++;
		}
	}

	return returnData;
}

export async function uploadMedia(
	this: IExecuteFunctions,
	binaryPropertyName: string,
	itemIndex: number,
): Promise<any> {
	const binaryData = this.helpers.assertBinaryData(itemIndex, binaryPropertyName);
	const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);

	const formData = new FormData();
	formData.append('file', buffer, binaryData.fileName || 'file');

	const credentials = await this.getCredentials('mixpostApi');
	const baseUrl = credentials.baseUrl as string;
	const apiPath = (credentials.apiPath as string) || '/api/mixpost';
	const token = credentials.accessToken as string;

	try {
		const response = await axios.post(`${baseUrl}${apiPath}/media/upload`, formData, {
			headers: {
				Authorization: `Bearer ${token}`,
				...formData.getHeaders(),
			},
		});

		return response.data;
	} catch (error) {
		const axiosError = error as AxiosError;
		throw new NodeApiError(this.getNode(), {
			message: `Media upload failed: ${axiosError.message}`,
		} as JsonObject);
	}
}

export async function validateConnection(
	this: IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions,
): Promise<boolean> {
	try {
		await mixpostApiRequest.call(this, 'GET', '/accounts');
		return true;
	} catch (error) {
		return false;
	}
}

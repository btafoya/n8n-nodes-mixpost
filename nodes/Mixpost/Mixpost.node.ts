import type {
	IDataObject,
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

import { mixpostApiRequest, mixpostApiRequestAllItems, uploadMedia } from './GenericFunctions';

import { accountFields, accountOperations } from './descriptions/AccountDescription';
import { mediaFields, mediaOperations } from './descriptions/MediaDescription';
import { postFields, postOperations } from './descriptions/PostDescription';

export class Mixpost implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Mixpost',
		name: 'mixpost',
		icon: 'file:mixpost.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with Mixpost API for social media management',
		defaults: {
			name: 'Mixpost',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'mixpostApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Account',
						value: 'accounts',
					},
					{
						name: 'Media',
						value: 'media',
					},
					{
						name: 'Post',
						value: 'posts',
					},
				],
				default: 'posts',
			},
			...postOperations,
			...postFields,
			...mediaOperations,
			...mediaFields,
			...accountOperations,
			...accountFields,
		],
	};

	methods = {
		loadOptions: {
			async getAccounts(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const accounts = await mixpostApiRequest.call(this, 'GET', '/accounts');

				if (!accounts.data || !Array.isArray(accounts.data)) {
					return [];
				}

				return accounts.data.map((account: any) => ({
					name: `${account.name} (${account.platform})`,
					value: account.id,
				}));
			},

			async getMedia(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				const media = await mixpostApiRequest.call(this, 'GET', '/media');

				if (!media.data || !Array.isArray(media.data)) {
					return [];
				}

				return media.data.map((item: any) => ({
					name: item.name,
					value: item.id,
				}));
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const resource = this.getNodeParameter('resource', 0);
		const operation = this.getNodeParameter('operation', 0);

		// Posts Resource
		if (resource === 'posts') {
			if (operation === 'create') {
				for (let i = 0; i < items.length; i++) {
					const content = this.getNodeParameter('content', i) as string;
					const accounts = this.getNodeParameter('accounts', i) as number[];
					const additionalFields = this.getNodeParameter('additionalFields', i);

					const body: IDataObject = {
						content,
						accounts,
						status: additionalFields.status || 'draft',
					};

					if (additionalFields.media) {
						body.media = additionalFields.media as number[];
					}

					if (additionalFields.scheduled_at) {
						body.scheduled_at = additionalFields.scheduled_at as string;
					}

					const response = await mixpostApiRequest.call(this, 'POST', '/posts', body);
					returnData.push({ json: response });
				}
			} else if (operation === 'list') {
				for (let i = 0; i < items.length; i++) {
					const returnAll = this.getNodeParameter('returnAll', i);
					const filters = this.getNodeParameter('filters', i, {});

					const qs: IDataObject = {};

					if (filters.status) {
						qs.status = filters.status;
					}

					if (filters.account_id) {
						qs.account_id = filters.account_id;
					}

					if (returnAll) {
						const posts = await mixpostApiRequestAllItems.call(
							this,
							'GET',
							'/posts',
							{},
							qs,
						);
						posts.forEach((post) => returnData.push({ json: post }));
					} else {
						const limit = this.getNodeParameter('limit', i);
						qs.per_page = limit;
						const response = await mixpostApiRequest.call(this, 'GET', '/posts', {}, qs);
						const posts = response.data || [];
						posts.forEach((post: any) => returnData.push({ json: post }));
					}
				}
			} else if (operation === 'get') {
				for (let i = 0; i < items.length; i++) {
					const postId = this.getNodeParameter('postId', i) as number;
					const response = await mixpostApiRequest.call(this, 'GET', `/posts/${postId}`);
					returnData.push({ json: response });
				}
			} else if (operation === 'update') {
				for (let i = 0; i < items.length; i++) {
					const postId = this.getNodeParameter('postId', i) as number;
					const updateFields = this.getNodeParameter('updateFields', i);

					const body: IDataObject = {};

					if (updateFields.content) {
						body.content = updateFields.content as string;
					}

					if (updateFields.accounts) {
						body.accounts = updateFields.accounts as number[];
					}

					if (updateFields.media) {
						body.media = updateFields.media as number[];
					}

					if (updateFields.scheduled_at) {
						body.scheduled_at = updateFields.scheduled_at as string;
					}

					if (updateFields.status) {
						body.status = updateFields.status as string;
					}

					const response = await mixpostApiRequest.call(
						this,
						'PUT',
						`/posts/${postId}`,
						body,
					);
					returnData.push({ json: response });
				}
			} else if (operation === 'delete') {
				for (let i = 0; i < items.length; i++) {
					const postId = this.getNodeParameter('postId', i) as number;
					await mixpostApiRequest.call(this, 'DELETE', `/posts/${postId}`);
					returnData.push({
						json: { success: true, id: postId },
					});
				}
			} else if (operation === 'publish') {
				for (let i = 0; i < items.length; i++) {
					const postId = this.getNodeParameter('postId', i) as number;
					const response = await mixpostApiRequest.call(
						this,
						'POST',
						`/posts/${postId}/publish`,
					);
					returnData.push({ json: response });
				}
			}
		}

		// Media Resource
		if (resource === 'media') {
			if (operation === 'upload') {
				for (let i = 0; i < items.length; i++) {
					const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i);
					const response = await uploadMedia.call(this, binaryPropertyName, i);
					returnData.push({ json: response });
				}
			} else if (operation === 'downloadUrl') {
				for (let i = 0; i < items.length; i++) {
					const url = this.getNodeParameter('url', i) as string;
					const response = await mixpostApiRequest.call(this, 'POST', '/media/download', {
						url,
					});
					returnData.push({ json: response });
				}
			} else if (operation === 'list') {
				for (let i = 0; i < items.length; i++) {
					const returnAll = this.getNodeParameter('returnAll', i);

					if (returnAll) {
						const media = await mixpostApiRequestAllItems.call(this, 'GET', '/media');
						media.forEach((item) => returnData.push({ json: item }));
					} else {
						const limit = this.getNodeParameter('limit', i);
						const response = await mixpostApiRequest.call(this, 'GET', '/media', {}, {
							per_page: limit,
						});
						const media = response.data || [];
						media.forEach((item: any) => returnData.push({ json: item }));
					}
				}
			}
		}

		// Accounts Resource
		if (resource === 'accounts') {
			if (operation === 'list') {
				const response = await mixpostApiRequest.call(this, 'GET', '/accounts');
				const accounts = response.data || [];
				accounts.forEach((account: any) => returnData.push({ json: account }));
			}
		}

		return [returnData];
	}
}

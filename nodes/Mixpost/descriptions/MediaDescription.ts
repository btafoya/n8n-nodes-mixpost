import type { INodeProperties } from 'n8n-workflow';

export const mediaOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['media'],
			},
		},
		options: [
			{
				name: 'Download from URL',
				value: 'downloadUrl',
				description: 'Download media from URL',
				action: 'Download media from URL',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all media',
				action: 'List all media',
			},
			{
				name: 'Upload',
				value: 'upload',
				description: 'Upload media file',
				action: 'Upload media',
			},
		],
		default: 'upload',
	},
];

export const mediaFields: INodeProperties[] = [
	// ----------------------------------
	//         media:upload
	// ----------------------------------
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['upload'],
			},
		},
		description: 'Name of the binary property containing the file to upload',
	},

	// ----------------------------------
	//         media:downloadUrl
	// ----------------------------------
	{
		displayName: 'URL',
		name: 'url',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['downloadUrl'],
			},
		},
		default: '',
		required: true,
		description: 'URL of the media file to download',
	},

	// ----------------------------------
	//         media:list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['list'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['media'],
				operation: ['list'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
];

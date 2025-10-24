import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['accounts'],
			},
		},
		options: [
			{
				name: 'List',
				value: 'list',
				description: 'List all connected social accounts',
				action: 'List all accounts',
			},
		],
		default: 'list',
	},
];

export const accountFields: INodeProperties[] = [];

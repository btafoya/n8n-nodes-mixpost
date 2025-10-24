import type { INodeProperties } from 'n8n-workflow';

export const postOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['posts'],
			},
		},
		options: [
			{
				name: 'Create',
				value: 'create',
				description: 'Create a new post',
				action: 'Create a post',
			},
			{
				name: 'Delete',
				value: 'delete',
				description: 'Delete a post',
				action: 'Delete a post',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a post',
				action: 'Get a post',
			},
			{
				name: 'List',
				value: 'list',
				description: 'List all posts',
				action: 'List all posts',
			},
			{
				name: 'Publish',
				value: 'publish',
				description: 'Publish a post immediately',
				action: 'Publish a post',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a post',
				action: 'Update a post',
			},
		],
		default: 'create',
	},
];

export const postFields: INodeProperties[] = [
	// ----------------------------------
	//         posts:create
	// ----------------------------------
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['create'],
			},
		},
		default: '',
		required: true,
		description: 'The content of the post',
	},
	{
		displayName: 'Account Names or IDs',
		name: 'accounts',
		type: 'multiOptions',
		typeOptions: {
			loadOptionsMethod: 'getAccounts',
		},
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['create'],
			},
		},
		default: [],
		required: true,
		description:
			'Social media accounts to post to. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['create'],
			},
		},
		options: [
			{
				displayName: 'Media Names or IDs',
				name: 'media',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getMedia',
				},
				default: [],
				description:
					'Media files to attach to the post. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Schedule',
				name: 'scheduled_at',
				type: 'dateTime',
				default: '',
				description: 'When to publish the post (leave empty for draft)',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
				],
				default: 'draft',
				description: 'Post status',
			},
		],
	},

	// ----------------------------------
	//         posts:list
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['posts'],
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
				resource: ['posts'],
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
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['list'],
			},
		},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Failed',
						value: 'failed',
					},
					{
						name: 'Published',
						value: 'published',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
				],
				default: '',
				description: 'Filter by post status',
			},
			{
				displayName: 'Account Name or ID',
				name: 'account_id',
				type: 'options',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				default: '',
				description:
					'Filter by social account. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
		],
	},

	// ----------------------------------
	//         posts:get
	// ----------------------------------
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['get'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the post to retrieve',
	},

	// ----------------------------------
	//         posts:update
	// ----------------------------------
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['update'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the post to update',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['update'],
			},
		},
		options: [
			{
				displayName: 'Content',
				name: 'content',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				description: 'Updated post content',
			},
			{
				displayName: 'Account Names or IDs',
				name: 'accounts',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getAccounts',
				},
				default: [],
				description:
					'Updated social media accounts. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Media Names or IDs',
				name: 'media',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getMedia',
				},
				default: [],
				description:
					'Updated media attachments. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
			},
			{
				displayName: 'Schedule',
				name: 'scheduled_at',
				type: 'dateTime',
				default: '',
				description: 'Updated publish time',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{
						name: 'Draft',
						value: 'draft',
					},
					{
						name: 'Scheduled',
						value: 'scheduled',
					},
				],
				default: 'draft',
				description: 'Updated post status',
			},
		],
	},

	// ----------------------------------
	//         posts:delete
	// ----------------------------------
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['delete'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the post to delete',
	},

	// ----------------------------------
	//         posts:publish
	// ----------------------------------
	{
		displayName: 'Post ID',
		name: 'postId',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['posts'],
				operation: ['publish'],
			},
		},
		default: 0,
		required: true,
		description: 'ID of the post to publish immediately',
	},
];

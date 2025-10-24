import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class MixpostApi implements ICredentialType {
	name = 'mixpostApi';
	displayName = 'Mixpost API';
	documentationUrl = 'https://github.com/btafoya/mixpost-api';
	properties: INodeProperties[] = [
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://your-mixpost-instance.com',
			description: 'The base URL of your Mixpost installation',
			required: true,
		},
		{
			displayName: 'API Path',
			name: 'apiPath',
			type: 'string',
			default: '/api/mixpost',
			description: 'API endpoint path (leave default unless using custom installation)',
		},
		{
			displayName: 'Access Token',
			name: 'accessToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'Personal access token from Mixpost (Settings → API Tokens)',
			required: true,
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '={{"Bearer " + $credentials.accessToken}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl}}{{$credentials.apiPath}}',
			url: '/accounts',
			method: 'GET',
		},
	};
}

// Core Types
export interface MixpostCredentials {
	baseUrl: string;
	apiPath?: string;
	accessToken: string;
}

export interface Post {
	id: number;
	content: string;
	status: 'draft' | 'scheduled' | 'published' | 'failed';
	scheduled_at?: string;
	published_at?: string;
	accounts: Account[];
	media: Media[];
	tags: Tag[];
	versions?: PostVersion[];
	created_at: string;
	updated_at: string;
}

export interface PostVersion {
	id: number;
	account_id: number;
	content: string;
	media: Media[];
}

export interface Media {
	id: number;
	name: string;
	mime_type: string;
	size: number;
	url: string;
	created_at: string;
}

export interface Account {
	id: number;
	name: string;
	platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin' | 'mastodon';
	username: string;
	image: string;
}

export interface Tag {
	id: number;
	name: string;
	hex_color: string;
}

export interface PaginationMeta {
	current_page: number;
	last_page: number;
	per_page: number;
	total: number;
}

export interface ApiResponse<T> {
	data: T;
	meta?: PaginationMeta;
}

// Operation Types
export type PostOperation =
	| 'create'
	| 'list'
	| 'get'
	| 'update'
	| 'delete'
	| 'publish';

export type MediaOperation = 'upload' | 'downloadUrl' | 'list';

export type AccountOperation = 'list';

export type ResourceType = 'posts' | 'media' | 'accounts';

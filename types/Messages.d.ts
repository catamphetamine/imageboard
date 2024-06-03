import { Messages as SocialComponentsMessages } from 'social-components';

export interface Messages extends SocialComponentsMessages {
	comment?: {
		default?: string;
		deleted?: string;
		external?: string;
	};
	thread?: {
		default?: string;
	};
}

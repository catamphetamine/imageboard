// `SocialAttachment`.
// An `Attachment` could be either a `ResourceAttachment` or a `SocialAttachment`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Attachment.md

import {
  Picture
} from './ContentType.d.js';

import {
  ResourceAttachment
} from './ResourceAttachment.d.js';

export interface SocialAuthor {
  id: string;
  name?: string;
  url?: string;
  picture?: Picture;
}

export interface Social {
  provider: 'twitter' | 'instagram';
  id: string;
  url?: string;
  date?: Date;
  author?: SocialAuthor;
  content?: string;
  attachments?: ResourceAttachment[];
}

export interface SocialAttachment {
	type: 'social';
	social: Social;
}
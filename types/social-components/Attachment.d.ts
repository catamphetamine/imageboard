// `Attachment`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Attachment.md

import {
  ResourceAttachment
} from './ResourceAttachment.d.js';

import {
  SocialAttachment
} from './SocialAttachment.d.js';

export type Attachment =
	ResourceAttachment |
	SocialAttachment;
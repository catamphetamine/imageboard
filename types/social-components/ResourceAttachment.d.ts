// `ResourceAttachment`.
// An `Attachment` could be either a `ResourceAttachment` or a `SocialAttachment`.
// https://github.com/catamphetamine/social-components/blob/master/docs/Attachment.md

import {
  Picture,
  Video,
  Audio,
  File
} from './ContentType.d.js';

export interface PictureAttachment {
  type: 'picture';
  spoiler?: boolean;
  picture: Picture;
}

export interface VideoAttachment {
  type: 'video';
  spoiler?: boolean;
  video: Video;
}

export interface AudioAttachment {
  type: 'audio';
  audio: Audio;
}

export interface FileAttachment {
  type: 'file';
  file: File;
}

export type ResourceAttachment =
  PictureAttachment |
  VideoAttachment |
  AudioAttachment |
  FileAttachment;
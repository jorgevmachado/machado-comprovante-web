import type {
  ChangeEvent ,
  DragEvent ,
  PropsWithChildren ,
  ReactNode,
  KeyboardEvent ,
} from 'react';

export type FileUploadErrorCode =
  | 'INVALID_TYPE'
  | 'FILE_TOO_LARGE'
  | 'MAX_FILES_EXCEEDED';

export type FileUploadError = {
  code: FileUploadErrorCode;
  message: string;
};

export type UploadedFile = {
  file: File;
  error?: FileUploadError;
};

export type FileUploadProps = {
  value?: File[];
  accept?: string[];
  onError?: (error: FileUploadError, file: File) => void;
  maxSize?: number;
  maxFiles?: number;
  multiple?: boolean;
  disabled?: boolean;
  children?: ReactNode;
  onFilesChange?: (files: File[]) => void;
};

export type FileUploadDropzoneProps = PropsWithChildren<{
  disabled?: boolean;
  isDragActive: boolean;
  onClick: () => void;
  onDragEnter: (event: DragEvent<HTMLDivElement>) => void;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
}>;

export type FileUploadInputProps = {
  accept?: string[];
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  multiple?: boolean;
  disabled?: boolean;
};

export type FileUploadFileProps = {
  file: File;
  error?: FileUploadError;
  disabled?: boolean;
  onRemove: (file: File) => void;
};
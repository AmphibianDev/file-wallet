import { useCallback } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import classNames from 'classnames';

import useInfoPopupStore from './InfoPopup.store';

import DropZoneCSS from './DropZone.module.css';

type Props = {
  file: FileData | null;
  onChange: (file: FileData | null) => void;
};

const DropZone = ({ file, onChange }: Props) => {
  const { openPopup } = useInfoPopupStore();

  const onDrop = useCallback(
    <T extends File>(files: T[]) => {
      const [file] = files;
      if (!file) return;

      const reader = new FileReader();
      reader.onabort = () =>
        openPopup('file reading was aborted', 'error', 2000);
      reader.onerror = () =>
        openPopup('file reading was failed', 'error', 2000);
      reader.onload = () => {
        const result = reader.result?.toString();
        if (result) onChange({ name: file.name, dataUrl: result });
      };
      reader.readAsDataURL(file);
    },
    [openPopup, onChange]
  );

  const onDropRejected = (fileRejections: FileRejection[]) => {
    const getErrorMessage = (errors: FileRejection['errors']) => {
      const messages: string[] = [];

      errors.forEach(error => {
        switch (error.code) {
          case 'file-too-large':
            messages.push('File was over 500mb');
            break;
          case 'file-too-small':
            messages.push('File was under 50kb');
            break;
          case 'file-invalid-type':
            messages.push('File type was not supported');
            break;
          case 'too-many-files':
            messages.push('Only one file allowed');
            break;
          default:
            messages.push('Unknown error');
        }
      });

      return messages.join(' and ');
    };

    if (fileRejections[0])
      openPopup(getErrorMessage(fileRejections[0].errors), 'error', 2000);
  };

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      onDropRejected,
      multiple: false,
      maxSize: 5e8,
      minSize: 5e4,
    });

  const dropzoneClasses = classNames({
    [DropZoneCSS.container || '']: true,
    [DropZoneCSS.accept || '']: isDragAccept,
    [DropZoneCSS.reject || '']: isDragReject,
  });

  return (
    <button {...getRootProps()} className={dropzoneClasses} role="button">
      {file === null ? (
        <span>
          Drop&nbsp;file&nbsp;here&nbsp;or
          <wbr />
          click&nbsp;to&nbsp;upload
        </span>
      ) : (
        <div
          style={{
            backgroundImage: `url(${file.dataUrl})`,
          }}
          data-label={file.name}
          className={DropZoneCSS.thumb}
        />
      )}
      <input {...getInputProps()} />
    </button>
  );
};

export default DropZone;

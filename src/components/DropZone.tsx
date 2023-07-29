import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';

import useInfoPopupStore from './InfoPopup.store';

import DropZoneCSS from './DropZone.module.css';

const DropZone = () => {
  const { openPopup } = useInfoPopupStore();

  const [file, setFile] = useState<{ url: string; name: string } | null>(null);

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
        if (result) setFile({ name: file.name, url: result });
      };
      reader.readAsDataURL(file);
    },
    [openPopup]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      onDrop,
      multiple: false,
      maxSize: 5e8,
    });

  const dropzoneClasses = classNames({
    [DropZoneCSS.container || '']: true,
    [DropZoneCSS.accept || '']: isDragAccept,
    [DropZoneCSS.reject || '']: isDragReject,
  });

  return (
    <button {...getRootProps()} className={dropzoneClasses}>
      {file === null ? (
        <span>
          Drop&nbsp;file&nbsp;here&nbsp;or
          <wbr />
          click&nbsp;to&nbsp;upload
        </span>
      ) : (
        <div
          style={{
            backgroundImage: `url(${file.url})`,
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

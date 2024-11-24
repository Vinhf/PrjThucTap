import React, { useEffect, useRef, ReactNode } from 'react';

interface UploadWidgetProps {
  children: (params: { open: () => void }) => ReactNode;
  onUpload: (error: any, result: any, widget: any) => void;
}

const UploadWidget: React.FC<UploadWidgetProps> = ({ children, onUpload }) => {
  const widget = useRef<any>();

  useEffect(() => {
    const cloudinary = window.cloudinary;

    if (!cloudinary) {
      console.error("Cloudinary library is not loaded.");
      return;
    }

    function onIdle() {
      if (!widget.current) {
        widget.current = createWidget();
      }
    }

    // Use requestIdleCallback or setTimeout to initialize the widget
    'requestIdleCallback' in window ? requestIdleCallback(onIdle) : setTimeout(onIdle, 1);

    return () => {
      widget.current?.destroy();
      widget.current = undefined;
    };
  }, []);

  function createWidget() {
    const cloudName = 'dtnh9gtir';
    const uploadPreset = 'ftar1x0d';

    if (!cloudName || !uploadPreset) {
      console.warn("Cloudinary configuration is missing.");
      return;
    }

    const options = {
      cloudName,
      uploadPreset,
    };

    return window.cloudinary.createUploadWidget(options, (error: any, result: any) => {
      if (error) {
        console.error("Upload error:", error);
      }
      if (result.event === 'success') {
        onUpload(null, result, widget.current);
      }
    });
  }

  function open() {
    if (!widget.current) {
      widget.current = createWidget();
    }
    widget.current && widget.current.open();
  }

  return (
    <>
      {children({ open })}
    </>
  );
};

export default UploadWidget;

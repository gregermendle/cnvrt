import {
  ChangeEventHandler,
  DragEventHandler,
  ReactNode,
  useRef,
  useState,
} from "react";

export type DragAndDropProps = {
  children: (options: {
    dragging: boolean;
    files: File[];
    openFileViewer: () => void;
  }) => ReactNode;
  allowedTypes?: Array<string>;
};

export default function DragAndDrop({
  children,
  allowedTypes,
}: DragAndDropProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Record<string, File>>({});

  const handleDrag: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragging(true);
    } else if (e.type === "dragleave") {
      setDragging(false);
    }
  };

  const handleDrop: DragEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    let filesByName: Record<string, File> = {};
    for (let i = 0; i < files.length; i++) {
      const item = files.item(i);
      if (
        item !== null &&
        (!allowedTypes || allowedTypes.includes(item.type.split("/")?.[0]))
      ) {
        filesByName[item.name] = item;
      }
    }
    setFiles((prev) => ({ ...prev, ...filesByName }));
  };

  const openFileViewer = () => {
    fileInput.current!.click();
  };

  return (
    <div
      className="relative"
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={fileInput}
        type="file"
        multiple
        className="hidden"
        onChange={handleFileInputChange}
      />
      {children({ dragging, files: Object.values(files), openFileViewer })}
    </div>
  );
}

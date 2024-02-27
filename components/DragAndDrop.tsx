import {
  ChangeEventHandler,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type DragAndDropProps = {
  multiple?: boolean;
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
  multiple,
}: DragAndDropProps) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<Record<string, File>>({});

  const handleFileInputChange: ChangeEventHandler<HTMLInputElement> =
    useCallback((e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleFiles(e.target.files);
      }
    }, []);

  const handleFiles = useCallback(
    (files: FileList) => {
      if (!multiple) {
        const first = files.item(0)!;
        return setFiles({ [first.name]: first });
      }

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
    },
    [allowedTypes, multiple]
  );

  const openFileViewer = useCallback(() => {
    fileInput.current!.click();
  }, [fileInput]);

  useEffect(() => {
    const handleDrag = (e: DragEvent) => {
      e.preventDefault();
      if (e.type === "dragenter") {
        e.stopPropagation();
        setDragging(true);
      } else if (
        e.type === "dragleave" &&
        e.target instanceof HTMLElement &&
        e.target.classList.contains("drop-zone")
      ) {
        setDragging(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragging(false);
      if (
        e.dataTransfer &&
        e.dataTransfer.files &&
        e.dataTransfer.files.length > 0
      ) {
        handleFiles(e.dataTransfer.files);
      }
    };

    document.addEventListener("dragenter", handleDrag);
    document.addEventListener("dragleave", handleDrag);
    document.addEventListener("dragover", handleDrag);
    document.addEventListener("drop", handleDrop);

    return () => {
      document.removeEventListener("dragenter", handleDrag);
      document.removeEventListener("dragleave", handleDrag);
      document.removeEventListener("dragover", handleDrag);
      document.removeEventListener("drop", handleDrop);
    };
  }, []);

  return (
    <>
      {dragging && <div className="drop-zone inset-0 fixed z-50" />}
      <input
        ref={fileInput}
        type="file"
        multiple={multiple}
        className="hidden"
        accept={allowedTypes?.map((x) => `${x}/*`).join(",") ?? "*"}
        onChange={handleFileInputChange}
      />
      <div className="h-full">
        {children({ dragging, files: Object.values(files), openFileViewer })}
      </div>
    </>
  );
}

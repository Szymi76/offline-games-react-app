import { Avatar, Tooltip } from "@nextui-org/react";

import { X } from "lucide-react";

type PhotoInputProps = {
  file: File | null;
  onFileChange: (newFile: File | null) => void;
  onClear: () => void;
  defaultUrl?: string;
};
const PhotoInput = (props: PhotoInputProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return props.onFileChange(null);
    props.onFileChange(files[0]);
  };

  return (
    <div className="relative w-min">
      <span className="relative">
        <Avatar
          isBordered
          src={getUrl(props.file, props.defaultUrl)}
          size="lg"
        />
        <input
          type="file"
          className="absolute top-3 h-full w-full opacity-0"
          onChange={handleFileChange}
        />
      </span>
      {(props.file || props.defaultUrl) && (
        <Tooltip content="Wyczyść" placement="bottom">
          <X
            className="absolute -bottom-5 -right-5 hover:text-red-500 transition-all cursor-pointer"
            onClick={props.onClear}
          />
        </Tooltip>
      )}
    </div>
  );
};

export default PhotoInput;

function getUrl(file: File | null, defaultUrl?: string) {
  if (file) return URL.createObjectURL(file);
  else if (defaultUrl) return defaultUrl;
  return undefined;
}

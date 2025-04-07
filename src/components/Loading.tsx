import React from "react";
import { Loader } from "lucide-react";

const Loading = () => {
  return (
    <span className="flex justify-center">
      <Loader className="animate-spin" />
    </span>
  );
};

export default Loading;

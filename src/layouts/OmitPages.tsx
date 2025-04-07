import React from "react";
import { useLocation } from "react-router-dom";

type OmitPagesProps = { element: React.ReactNode; omit: string[] };
const OmitPages = (props: OmitPagesProps) => {
  const { pathname } = useLocation();

  const render = !props.omit.includes(pathname);

  if (render) return props.element;
  return <></>;
};

export default OmitPages;

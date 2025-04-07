import UndoChangesSnackbar from "@/components/UndoChangesSnackbar";
import { MaterialDesignContent, SnackbarProvider } from "notistack";

import styled from "styled-components";

const CustomSnackbar = styled(MaterialDesignContent)(() => ({
  "&.notistack-MuiContent-success": {
    backgroundColor: "#16a34a",
    border: "2px solid #4ade80",
    borderRadius: "0.75rem",
  },
  "&.notistack-MuiContent-error": {
    backgroundColor: "#dc2626",
    border: "2px solid #f87171",
    borderRadius: "0.75rem",
  },
  "&.notistack-MuiContent-default": {
    backgroundColor: "#1f2937",
    border: "2px solid #4b5563",
    borderRadius: "0.75rem",
  },
  "&.notistack-MuiContent-info": {
    backgroundColor: "#2563eb",
    border: "2px solid #60a5fa",
    borderRadius: "0.75rem",
  },
  "&.notistack-MuiContent-warning": {
    backgroundColor: "#d97706",
    border: "2px solid #fbbf24",
    borderRadius: "0.75rem",
  },
}));

type CustomSnackbarProviderProps = { children: React.ReactNode };
const CustomSnackbarProvider = (props: CustomSnackbarProviderProps) => {
  return (
    <SnackbarProvider
      preventDuplicate
      Components={{
        success: CustomSnackbar,
        error: CustomSnackbar,
        default: CustomSnackbar,
        info: CustomSnackbar,
        warning: CustomSnackbar,
        undoChanges: UndoChangesSnackbar,
      }}
    >
      {props.children}
    </SnackbarProvider>
  );
};

export default CustomSnackbarProvider;

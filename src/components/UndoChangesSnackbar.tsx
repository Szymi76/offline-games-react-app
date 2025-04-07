import { Button } from "@nextui-org/react";
import { CustomContentProps, SnackbarContent, useSnackbar } from "notistack";
import { forwardRef, useCallback } from "react";
import { Undo } from "lucide-react";
import { motion } from "framer-motion";

declare module "notistack" {
  interface VariantOverrides {
    undoChanges: true;
  }
}

interface UndoChangesSnackbarProps extends CustomContentProps {
  onUndo?: () => void;
}

const UndoChangesSnackbar = forwardRef<
  HTMLDivElement,
  UndoChangesSnackbarProps
>((props, ref) => {
  const { id, ...restProps } = props;
  const { closeSnackbar } = useSnackbar();
  const duration = restProps.autoHideDuration ?? 1000;

  const handleUndo = useCallback(() => {
    props.onUndo && props.onUndo();
    closeSnackbar(id);
  }, [id, closeSnackbar]);

  return (
    <SnackbarContent ref={ref} className="flex justify-center">
      <div className="relative overflow-hidden rounded-lg border-2 border-default-200 bg-default-100 px-2 pb-3 pt-2">
        <Button
          startContent={<Undo />}
          color="warning"
          variant="flat"
          onPress={handleUndo}
        >
          {restProps.message}
        </Button>
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: 0 }}
          transition={{ duration: duration / 1000 }}
          className="absolute bottom-0 left-0 h-1 bg-warning"
        >
          {""}
        </motion.div>
      </div>
    </SnackbarContent>
  );
});

export default UndoChangesSnackbar;

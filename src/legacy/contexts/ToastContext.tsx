import { toast } from "sonner";

type ToastKind = "success" | "error" | "info" | "warning";

/**
 * Compatibility shim: the ported ToolForge tools call `useToast().showToast`.
 * It is backed by the design-system sonner toaster mounted in __root.tsx.
 */
export function useToast() {
  const showToast = (message: string, kind: ToastKind = "info") => {
    if (kind === "success") toast.success(message);
    else if (kind === "error") toast.error(message);
    else if (kind === "warning") toast.warning(message);
    else toast(message);
  };

  return { showToast };
}

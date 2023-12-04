import SnackbarContext from "./SnackbarContext";
import { useContext } from "react";

export default function useFormValidator() {
  const { openSnackbar } = useContext(SnackbarContext);

  const validateField = (field, message, severity, setIsLoading) => {
    if (!field) {
      setIsLoading(false);
      openSnackbar(message, severity);
      return false;
    }
    return true;
  };

  return validateField;
}

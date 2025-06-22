import { FC } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
} from "@mui/material";
import "./DeleteScopePopup.css";
import { ScopesApiClient } from "../../../api/Clients/ScopeApiClients";

interface DeleteScopePopupProps {
  open: boolean;
  onClose: () => void;
  scopeId: number; 
  onDeleted: () => void;
}

export const DeleteScopePopup: FC<DeleteScopePopupProps> = ({
  open,
  onClose,
  scopeId,
  onDeleted,
}) => {
  const handleDelete = async () => {
    try {
      await ScopesApiClient.deleteOneAsync(scopeId);
      onDeleted(); //notifica ca s a sters scope ul
      onClose(); //inchide popup ul
    } catch (error) {
      console.error("Failed to delete scope:", error);
    }
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <DialogTitle fontSize={20}>
        Are you sure you want to delete this scope?
      </DialogTitle>
      <DialogActions className="delete-scope-modal-actions">
        <Button onClick={onClose} variant="outlined">
          No
        </Button>
        <Button onClick={handleDelete} variant="contained" color="error">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

//dialog-> popup ul 
//dialog title -> afiseaza mesajul de confirmare
//dialog actions -> butoanele de confirmare si anulare

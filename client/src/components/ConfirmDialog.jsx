import React from "react";
import Modal from "./Modal";

const ConfirmDialog = ({ isOpen, title = "Are you sure?", message, onConfirm, onCancel, danger = true }) => {
  return (
    <Modal
      title={title}
      isOpen={isOpen}
      onClose={onCancel}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button className={danger ? "btn btn-danger" : "btn btn-primary"} onClick={onConfirm}>
            Confirm
          </button>
        </>
      }
    >
      <p style={{ margin: 0, color: "var(--color-text-muted)", fontSize: 14 }}>{message}</p>
    </Modal>
  );
};

export default ConfirmDialog;

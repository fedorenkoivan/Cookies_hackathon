import React, { useEffect } from "react";
import { useAuth } from "../hooks/TokenRenewalHook";
import "./TokenRenewalModal.scss";

const SessionRenewalDialog: React.FC = () => {
  const { showRenewalPrompt, handleRenewalResponse } = useAuth();

  useEffect(() => {
    if (showRenewalPrompt) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [showRenewalPrompt]);

  if (!showRenewalPrompt) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog">
        <div className="modal-header">
          <h3>Your session will expire in 3 minutes</h3>
        </div>
        <div className="modal-body">
          <p>Want to extend your session?</p>
        </div>
        <div className="modal-footer">
          <button
            className="modal-button primary"
            onClick={() => handleRenewalResponse(true)}
          >
            Extend
          </button>
          <button
            className="modal-button secondary"
            onClick={() => handleRenewalResponse(false)}
          >
            Not now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionRenewalDialog;

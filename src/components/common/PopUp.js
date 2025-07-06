import React from "react";
import Modal from 'react-bootstrap/Modal';

const Popup = ({ show, onHide, children, hideFooter = true, footerContent = "", title, size="xl", headerImg }) => {
  return (
    <Modal
      {...{ show, onHide }}
      size={size}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{headerImg && <span><img className="trans-icon" src={headerImg} alt=""/></span>}{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {children}
      </Modal.Body>
      {
        !hideFooter && (
          <Modal.Footer className="popup-footer">
            {footerContent()}
          </Modal.Footer>
        )
      }
    </Modal>
  );
}

export default Popup;
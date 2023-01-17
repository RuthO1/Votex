/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";



const GiveVotingRight = ({ save, }) => {
  const [address, setAddress] = useState("");

  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () => address;

  // close the popup modal
  const handleClose = () => {
    setShow(false);
 
  };

  // display the popup modal
  const handleShow = () => setShow(true);

  return (
    <>
      <Button
        onClick={handleShow}
        variant="dark"
        className="rounded-pill px-3 py-3"
      >
         <h1 className="fs-4 fw-bold mb-0 text-white">{"Give Right to Vote"}</h1> 
        
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a new voter</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputAddress"
              label="Address"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Voter Address"
                onChange={(e) => {
                  setAddress(e.target.value);
                }}
              />
            </FloatingLabel>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="dark"
            disabled={!isFormFilled()}
            onClick={() => {
              save(
                address,
              );
              handleClose();
            }}
          >
            Add Voter
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

GiveVotingRight.propTypes = {
  save: PropTypes.func.isRequired,
};

export default GiveVotingRight;

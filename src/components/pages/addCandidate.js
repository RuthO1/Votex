/* eslint-disable react/jsx-filename-extension */
import React, { useState } from "react";
import PropTypes from "prop-types";
import { Button, Modal, Form, FloatingLabel } from "react-bootstrap";



const AddCandidates = ({ save, uploadImage }) => {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [candidateAddress, setCandidateAddress] = useState("");

  const [show, setShow] = useState(false);


  // check if all form data has been filled
  const isFormFilled = () =>
      name && age && image && description;

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
         <h1 className="fs-4 fw-bold mb-0 text-white">{"Add Candidate"}</h1> 
        
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add a new Candidate</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <FloatingLabel
              controlId="inputLocation"
              label="Name"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Name of Candidate"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputAge"
              label="Age"
              className="mb-3"
            >
              <Form.Control
                type="number"
                placeholder="Candidate Age"
                onChange={(e) => {
                  setAge(e.target.value);
                }}
              />
            </FloatingLabel>


            <Form.Control
              type="file"
              className={"mb-3"}
              onChange={async (e) => {
                const imageUrl = await uploadImage(e);
                if (!imageUrl) {
                  alert("failed to upload image");
                  return;
                }
                setImage(imageUrl);
              }}
              placeholder=" Candidate Image"
            ></Form.Control>

            <FloatingLabel
              controlId="inputDescription"
              label="Description"
              className="mb-3"
            >
              <Form.Control
                as="textarea"
                placeholder="description"
                style={{ height: "80px" }}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            </FloatingLabel>

            <FloatingLabel
              controlId="inputAddress"
              label="Address"
              className="mb-3"
            >
              <Form.Control
                type="text"
                placeholder="Candidate Address"
                onChange={(e) => {
                  setCandidateAddress(e.target.value);
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
                name,
                age,
                image,
                description,
                candidateAddress,
              );
              handleClose();
            }}
          >
            Add Candidate
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

AddCandidates.propTypes = {

  // props passed into this component
  save: PropTypes.func.isRequired,
};

export default AddCandidates;

import React from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Button } from "react-bootstrap";
import { truncateAddress } from "../../utils";
import Identicon from ".././ui/Identicon";


const CandidateCard = ({ candidate, Vote }) => {
  const { index, name, age, image, description, candidateAddress, voteCount } = candidate;
  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={candidateAddress} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(candidateAddress)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>

            <Badge bg="secondary" className="ms-auto">
              {voteCount} vote count
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Title>Age: {age}</Card.Title>
          <Card.Text className="flex-grow-1">{description}</Card.Text>
          <Button variant="primary mt-2" onClick={() => Vote(index)}>
               Vote for this candidate
              </Button>

        
        </Card.Body>
      </Card>
    </Col>
  );
};

CandidateCard.propTypes = {

  // props passed into this component
  candidate: PropTypes.instanceOf(Object).isRequired,
};

export default CandidateCard;

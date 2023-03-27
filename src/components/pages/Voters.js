import React from 'react'
import { ListGroup } from 'react-bootstrap'

export const Voters = ({VotersList}) => {

  return (
<>
<h5> Voters </h5>
{VotersList.map((voters) => (
    
    <ListGroup >
   <ListGroup.Item className="mb-2" >{voters}</ListGroup.Item>
    </ListGroup>

    ))}
   
    </>
  );
  
}

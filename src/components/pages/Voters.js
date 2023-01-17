import React from 'react'
import { ListGroup } from 'react-bootstrap'

export const Voters = ({VotersList}) => {

  return (
<>
<h1> Voters </h1>
{VotersList.map((voters) => (
    
    <ListGroup >
   <ListGroup.Item className="mb-2" >{voters}</ListGroup.Item>
    </ListGroup>

    ))}
   
    </>
  );
  
}

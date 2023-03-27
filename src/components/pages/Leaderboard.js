import React from 'react';
import { Table } from 'react-bootstrap';

export const Leaderboard = ({ leaderboard }) => {
  return (
    <>
    <h1>Leader board</h1>
    <Table striped bordered hover>
    <thead>
      <tr>
        <th>#</th>
        <th>Address</th>
        <th>Name</th>
        <th>Vote Count</th>
      </tr>
    </thead>
    <tbody>
      {leaderboard.map((lb, index) => (
        <tr key={index}>
          <td>{index + 1}</td>
          <td>{lb._address}</td>
          <td>{lb.name}</td>
          <td>{lb.voteCount}</td>
        </tr>
      ))}
    </tbody>
  </Table>
  </>
);
  
}

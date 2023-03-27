import axios from "axios";

import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
require("dotenv").config({ path: ".env" });

const getAccessToken = () => {
  return process.env.REACT_APP_WEB3STORAGE_API_KEY;
};
const makeStorageClient = () => {
  return new Web3Storage({ token: getAccessToken() });
};

const upload = (file) => {
  const client = makeStorageClient();
  const file_cid = client.put(file);
  return file_cid;
};

export const makeFileObjects = (file, file_name) => {
  const blob = new Blob([JSON.stringify(file)], { type: "application/json" });
  const files = [new File([blob], `${file_name}.json`)];

  return files;
};

export const uploadImage = async (e) => {
  const image = e.target.files;
  const image_name = image[0].name;

  if (!image) return;
  // Pack files into a CAR and send to web3.storage
  const cid = await upload(image); // Promise<CIDString>
  const image_url = `https://${cid}.ipfs.w3s.link/${image_name}`;

  return image_url;
};

export const addCandidate = async (
  name,
  age,
  image,
  description,
  candidateAddress,
  address,
  votingContract
) => {
  const data = JSON.stringify({
    name: name,
    age: age,
    image: image,
    description: description,
    candidateAddress: candidateAddress,
  });

  try {
    const files = makeFileObjects(data, name);
    const file_cid = await upload(files);

    const url = `https://${file_cid}.ipfs.w3s.link/${name}.json`;
    console.log(url);

    // settting a new Candidate
    await votingContract.methods
      .setCandidate(candidateAddress, url, name)
      .send({ from: address });
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

const fetchMeta = async (url) => {
  try {
    if (!url) return null;
    const meta = await axios.get(url);
    const data = JSON.parse(meta.data);
    return data;
  } catch (e) {
    console.log({ e });
  }
};

export const getCandidate = async (votingContract) => {
  try {
    const candidates = [];
    const candidatesLength = await votingContract.methods
      .getCandidateLength()
      .call();
    for (let i = 0; i < Number(candidatesLength); i++) {
      const candidate = new Promise(async (resolve) => {
        const res = await votingContract.methods.getCandidateData(i).call();
        const meta = await fetchMeta(res[3]);

        resolve({
          index: i,
          name: meta.name,
          age: meta.age,
          image: meta.image,
          description: meta.description,
          candidateAddress: res[2],
          voteCount: res[1],
        });
      });
      candidates.push(candidate);
    }
    return Promise.all(candidates);
  } catch (e) {
    console.log({ e });
  }
};

export const givetVotingRight = async (votingContract, _address, address) => {
  try {
    await votingContract.methods
      .giveVoterRight(_address)
      .send({ from: address });
  } catch (e) {
    console.log({ e });
  }
};

export const getVotersList = async (votingContract) => {
  try {
    const votersList = await votingContract.methods.getVotersList().call();

    return votersList;
  } catch (e) {
    console.log({ e });
  }
};

export const getLeaderboard = async (votingContract) => {
  try {
    const leaderBoard = await votingContract.methods.getLeaderboard().call();
    return leaderBoard;
   
  } catch (e) {
    console.log({ e });
  }
};
export const fetchAdmin = async (votingContract) => {
  try {
    const adminAddress = await votingContract.methods.getAdmin().call();

    return adminAddress;
  } catch (e) {
    console.log({ e });
  }
};

export const voting = async (votingContract, index, address) => {
  try {
    await votingContract.methods.vote(index).send({ from: address });
  } catch (e) {
    console.log({ e });
  }
};

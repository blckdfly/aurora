import { create } from 'ipfs-http-client';
import { Buffer } from 'buffer';
window.Buffer = Buffer;

const projectId = '55ceaeea90a24a6ead1c01a6c3030c1f';
const projectSecret = 'mK5M8Gftg0UkQPY+C/fBaHZIUc09LAHBlIjOVRqYKQRVdUcxPnP0iA';
const auth = 'Basic ' + Buffer.from(projectId + ':' + projectSecret).toString('base64');

export const ipfsClient = create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth,
  },
});

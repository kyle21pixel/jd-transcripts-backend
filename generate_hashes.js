// This script generates bcrypt hashes for your admin and transcriber passwords
const bcrypt = require('bcryptjs');

const adminPassword = 'admin@new';
const transcriberPassword = 'trans1@new';

bcrypt.hash(adminPassword, 10, (err, adminHash) => {
  if (err) throw err;
  console.log('Admin hash:', adminHash);
  bcrypt.hash(transcriberPassword, 10, (err, transcriberHash) => {
    if (err) throw err;
    console.log('Transcriber hash:', transcriberHash);
  });
});

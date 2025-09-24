import { exec } from 'child_process';
import { createHash } from 'crypto';
import { createReadStream, watch } from 'node:fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

let currentHash = null;

const __dirname = dirname(fileURLToPath(import.meta.url));
watch(`${__dirname}/../../apps/api/openapi-spec.json`, () => {
  // the file you want to get the hash
  console.log('[api-client-generator] Change detected');
  const fd = createReadStream(`${__dirname}/../../apps/api/openapi-spec.json`);
  const hash = createHash('sha1');
  hash.setEncoding('hex');

  fd.on('end', function () {
    hash.end();
    const newHash = hash.read();
    console.log('[api-client-generator] New hash', newHash);
    if (currentHash === newHash) {
      console.log('[api-client-generator] No changes in the API spec');
      return;
    }
    currentHash = newHash;

    console.log('[api-client-generator] Generating API client...');
    exec('yarn workspace api client:build', err => {
      if (err) {
        console.log('[api-client-generator] Error', err);
        return;
      }
      console.log('[api-client-generator] API client generated successfully');
    });
  });

  fd.pipe(hash);
});

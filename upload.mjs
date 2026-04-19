import { v2 as cloudinary } from 'cloudinary';
import { readdirSync, statSync } from 'fs';
import { join } from 'path';

cloudinary.config({
  cloud_name: 'deuttziac',
  api_key: '732393772858198',
  api_secret: 'p4MJ7lYtGwtt8yWthTQFUuiierU',
});

async function uploadFolder(localPath, cloudFolder) {
  const items = readdirSync(localPath);
  for (const item of items) {
    const fullPath = join(localPath, item);
    if (statSync(fullPath).isDirectory()) {
      await uploadFolder(fullPath, `${cloudFolder}/${item}`);
    } else if (/\.(jpg|jpeg|png|webp)$/i.test(item)) {
      await cloudinary.uploader.upload(fullPath, {
        folder: cloudFolder,
        use_filename: true,
        unique_filename: false,
        overwrite: false,
      });
      console.log(`✅ ${fullPath}`);
    }
  }
}

await uploadFolder('public/vetement_femme', 'vetement_femme');
console.log('🎉 Upload terminé !');
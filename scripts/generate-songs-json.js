const fs = require("fs");
const path = require("path");
const mm = require("music-metadata");

console.log("Starting script...");
console.log("Working directory:", process.cwd());
console.log("Song directory exists:", fs.existsSync("./songs"));

const audioExtensions = [".mp3", ".ogg", ".flac", ".wav"];
const baseUrl = "https://ethan-hawksley.github.io/audio/";
const songsRoot = path.resolve("./songs");

function formatSongName(filename) {
  const nameWithoutExt = path.parse(filename).name;
  const withSpaces = nameWithoutExt
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return withSpaces.replace(/\b\w/g, (c) => c.toUpperCase());
}

async function getAudioFiles(dir) {
  const files = fs.readdirSync(dir).filter((file) => {
    const filePath = path.join(dir, file);
    return (fs.statSync(filePath).isFile() && audioExtensions.includes(path.extname(file)));
  });
  return await Promise.all(files.map(async (file) => {
    const filePath = path.join(dir, file);
    let duration;
    try {
      const metadata = await mm.parseFile(filePath);
      duration = metadata.format.duration ? Math.round(metadata.format.duration) : null;
    } catch (e) {
      duration = null;
    }
    const absoluteFilePath = path.resolve(dir, file);
    const relativePath = path
      .relative(songsRoot, absoluteFilePath)
      .replace(/\\/g, "/");
    return {
      name: formatSongName(file), url: baseUrl + "songs/" + relativePath, duration,
    };
  }),);
}

async function getFolders(dir) {
  const entries = fs.readdirSync(dir).filter((file) => {
    const filePath = path.join(dir, file);
    return fs.statSync(filePath).isDirectory();
  });
  return await Promise.all(entries.map(async (folder) => {
    const folderPath = path.join(dir, folder);
    const absoluteFolderPath = path.resolve(folderPath);
    const relativeFolderPath = path
      .relative(songsRoot, absoluteFolderPath)
      .replace(/\\/g, "/");
    const files = await getAudioFiles(folderPath);
    const subfolders = await getFolders(folderPath, relativeFolderPath);
    return {
      name: relativeFolderPath, files, folders: subfolders.length > 0 ? subfolders : [],
    };
  }),);
}

(async () => {
  const name = "root";
  const files = await getAudioFiles("./songs");
  const folders = await getFolders("./songs");

  console.log(JSON.stringify({name, files, folders}));

  fs.writeFileSync("songs.json", JSON.stringify({name, files, folders}, null, 2),);
})();

# Soundboard

## About

The backend repository that hosts the audio for the [soundboard](https://github.com/olliee2/soundboard).
This repository automatically runs the GitHub action responsible for generating the `songs.json` file used by the
soundboard.

## Usage & Hosting

### Running the script locally.

1. Ensure you have Node installed locally. If you don't have it, you can download it from https://nodejs.org/en/download
   or from your package manager.

2. Clone the repository:
   ```sh
    git clone https://github.com/olliee2/audio.git
   cd soundboard
   ```

3. Install dependencies:
    ```sh
   npm install
    ```

4. Build and run the project:
   ```sh
   node scripts/generate-songs-json.js
   ```
   This will run the JSON generation script and update the `songs.json` file to be accurate to the current songs in the
   repository.

### Deploying to GitHub Pages

1. Push your repository to GitHub.
2. Navigate to your repository settings, and to the Pages section.
3. Set to deploy from your `main` branch, and the `/` directory. Wait for GitHub to finish building the project.
4. Visit your newly deployed site!

import esbuild from 'esbuild';
import { glob } from 'glob';

// Find all .js files inside your scripts directory
const entryPoints = await glob('src/scripts/**/*.js');

try {
  const result = await esbuild.build({
    entryPoints: entryPoints,
    bundle: true,
    minify: true,
    platform: 'browser',
    outdir: 'dist',
    metafile: true, // Crucial: Tells esbuild to generate metadata about the build
  });

  // Extract the generated output file paths from the metadata object
  const generatedFiles = Object.keys(result.metafile.outputs);

  console.log('\n🚀 Build completed successfully! Generated files:');
  generatedFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  console.log(''); // Visual padding

} catch (error) {
  console.error('❌ Build failed:', error);
  process.exit(1);
}

const rollup = require('rollup');
const babel =  require('rollup-plugin-babel');
const clear = require('rollup-plugin-clear');
const fs = require('fs');
const copy = require('rollup-plugin-copy');


const htmlContent = fs.readFileSync('./src/index.html');


const inputOptions = {
  input: 'src/js/index.js',
  plugins: [
    clear({
      targets: ["dist"],
    }),
    copy({
      targets: [
        {
          src: ['src/*'],
          dest: 'dist'
        }
      ]
    }),    
    babel({
      'presets': ['@babel/preset-env']
    }),
  ]
};

const outputOptions = {
  file: './dist/js/index.js'
};

async function build() {
  const bundle = await rollup.rollup(inputOptions);
  await bundle.generate(outputOptions);
  await bundle.write(outputOptions);
  fs.writeFileSync('dist/index.html', String(htmlContent).replace('index.js', `index.js?_t=${+ new Date()}`))
}

build();



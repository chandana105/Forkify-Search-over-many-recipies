const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: ['./src/js/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/bundle.js',
  },
  devServer: {
    contentBase: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
    }),
  ],
  module : {
    rules : [
      {
        test: /\.js$/,
        exclude : /node_modules/, 
        use : {
          loader : 'babel-loader'

        }
      }
    ]
  }
};




// to export this configuration object so that webpack can then take this object and can work on it, now in configuraion in webpack there are four core concepts: entry point, output, loaders and plugins , so onceewe re done wewant mode to be rpodction so not toalways change here lets go to packge .json
// plugins recives array of lplugins they recieve, and htmlwebpackpluign is a fxn cosntru and uska insance krna ho we use new, now to pass in some options as object, comon pattern in modernjs isto pass otions asin  object
// so we want to copy each time that we re bundling js fiels as above of htl plugin we also want tocopy our source html into the dist folder and inclue scrit to js bundle so this would be our src dn that html file would be our final and ready to go production hmtl file, templet is strtign html ifel and this can aso be use dto create new htm lfiel fro mscrath alredy without provinfng any template , u can see there are some apps that dont even have an idnex.html fiel in thier src code but instead its automacticlly genreted on the fly by webpack, sice after runnign copied index.html fiel not visble in js folder as webpack dev server not saving the data on the disk, it ll simply stream them to server , see dev ttol elemts it automaticlly like magic injected js into it ie script, so if u want tosee the index.hmt lfile to run any oneof script dev or bild

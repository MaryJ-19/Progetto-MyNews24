const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");
const Dotenv = require('dotenv-webpack');




module.exports = {
  entry: {
    index: "./src/js/index.js", //file js principale da cui prendere il codice
  },
  output: {
    path: path.resolve(__dirname, "dist"), //file di output dove mettere il codice buildato
    filename: "bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"], //permette di usare sass
      },
      {
        test: /\.js$/i,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", //riscrive il js in modo che sia leggibile anche per le versioni precedenti
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",  //crea il file html nella dist
      title: "Applicazione myNews24",
    }),  
    new MiniCssExtractPlugin({
        filename: "styles/css/style.css", // crea il file css nella dist
    }),
    new CopyWebpackPlugin({
        patterns: [
            { from: "src/assets/img/favicon.ico", to: "favicon.ico" },
            { from: "src/assets/img/logo.png", to: "logo.png" } // crea una copia della favicon nella dist
        ],
    }),
    new Dotenv() // rende utilizzabili nel progetto le variabili d'ambiente del file .env
  ],
  devServer: {
    port: 5500, //in quale porta si aprirà il progetto 
    open: true, //apre una nuova pagina
    static: path.resolve(__dirname, "dist"),
    // hot: false, 
  },
//   mode: "development",
};

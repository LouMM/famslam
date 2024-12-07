import path from 'path'; import HtmlWebpackPlugin from 'html-webpack-plugin';
import { Configuration as WebpackConfiguration } from 'webpack';
import { Configuration as WebpackDevServerConfiguration } from 'webpack-dev-server'

interface Configuration extends WebpackConfiguration {
    devServer?: WebpackDevServerConfiguration;
}
const config: Configuration = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/index.tsx',
    devtool: process.env.NODE_ENV === 'production' ? false : 'inline-source-map',
    devServer: {
        static: './dist',
        hot: true,
        port: 3000
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',],

                    },
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(mp3|wav) $/,
                type: 'asset/resource',
                generator: {
                    filename: 'sounds/[name][ext]'
                }
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    output: {
        filename: '[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist'),
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'public/index.html'
        })
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    }
};

export default config;

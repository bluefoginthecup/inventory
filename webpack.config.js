const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 플러그인 추가

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true, // 빌드 전에 dist 폴더 정리
    },
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.m?js$/, // JavaScript 파일 처리
                exclude: /node_modules\/(?!(firebase)\/).*/, // Firebase 모듈은 변환에 포함
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'], // 최신 문법을 변환
                    },
                },
            },
            {
                test: /\.css$/, // CSS 파일 처리
                use: [
                    MiniCssExtractPlugin.loader, // 스타일을 별도의 파일로 추출
                    'css-loader', // CSS 파일 해석
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html', // 기존 HTML 파일을 템플릿으로 사용
            filename: 'index.html', // 생성될 HTML 파일 이름
        }),
        new MiniCssExtractPlugin({
            filename: 'styles.css', // 추출될 CSS 파일 이름
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 5000,
    },
    devtool: 'source-map',
};

const path = require("path")
const CracoLessPlugin = require("craco-less");
/*
craco.config.js完成less rem适配 postcss-pxtorem
https://blog.csdn.net/m0_59093266/article/details/123656569
*/
module.exports = {
    webpack: {
        // 配置别名，@代表res根目录
        alias: {
            "@": path.resolve(__dirname, "src")
        }
    },
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
    style: {
        postcss: {
            mode: 'extends',
            loaderOptions: {
                postcssOptions: {
                    ident: 'postcss',
                    plugins: [
                        [
                            'postcss-pxtorem',
                            {
                                rootValue: 75, // 根元素字体大小
                                // propList: ['width', 'height']
                                propList: ['*']
                            },
                        ],
                    ],
                },
            },
        },
    },

}
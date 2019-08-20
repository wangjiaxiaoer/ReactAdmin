const { override, fixBabelImports,addLessLoader } = require('customize-cra');

// module.exports = function overrider(config, env) {
//     // do stuff with the wepack config
//     return config;
// }

module.exports = override(
    // 针对antd 实现按需打包：根据import来打包，（使用babel-plugin-import）
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        // style:'css',
        style:true,
    }),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars:{'@primary-color':'#0c9076'},
    })
)
module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "ClipBoard Manager",
        appId: "org.decodeBuzzing.clipboardManager",
        win: {
          target: ["nsis"],
          icon: "public/Icon.png",
        },
        nsis: {
          installerIcon: "public/Icon.ico",
          uninstallerIcon: "public/Icon.ico",
          oneClick: false,
          uninstallDisplayName: "EC ClipBoard Manager",
          allowToChangeInstallationDirectory: true,
        },
      },
      nodeIntegration: true,
    },
  },
}

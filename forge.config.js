module.exports = {
  packagerConfig: {
    name: 'CAD-BIM Cloud Platform',
    executableName: 'cad-bim-platform',
    icon: './build/icon',
    asar: true,
    extraResource: [
      './public'
    ],
    appBundleId: 'com.cadbim.platform',
    appCategoryType: 'public.app-category.graphics-design',
    win32metadata: {
      CompanyName: 'CAD/BIM Solutions',
      FileDescription: 'Professional Architecture & Engineering Management',
      ProductName: 'CAD/BIM Cloud Platform',
    }
  },
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'CAD_BIM_Platform',
        authors: 'CAD/BIM Solutions',
        description: 'Professional CAD/BIM Management System',
        setupIcon: './build/icon.ico',
        loadingGif: './build/installing.gif',
      }
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin', 'linux']
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        options: {
          maintainer: 'CAD/BIM Solutions',
          homepage: 'https://github.com',
          icon: './build/icon.png',
          categories: ['Graphics', 'Engineering'],
          genericName: 'CAD/BIM Platform',
        }
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        icon: './build/icon.icns',
        name: 'CAD-BIM-Platform',
        background: './build/dmg-background.png',
      }
    }
  ]
};

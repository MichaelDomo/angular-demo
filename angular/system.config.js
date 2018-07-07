System.config({    transpiler: 'typescript',
    typescriptOptions: {
        emitDecoratorMetadata: true
    },
    paths: {
        'tether': 'https://cdnjs.cloudflare.com/ajax/libs/tether/1.2.0/js/tether.js',
    },
    map: {
        'app': '/angular/src',
        '@angular/core': '/angular/node_modules/@angular/core/bundles/core.umd.js',
        '@angular/common': '/angular/node_modules/@angular/common/bundles/common.umd.js',
        '@angular/compiler': '/angular/node_modules/@angular/compiler/bundles/compiler.umd.js',
        '@angular/platform-browser': '/angular/node_modules/@angular/platform-browser/bundles/platform-browser.umd.js',
        '@angular/platform-browser-dynamic': '/angular/node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic.umd.js',
        '@angular/http': '/angular/node_modules/@angular/http/bundles/http.umd.js',
        '@angular/router': '/angular/node_modules/@angular/router/bundles/router.umd.js',
        '@angular/forms': '/angular/node_modules/@angular/forms/bundles/forms.umd.js',
        '@angular/core/testing': '/angular/node_modules/@angular/core/bundles/core-testing.umd.js',
        '@angular/common/testing': '/angular/node_modules/@angular/common/bundles/common-testing.umd.js',
        '@angular/compiler/testing': '/angular/node_modules/@angular/compiler/bundles/compiler-testing.umd.js',
        '@angular/platform-browser/testing': '/angular/node_modules/@angular/platform-browser/bundles/platform-browser-testing.umd.js',
        '@angular/platform-browser-dynamic/testing': '/angular/node_modules/@angular/platform-browser-dynamic/bundles/platform-browser-dynamic-testing.umd.js',
        '@angular/http/testing': '/angular/node_modules/@angular/http/bundles/http-testing.umd.js',
        '@angular/router/testing': '/angular/node_modules/@angular/router/bundles/router-testing.umd.js',
        'rxjs': '/angular/node_modules/rxjs',
        'ng-lightning': '/angular/node_modules/ng-lightning/bundles/ng-lightning.umd.js',
        '@ngx-translate/core': '/angular/node_modules/@ngx-translate/core/bundles/core.umd.js',
        '@ngx-translate/http-loader': '/angular/node_modules/@ngx-translate/http-loader/bundles/http-loader.umd.js'
    },
    packages: {
        app: {
            main: 'main.ts',
            defaultExtension: 'ts'
        },
        rxjs: {
            defaultExtension: 'js'
        }
    }
});
System.import('app').catch(console.error.bind(console));
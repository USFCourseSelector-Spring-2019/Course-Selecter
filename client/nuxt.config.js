const nodeExternals = require('webpack-node-externals'),
    resolve = (dir) => require('path').join(__dirname, dir),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    jwt = require('express-jwt'),
    { secret } = require('./api_helpers/constants.js')

function noop() {}
const ENABLE_AUTH = true

module.exports = Object.assign({
    /*
     ** Headers of the page
     */
    head: {
        title: 'USF Course Selecter',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: 'Course Selecter' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
            { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
        ]
    },
    plugins: [
        '~/plugins/cart.js',
        {
            src: '~/plugins/client-side.js',
            ssr: false
        }
    ],
    css: [
        '~/assets/style/app.styl',
        '~/assets/style/app.scss'
    ],
    modules: [
        '@nuxtjs/axios',
        '@nuxtjs/vuetify',
        ENABLE_AUTH && '@nuxtjs/auth',
        process.env.LOCAL_DEV ? false : '@nuxtjs/pwa', ['nuxt-neo', {
            directory: __dirname + '/api',
            bodyParsers: ['json', 'urlencoded'],
            middleware: ENABLE_AUTH ? [
                (req) => cookieParser()(req, req.res, noop),
                (req) => bodyParser.json()(req, req.res, noop),
                (req) => jwt({
                    secret
                }).unless({
                    path: [
                        '/api/auth/login',
                        /\/api\/courses/i,
                        /\/api\/payments/i
                    ]
                })(req, req.res, noop)

            ] : []
        }]
    ].filter(Boolean),
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/api/auth/login',
                        propertyName: 'token.accessToken'
                    },
                    logout: {
                        url: '/api/auth/logout',
                        method: 'post'
                    },
                    user: {
                        url: '/api/auth/user',
                        method: 'get',
                        propertyName: 'user'
                    }
                }
            }
        },
        redirect: {
            login: '/sign-in',
            logout: '/signed-out',
            home: '/'
        }
    },
    vuetify: {
        theme: {
            primary: '#00543C',
            'primary-fg': '#FFF',
            secondary: '#FCBA30',
            'secondary-fg': '#000'
        }
    },
    /*
     ** Customize the progress bar color
     */
    loading: { color: '#3B8070' },
    /*
     ** Build configuration
     */
    build: {
        babel: {
            plugins: []
        },
        extractCSS: true,
        /*
         ** Run ESLint on save
         */
        extend(config, ctx) {
            if (false) {
                config.module.rules.push({
                    enforce: 'pre',
                    test: /\.(js|vue)$/,
                    loader: 'eslint-loader',
                    exclude: /(node_modules)/
                })
            }
            if (ctx.isServer) {
                config.externals = [
                    nodeExternals({
                        whitelist: [/^vuetify/]
                    })
                ]
            }
        }
    }
}, ENABLE_AUTH ? {
    router: {
        middleware: ['auth']
    }
} : {})
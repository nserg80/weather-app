// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    css: [
        '~/assets/css/main.css',
        '~/assets/css/common.css',
    ],

    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },

    app: {
        head: {
            title: 'Weather Forecast',
            meta: [
                { name: 'Weather Forecast', content: 'Weather Forecast' }
            ],
            link: [
                { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
                { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '',  },
                { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@400;700&family=Roboto:wght@400;500;700;900&display=swap' },
            ],
        }
    }
})

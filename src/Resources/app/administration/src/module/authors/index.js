import './page/author-listing-page';
import './page/author-form-page';

const { Module } = Shopware;

Module.register('swag-training-authors', {
    type: 'plugin',
    name: 'authors',
    title: 'authors.general.mainMenuItemGeneral',
    description: 'authors.general.descriptionTextModule',
    version: '0.0.1',
    targetVersion: '0.0.1',
    color: '#FFCC00',
    icon: 'default-device-dashboard',
    favicon: 'icon-module-dashboard.png',

    routes: {
        index: {
            components: {
                default: 'author-listing-page'
            },
            path: 'index'
        },
        form: {
            components: {
                default: 'author-form-page'
            },
            path: 'form'
        }
    },

    navigation: [{
        id: 'authors.listing',
        label: 'authors.general.mainMenuItemGeneral',
        color: '#FFCC00',
        icon: 'default-device-dashboard',
        path: 'swag.training.authors.index',
        position: 1
    }]
});

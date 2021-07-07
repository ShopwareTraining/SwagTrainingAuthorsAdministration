import template from './template.html.twig';
import './style.scss';

const {Component, Mixin} = Shopware;
const {Criteria} = Shopware.Data;

Component.register('author-listing-page', {
    template,

    inject: [
        'repositoryFactory',
        'acl'
    ],

    mixins: [
        Mixin.getByName('listing'),
        Mixin.getByName('notification')
    ],

    metaInfo() {
        return {
            title: 'Authors overview'
        };
    },

    data() {
        return {
            authors: null,
            isLoading: false
        };
    },

    computed: {
        authorRepository() {
            return this.repositoryFactory.create('author');
        }
    },

    createdComponent() {
        this.getList();
    },

    methods: {
        getCriteria() {
            const criteria = new Criteria(this.page, this.limit);

            if (this.term) {
                criteria.setTerm(this.term);
            }

            criteria.addSorting(
                Criteria.sort('name', 'ASC')
            );

            return criteria;
        },

        getList() {
            this.isLoading = true;
            this.authorRepository.search(this.getCriteria(), Shopware.Context.api).then(result => {
                this.authors = result;
                this.total = result.total;
                return result;
            }).finally(() => {
                this.isLoading = false;
            });
        },

        onInlineEditSave(author) {
            author.save();
        },

        getGridColumns() {
            return [{
                property: 'name',
                label: 'authors.listing.name',
                routerLink: 'swag.training.authors.form',
                allowResize: true,
                primary: true
            }, {
                property: 'description',
                label: 'authors.listing.description',
                allowResize: true
            }, {
                property: 'birthdate',
                label: 'authors.listing.birthdate',
                allowResize: true
            }]
        }
    }
});

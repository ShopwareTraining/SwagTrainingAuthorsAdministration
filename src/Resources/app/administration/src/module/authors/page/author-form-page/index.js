import template from './template.html.twig';
import './style.scss';

const {Component, Mixin} = Shopware;
const {Criteria} = Shopware.Data;

Component.register('swag-training-authors-form-page', {
    template,

    inject: [
        'repositoryFactory',
        'acl'
    ],

    mixins: [
        Mixin.getByName('notification'),
        Mixin.getByName('placeholder')
    ],

    metaInfo() {
        return {
            title: 'Authors form'
        };
    },

    data() {
        return {
            author: {},
            isLoading: false,
            isSaveSuccessful: false,
            customFieldSets: []
        };
    },

    computed: {
        identifier() {
            return this.placeholder(this.author, 'name');
        },
        authorRepository() {
            return this.repositoryFactory.create('author');
        },
        customFieldSetRepository() {
            return this.repositoryFactory.create('custom_field_set');
        },
        customFieldSetCriteria() {
            const criteria = new Criteria();
            criteria.addFilter(Criteria.equals('relations.entityName', 'author'));
            criteria.getAssociation('customFields')
                .addSorting(Criteria.sort('config.customFieldPosition', 'ASC', true));
            return criteria;
        }
    },

    watch: {
        authorId() {
            if (!this.authorId) {
                this.createdComponent();
            }
        }
    },

    created() {
        this.loadAuthor();
        this.loadCustomFieldSets();
    },

    methods: {
        loadAuthor() {
            this.isLoading = true;
            if (!this.authorId) {
                this.authorId = this.$route.query.id;
                if (!this.authorId) {
                    this.authorId = this.$route.params.id;
                }

                this.authorRepository.get(this.authorId, Shopware.Context.api).then((result) => {
                    this.author = result;
                    this.isLoading = false;
                });
            }
        },

        loadCustomFieldSets() {
            this.customFieldSetRepository.search(this.customFieldSetCriteria)
                .then(items => {
                    this.customFieldSets = items;
                })
                .catch(() => {
                    this.createNotificationError({
                        message: this.$tc('sw-settings-search.notification.loadError')
                    });
                });
        },

        loadEntityData() {
            this.author = this.authorRepository.get(this.authorId, Shopware.Context.api).then((author) => {
                this.author = author;
            });
        },

        saveFinish() {
            this.isSaveSuccessful = false;
        },

        onSave() {
            this.isSaveSuccessful = false;
            this.isLoading = true;

            return this.authorRepository.save(this.author, Shopware.Context.api).then(() => {
                this.isSaveSuccessful = true;
                if (!this.authorId) {
                    this.$router.push({ name: 'author.form', params: { id: this.author.id } });
                }

                this.authorRepository.get(this.author.id, Shopware.Context.api).then((updatedCurrency) => {
                    this.author = updatedCurrency;
                    this.isLoading = false;
                });
            }).catch(() => {
                this.createNotificationError({
                    message: this.$tc('detail.form.notificationErrorMessage')
                });
                this.isLoading = false;
            });
        },

        onCancel() {
            this.$router.push({ name: 'author.index' });
        },
    }
});

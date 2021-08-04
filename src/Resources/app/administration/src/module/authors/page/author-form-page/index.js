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
            customFieldSets: [],
            datepickerConfig: {
                dateFormat: "Y-m-d"
            }
        };
    },

    computed: {
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

    created() {
        this.loadAuthor();
        this.loadCustomFieldSets();
    },

    methods: {
        loadAuthor() {
            this.isLoading = true;
            this.author = this.authorRepository.create(Shopware.Context.api);
            this.loadAuthorId();

            this.authorRepository.get(this.authorId, Shopware.Context.api).then((author) => {
                if (author) {
                    this.author = author;
                }

                this.isLoading = false;
            });
        },

        loadAuthorId() {
            if (!this.authorId) {
                this.authorId = this.$route.query.id;
                if (!this.authorId) {
                    this.authorId = this.$route.params.id;
                }
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

        saveFinish() {
            this.isSaveSuccessful = false;
        },

        onSaveAndContinue() {
            this.save(() => {
                if (!this.authorId) {
                    this.$router.push({name: 'swag.training.authors.form', params: {id: this.author.id}});
                }

                this.isLoading = true;
                this.authorRepository.get(this.author.id, Shopware.Context.api).then(author => {
                    this.author = author;
                    this.isLoading = false;
                });
            });
        },

        onSave() {
            this.save(() => {
                this.$router.push({name: 'swag.training.authors.index'});
            });
        },

        save(postSaveAction) {
            this.saveFinish();
            this.isLoading = true;

            return this.authorRepository.save(this.author, Shopware.Context.api).then(() => {
                this.isSaveSuccessful = true;
                this.isLoading = false;

                postSaveAction();
            }).catch(() => {
                this.createNotificationError({
                    message: this.$tc('detail.form.notificationErrorMessage')
                });
                this.isLoading = false;
            });
        },

        onCancel() {
            this.$router.push({name: 'swag.training.authors.index'});
        }
    }
});
